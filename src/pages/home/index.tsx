import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading, { SceneLoading } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import WeatherCard from '@/components/WeatherCard';
import OutfitCard from '@/components/OutfitCard';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { WeatherData, OutfitRecommend } from '@/types';
import { mockWeather } from '@/data/weather';
import { mockRecommendations } from '@/data/outfits';
import { delay } from '@/utils';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { withLoading, isLoading } = useGlobalLoading();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [recommendations, setRecommendations] = useState<OutfitRecommend[]>([]);
  const [recommendError, setRecommendError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = async () => {
    setWeatherError(false);
    await delay(800);
    setWeather(mockWeather);
  };

  const loadRecommendations = async () => {
    setRecommendError(false);
    await delay(500);
    setRecommendations(mockRecommendations);
  };

  const loadAllData = async () => {
    console.log('[HomePage] Loading all data via global Loading...');
    try {
      await Promise.all([
        withLoading('weather', loadWeather).catch((e) => {
          console.error('[HomePage] Weather load failed:', e);
          setWeatherError(true);
        }),
        withLoading('recommend', loadRecommendations).catch((e) => {
          console.error('[HomePage] Recommendations load failed:', e);
          setRecommendError(true);
        })
      ]);
    } catch (error) {
      console.error('[HomePage] Critical load error:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const onRefresh = async () => {
    console.log('[HomePage] Pull down refresh');
    setRefreshing(true);
    Taro.showNavigationBarLoading();
    await loadAllData();
    Taro.hideNavigationBarLoading();
    Taro.stopPullDownRefresh();
    setRefreshing(false);
  };

  useEffect(() => {
    Taro.eventCenter.on('__taroPullDownRefresh', onRefresh);
    return () => {
      Taro.eventCenter.off('__taroPullDownRefresh', onRefresh);
    };
  }, []);

  const handleCardClick = (item: OutfitRecommend) => {
    console.log('[HomePage] Click recommend item:', item.id);
    Taro.navigateTo({ url: '/pages/recommend-detail/index' });
  };

  const handleReloadWeather = async () => {
    console.log('[HomePage] Manual reload weather');
    await withLoading('weather', loadWeather).catch(() => setWeatherError(true));
  };

  const handleBrowseRecommend = () => {
    console.log('[HomePage] Browse all recommendations');
    Taro.showToast({ title: '正在加载全部推荐', icon: 'none' });
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={onRefresh}
      refresherEnabled
      refresherTriggered={refreshing || isLoading('weather') || isLoading('recommend')}
    >
      <View className={styles.header}>
        <Text className={styles.greeting}>Hi，今天穿什么？</Text>
        <Text className={styles.subGreeting}>根据天气为你推荐最合适的穿搭 ✨</Text>
      </View>

      <View className={styles.section}>
        <SceneLoading scene='weather' variant='default'>
          {weatherError || !weather ? (
            <EmptyState
              type='weather-empty'
              compact
              onPrimaryButtonClick={handleReloadWeather}
              onSecondaryButtonClick={handleBrowseRecommend}
            />
          ) : (
            <WeatherCard weather={weather} />
          )}
        </SceneLoading>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipIcon}>💡</Text>
        <View className={styles.tipContent}>
          <Text className={styles.tipTitle}>今日穿搭小贴士</Text>
          <Text className={styles.tipDesc}>
            {weather
              ? `${weather.temperature}°C ${weather.weather}，建议穿着轻薄透气的衣物，别忘了防晒哦~`
              : '获取天气信息后查看穿搭建议'}
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>为你推荐</Text>
          <Text className={styles.sectionMore}>查看更多 →</Text>
        </View>

        <SceneLoading scene='recommend' variant='default'>
          {recommendError || recommendations.length === 0 ? (
            <EmptyState
              icon='👗'
              title='暂无穿搭推荐'
              description='AI正在为你挑选合适的穿搭，稍后再来看看吧~'
              primaryButtonText='刷新推荐'
              onPrimaryButtonClick={loadAllData}
              compact
            />
          ) : (
            <View className={styles.recommendGrid}>
              {recommendations.map((item) => (
                <View className={styles.recommendItem} key={item.id}>
                  <OutfitCard data={item} type='recommend' onClick={() => handleCardClick(item)} />
                </View>
              ))}
            </View>
          )}
        </SceneLoading>
      </View>
    </ScrollView>
  );
};

export default HomePage;

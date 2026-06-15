import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import WeatherCard from '@/components/WeatherCard';
import OutfitCard from '@/components/OutfitCard';
import { WeatherData, OutfitRecommend, LoadingState } from '@/types';
import { mockWeather } from '@/data/weather';
import { mockRecommendations } from '@/data/outfits';
import { delay } from '@/utils';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [weatherLoading, setWeatherLoading] = useState<LoadingState>('loading');
  const [recommendLoading, setRecommendLoading] = useState<LoadingState>('loading');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendations, setRecommendations] = useState<OutfitRecommend[]>([]);

  const loadData = async () => {
    setWeatherLoading('loading');
    setRecommendLoading('loading');
    
    console.log('[HomePage] Loading weather and recommendations...');
    
    try {
      await delay(800);
      setWeather(mockWeather);
      setWeatherLoading('success');
      
      await delay(500);
      setRecommendations(mockRecommendations);
      setRecommendLoading('success');
    } catch (error) {
      console.error('[HomePage] Load data error:', error);
      setWeatherLoading('error');
      setRecommendLoading('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    console.log('[HomePage] Pull down refresh');
    Taro.showNavigationBarLoading();
    await loadData();
    Taro.hideNavigationBarLoading();
    Taro.stopPullDownRefresh();
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

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToUpper={onRefresh}
      refresherEnabled
      refresherTriggered={weatherLoading === 'loading' || recommendLoading === 'loading'}
    >
      <View className={styles.header}>
        <Text className={styles.greeting}>Hi，今天穿什么？</Text>
        <Text className={styles.subGreeting}>根据天气为你推荐最合适的穿搭 ✨</Text>
      </View>

      <View className={styles.section}>
        {weatherLoading === 'loading' ? (
          <Loading text='正在获取天气信息...' />
        ) : weatherLoading === 'error' || !weather ? (
          <EmptyState
            icon='🌤️'
            title='暂无天气数据'
            description='请检查网络连接后重试'
            buttonText='重新加载'
            onButtonClick={loadData}
          />
        ) : (
          <WeatherCard weather={weather} />
        )}
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipIcon}>💡</Text>
        <View className={styles.tipContent}>
          <Text className={styles.tipTitle}>今日穿搭小贴士</Text>
          <Text className={styles.tipDesc}>
            {weather ? `${weather.temperature}°C ${weather.weather}，建议穿着轻薄透气的衣物，别忘了防晒哦~` : '获取天气信息后查看穿搭建议'}
          </Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>为你推荐</Text>
          <Text className={styles.sectionMore}>查看更多 →</Text>
        </View>

        {recommendLoading === 'loading' ? (
          <Loading text='正在生成穿搭推荐...' />
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon='👗'
            title='暂无穿搭推荐'
            description='稍后再来看看吧'
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
      </View>
    </ScrollView>
  );
};

export default HomePage;

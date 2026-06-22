import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading, { SceneLoading } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import WeatherCard from '@/components/WeatherCard';
import OutfitCard from '@/components/OutfitCard';
import CityPicker from '@/components/CityPicker';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { OutfitRecommend, CityInfo, WeatherData } from '@/types';
import { mockRecommendations, generateStyledRecommendations } from '@/data/outfits';
import { getOutfitTips } from '@/data/weather';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { withLoading, isLoading } = useGlobalLoading();
  const { weather, weatherError, loadWeather, loadWeatherByLocation } = useAppStore();
  const [recommendations, setRecommendations] = useState<OutfitRecommend[]>([]);
  const [recommendError, setRecommendError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cityPickerVisible, setCityPickerVisible] = useState(false);
  const initializedRef = useRef(false);
  const loadingLockRef = useRef(false);

  const loadRecommendations = useCallback(() => {
    setRecommendError(false);
    const styledRecs = generateStyledRecommendations();
    setRecommendations(styledRecs);
  }, []);

  const loadAllData = useCallback(async () => {
    if (loadingLockRef.current) return;
    loadingLockRef.current = true;
    console.log('[HomePage] Loading all data...');
    try {
      await Promise.all([
        withLoading('weather', async () => {
          const hasWeather = useAppStore.getState().weather;
          if (!hasWeather) {
            await loadWeatherByLocation();
          } else {
            await loadWeather();
          }
        }).catch((e) => {
          console.error('[HomePage] Weather load failed:', e);
        }),
        withLoading('recommend', loadRecommendations).catch((e) => {
          console.error('[HomePage] Recommendations load failed:', e);
          setRecommendError(true);
        })
      ]);
    } catch (error) {
      console.error('[HomePage] Critical load error:', error);
    } finally {
      loadingLockRef.current = false;
    }
  }, [withLoading, loadWeather, loadWeatherByLocation, loadRecommendations]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadAllData();
    }
  }, [loadAllData]);

  const onRefresh = useCallback(async () => {
    if (loadingLockRef.current) return;
    console.log('[HomePage] Pull down refresh');
    setRefreshing(true);
    Taro.showNavigationBarLoading();
    try {
      await loadAllData();
    } finally {
      Taro.hideNavigationBarLoading();
      Taro.stopPullDownRefresh();
      setRefreshing(false);
    }
  }, [loadAllData]);

  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    const handler = () => onRefreshRef.current();
    Taro.eventCenter.on('__taroPullDownRefresh', handler);
    return () => {
      Taro.eventCenter.off('__taroPullDownRefresh', handler);
    };
  }, []);

  const handleCardClick = (item: OutfitRecommend) => {
    console.log('[HomePage] Click recommend item:', item.id);
    Taro.navigateTo({ url: `/pages/outfit-detail/index?outfitId=${item.id}` });
  };

  const handleReloadWeather = useCallback(async () => {
    console.log('[HomePage] Manual reload weather');
    const hasWeather = useAppStore.getState().weather;
    await withLoading('weather', () =>
      hasWeather ? loadWeather() : loadWeatherByLocation()
    );
  }, [withLoading, loadWeather, loadWeatherByLocation]);

  const handleBrowseRecommend = () => {
    console.log('[HomePage] Browse all recommendations');
    Taro.showToast({ title: '正在加载全部推荐', icon: 'none' });
  };

  const handleCityClick = () => {
    setCityPickerVisible(true);
  };

  const handleCitySelect = useCallback(
    async (city: CityInfo) => {
      console.log('[HomePage] Select city:', city.name);
      await withLoading('weather', () => loadWeather(city));
      Taro.showToast({ title: `已切换到${city.name}`, icon: 'success' });
    },
    [withLoading, loadWeather]
  );

  const getFilteredRecommendations = useCallback((weatherData: WeatherData | null): OutfitRecommend[] => {
    const testItems = recommendations.filter((item) => item.style === '测试');
    const normalItems = recommendations.filter((item) => item.style !== '测试');

    if (!weatherData) {
      return [...normalItems.slice(0, 10), ...testItems];
    }

    const temp = weatherData.temperature;
    const weatherType = weatherData.weather;
    const filtered = normalItems.filter((item) => {
      const tempRange = item.temperatureRange.replace(/°/g, '').split('-').map(Number);
      if (tempRange.length === 2) {
        const [low, high] = tempRange;
        if (temp < low - 8 || temp > high + 8) return false;
      }
      if (
        (weatherType.includes('雨') && item.weatherType !== '晴' && !item.tags.includes('防晒')) ||
        (!weatherType.includes('雨') && !weatherType.includes('雪'))
      ) {
        return true;
      }
      return item.weatherType === weatherType || item.weatherType === '多云';
    });
    return [...filtered.slice(0, 10), ...testItems];
  }, [recommendations]);

  const displayRecommendations = weather ? getFilteredRecommendations(weather) : recommendations;

  const getImageRatio = (index: number): number => {
    const ratios = [1.5, 1.3, 1.7, 1.4, 1.6, 1.25, 1.55, 1.35, 1.65, 1.45];
    return ratios[index % ratios.length];
  };

  const getWaterfallColumns = (items: OutfitRecommend[]): { left: OutfitRecommend[]; right: OutfitRecommend[] } => {
    const left: OutfitRecommend[] = [];
    const right: OutfitRecommend[] = [];
    let leftHeight = 0;
    let rightHeight = 0;

    items.forEach((item, index) => {
      const ratio = getImageRatio(index);
      const cardHeight = 300 * ratio + 100;

      if (leftHeight <= rightHeight) {
        left.push(item);
        leftHeight += cardHeight;
      } else {
        right.push(item);
        rightHeight += cardHeight;
      }
    });

    return { left, right };
  };

  const getImageRatioForItem = (item: OutfitRecommend): number => {
    const items = displayRecommendations;
    const index = items.findIndex((i) => i.id === item.id);
    return getImageRatio(index >= 0 ? index : 0);
  };

  const waterfallColumns = getWaterfallColumns(displayRecommendations);

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
            <WeatherCard weather={weather} onCityClick={handleCityClick} />
          )}
        </SceneLoading>
      </View>

      <View className={styles.tipCard}>
        <Text className={styles.tipIcon}>💡</Text>
        <View className={styles.tipContent}>
          <Text className={styles.tipTitle}>今日穿搭小贴士</Text>
          <Text className={styles.tipDesc}>
            {weather ? getOutfitTips(weather) : '获取天气信息后查看穿搭建议'}
          </Text>
        </View>
      </View>

      {weather && (
        <View className={styles.travelTipCard}>
          <Text className={styles.tipIcon}>✈️</Text>
          <View className={styles.tipContent}>
            <Text className={styles.tipTitle}>异地出行提醒</Text>
            <Text className={styles.tipDesc}>
              当前城市{weather.city.fullName || weather.city.name}
              {weather.tomorrow ? `，明日${weather.tomorrow.weather} ${weather.tomorrow.tempLow}°~${weather.tomorrow.tempHigh}°` : ''}
              ，点击上方城市名可切换查看其他城市穿搭。
            </Text>
          </View>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>为你推荐</Text>
          <Text className={styles.sectionMore}>查看更多 →</Text>
        </View>

        <SceneLoading scene='recommend' variant='default'>
          {recommendError || displayRecommendations.length === 0 ? (
            <EmptyState
              icon='👗'
              title='暂无穿搭推荐'
              description='AI正在为你挑选合适的穿搭，稍后再来看看吧~'
              primaryButtonText='刷新推荐'
              onPrimaryButtonClick={loadAllData}
              compact
            />
          ) : (
            <View className={styles.waterfallContainer}>
              <View className={styles.waterfallColumn}>
                {waterfallColumns.left.map((item, idx) => (
                  <View className={styles.waterfallItem} key={item.id}>
                    <OutfitCard
                      data={item}
                      type='recommend'
                      imageRatio={getImageRatio(displayRecommendations.findIndex((i) => i.id === item.id))}
                      onClick={() => handleCardClick(item)}
                    />
                  </View>
                ))}
              </View>
              <View className={styles.waterfallColumn}>
                {waterfallColumns.right.map((item) => (
                  <View className={styles.waterfallItem} key={item.id}>
                    <OutfitCard
                      data={item}
                      type='recommend'
                      imageRatio={getImageRatio(displayRecommendations.findIndex((i) => i.id === item.id))}
                      onClick={() => handleCardClick(item)}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
        </SceneLoading>
      </View>

      <CityPicker
        visible={cityPickerVisible}
        onClose={() => setCityPickerVisible(false)}
        onSelect={handleCitySelect}
      />
    </ScrollView>
  );
};

export default HomePage;

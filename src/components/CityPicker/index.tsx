import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { CityInfo } from '@/types';
import { HOT_CITIES, searchCity } from '@/services/weatherService';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

interface CityPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: CityInfo) => void;
}

const CityPicker: React.FC<CityPickerProps> = ({ visible, onClose, onSelect }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<CityInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const { withLoading } = useGlobalLoading();
  const { recentCities, currentCity, loadWeatherByLocation } = useAppStore();

  useEffect(() => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await withLoading('city-search', () => searchCity(keyword));
        setSearchResults(results);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, withLoading]);

  const handleLocation = useCallback(async () => {
    try {
      await withLoading('location', loadWeatherByLocation);
      Taro.showToast({ title: '定位成功', icon: 'success' });
      onClose();
    } catch (error) {
      Taro.showToast({ title: '定位失败，请重试', icon: 'none' });
    }
  }, [loadWeatherByLocation, onClose, withLoading]);

  const handleSelectCity = useCallback(
    (city: CityInfo) => {
      onSelect(city);
      onClose();
    },
    [onClose, onSelect]
  );

  const isCurrentCity = (city: CityInfo) => {
    if (!currentCity) return false;
    return city.name === currentCity.name && city.isLocation === currentCity.isLocation;
  };

  if (!visible) return null;

  return (
    <View className={styles.cityPicker} onClick={onClose}>
      <View className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <View className={styles.header}>
          <View />
          <Text className={styles.title}>选择城市</Text>
          <View className={styles.closeBtn} onClick={onClose}>
            ✕
          </View>
        </View>

        <ScrollView className={styles.content} scrollY>
          <View className={styles.searchBar}>
            <Text className={styles.searchIcon}>🔍</Text>
            <Input
              className={styles.searchInput}
              placeholder='搜索城市名称'
              value={keyword}
              onInput={(e) => setKeyword(e.detail.value)}
              confirmType='search'
            />
          </View>

          {!keyword.trim() && (
            <>
              <View className={styles.locationRow}>
                <View className={styles.locationLabel}>
                  <Text className={styles.locationIcon}>📍</Text>
                  <Text>当前定位</Text>
                </View>
                <View className={styles.locationBtn} onClick={handleLocation}>
                  <Text>重新定位</Text>
                </View>
              </View>

              {recentCities.length > 0 && (
                <View className={styles.section}>
                  <Text className={styles.sectionTitle}>最近访问</Text>
                  <View className={styles.cityGrid}>
                    {recentCities.map((city) => (
                      <View
                        key={`recent-${city.name}-${city.isLocation ? 'loc' : 'man'}`}
                        className={`${styles.cityTag} ${
                          isCurrentCity(city) ? styles.cityTagActive : ''
                        } ${city.isLocation ? styles.cityTagLocation : ''}`}
                        onClick={() => handleSelectCity(city)}
                      >
                        <Text>{city.isLocation ? '📍 ' : ''}{city.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View className={styles.section}>
                <Text className={styles.sectionTitle}>热门城市</Text>
                <View className={styles.cityGrid}>
                  {HOT_CITIES.map((city) => (
                    <View
                      key={`hot-${city.name}`}
                      className={`${styles.cityTag} ${
                        isCurrentCity(city) ? styles.cityTagActive : ''
                      }`}
                      onClick={() => handleSelectCity(city)}
                    >
                      <Text>{city.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {keyword.trim() && (
            <View className={styles.searchResults}>
              {searching ? null : searchResults.length > 0 ? (
                searchResults.map((city) => (
                  <View
                    key={`search-${city.name}`}
                    className={styles.searchItem}
                    onClick={() => handleSelectCity(city)}
                  >
                    <Text className={styles.searchItemName}>{city.fullName || city.name}</Text>
                    <Text className={styles.searchItemIcon}>→</Text>
                  </View>
                ))
              ) : (
                <View className={styles.emptyState}>
                  <Text>未找到相关城市，试试其他关键词吧</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default CityPicker;

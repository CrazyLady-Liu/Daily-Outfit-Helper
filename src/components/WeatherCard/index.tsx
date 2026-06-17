import React from 'react';
import { View, Text } from '@tarojs/components';
import { WeatherData } from '@/types';
import { getTomorrowOutfitTips } from '@/data/weather';
import styles from './index.module.scss';

interface WeatherCardProps {
  weather: WeatherData;
  onCityClick?: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, onCityClick }) => {
  const tomorrowTips = getTomorrowOutfitTips(weather.tomorrow);

  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <View className={styles.cityRow} onClick={onCityClick}>
          <Text className={styles.city}>
            {weather.city.isLocation ? '📍 ' : ''}
            {weather.city.fullName || weather.city.name}
          </Text>
          <Text className={styles.cityArrow}>▼</Text>
        </View>
        <Text className={styles.weatherIcon}>{weather.icon}</Text>
      </View>

      <View className={styles.mainTemp}>
        <Text className={styles.tempValue}>{weather.temperature}</Text>
        <Text className={styles.tempUnit}>°C</Text>
      </View>

      <Text className={styles.weatherDesc}>
        {weather.weather} · 体感 {weather.feelsLike}°C
      </Text>

      <View className={styles.details}>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>💧</Text>
          <Text>湿度 {weather.humidity}%</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>🌬️</Text>
          <Text>{weather.wind}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailIcon}>☀️</Text>
          <Text>紫外线 {weather.uvIndex}</Text>
        </View>
      </View>

      <View className={styles.divider} />

      <View className={styles.weekList}>
        {weather.weekWeather.map((item, index) => (
          <View
            key={index}
            className={`${styles.weekItem} ${index === 1 ? styles.weekItemTomorrow : ''}`}
          >
            <Text className={styles.weekDay}>{item.day}</Text>
            <Text className={styles.weekIcon}>{item.icon}</Text>
            <Text className={styles.weekTemp}>
              {item.tempLow}°/{item.tempHigh}°
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.tomorrowSection}>
        <View className={styles.tomorrowHeader}>
          <Text className={styles.tomorrowIcon}>👗</Text>
          <Text className={styles.tomorrowTitle}>明日穿搭预判</Text>
        </View>
        <View className={styles.tomorrowContent}>
          <View className={styles.tomorrowWeather}>
            <Text className={styles.tomorrowWeatherIcon}>{weather.tomorrow.icon}</Text>
            <View>
              <Text className={styles.tomorrowWeatherText}>
                {weather.tomorrow.weather}
              </Text>
              <Text className={styles.tomorrowTempText}>
                {weather.tomorrow.tempLow}°C ~ {weather.tomorrow.tempHigh}°C
              </Text>
            </View>
          </View>
          <Text className={styles.tomorrowTips}>{tomorrowTips}</Text>
        </View>
      </View>

      {weather.updateTime && (
        <Text className={styles.updateTime}>更新于 {weather.updateTime}</Text>
      )}
    </View>
  );
};

export default WeatherCard;

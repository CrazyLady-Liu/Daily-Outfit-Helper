import React from 'react';
import { View, Text } from '@tarojs/components';
import { WeatherData } from '@/types';
import { mockWeekWeather } from '@/data/weather';
import styles from './index.module.scss';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.city}>{weather.city}</Text>
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
        {mockWeekWeather.map((item, index) => (
          <View key={index} className={styles.weekItem}>
            <Text className={styles.weekDay}>{item.day}</Text>
            <Text className={styles.weekIcon}>{item.icon}</Text>
            <Text className={styles.weekTemp}>{item.temp}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeatherCard;

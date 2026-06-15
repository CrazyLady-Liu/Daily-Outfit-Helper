import { WeatherData } from '@/types';

export const mockWeather: WeatherData = {
  city: '上海市',
  temperature: 24,
  feelsLike: 26,
  weather: '多云',
  humidity: 65,
  wind: '东南风 3级',
  icon: '⛅',
  uvIndex: 4
};

export const mockWeekWeather = [
  { day: '今天', temp: '18°/24°', weather: '多云', icon: '⛅' },
  { day: '明天', temp: '17°/23°', weather: '小雨', icon: '🌧️' },
  { day: '周三', temp: '16°/22°', weather: '晴', icon: '☀️' },
  { day: '周四', temp: '18°/25°', weather: '多云', icon: '⛅' },
  { day: '周五', temp: '20°/27°', weather: '晴', icon: '☀️' },
  { day: '周六', temp: '19°/26°', weather: '阴', icon: '☁️' },
  { day: '周日', temp: '18°/24°', weather: '小雨', icon: '🌧️' }
];

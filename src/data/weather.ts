import { WeatherData, CityInfo, DayWeather } from '@/types';

export const HOT_CITIES: CityInfo[] = [
  { name: '北京', fullName: '北京市' },
  { name: '上海', fullName: '上海市' },
  { name: '广州', fullName: '广州市' },
  { name: '深圳', fullName: '深圳市' },
  { name: '杭州', fullName: '杭州市' },
  { name: '成都', fullName: '成都市' },
  { name: '武汉', fullName: '武汉市' },
  { name: '西安', fullName: '西安市' },
  { name: '南京', fullName: '南京市' },
  { name: '重庆', fullName: '重庆市' },
  { name: '苏州', fullName: '苏州市' },
  { name: '长沙', fullName: '长沙市' }
];

const weatherIconMap: Record<string, string> = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '⛈️',
  '雷阵雨': '⛈️',
  '小雪': '🌨️',
  '中雪': '🌨️',
  '大雪': '❄️',
  '雾': '🌫️',
  '霾': '🌫️'
};

export const getWeatherIcon = (weather: string): string => {
  for (const key of Object.keys(weatherIconMap)) {
    if (weather.includes(key)) return weatherIconMap[key];
  }
  return '🌤️';
};

export const generateWeekWeather = (baseTemp: number = 24): DayWeather[] => {
  const days = ['今天', '明天', '周三', '周四', '周五', '周六', '周日'];
  const weathers = ['晴', '多云', '阴', '小雨', '晴', '多云', '雷阵雨'];
  return days.map((day, index) => {
    const tempOffset = Math.floor(Math.random() * 5) - 2;
    const high = baseTemp + tempOffset + Math.floor(Math.random() * 3);
    const low = high - 6 - Math.floor(Math.random() * 4);
    return {
      day,
      tempHigh: high,
      tempLow: low,
      weather: weathers[index],
      icon: getWeatherIcon(weathers[index])
    };
  });
};

export const generateWeatherByCity = (city: CityInfo): WeatherData => {
  const seed = city.name.length;
  const baseTemp = 20 + (seed % 10);
  const weekWeather = generateWeekWeather(baseTemp);
  const today = weekWeather[0];
  const tomorrow = weekWeather[1];
  const currentTemp = Math.floor((today.tempHigh + today.tempLow) / 2) + Math.floor(Math.random() * 3);

  return {
    city,
    temperature: currentTemp,
    feelsLike: currentTemp + 2,
    weather: today.weather,
    humidity: 55 + Math.floor(Math.random() * 30),
    wind: ['东南风 3级', '东风 2级', '西北风 4级', '南风 2级'][seed % 4],
    icon: today.icon,
    uvIndex: 3 + Math.floor(Math.random() * 6),
    today,
    tomorrow,
    weekWeather,
    updateTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  };
};

export const mockWeather: WeatherData = generateWeatherByCity({
  name: '上海',
  fullName: '上海市',
  isLocation: true
});

export const getOutfitTips = (weather: WeatherData): string => {
  const temp = weather.temperature;
  const w = weather.weather;
  if (temp >= 30) {
    return `今日高温${temp}°C，建议穿着轻薄透气的短袖、短裤或连衣裙，注意防晒补水${w.includes('雨') ? '，随身携带雨伞' : ''}~`;
  }
  if (temp >= 25) {
    return `${temp}°C ${w}，建议穿着短袖、薄衬衫搭配长裤或半身裙${w.includes('雨') ? '，记得带伞' : '，注意防晒'}~`;
  }
  if (temp >= 20) {
    return `${temp}°C ${w}，建议穿着长袖T恤、薄针织衫或轻薄外套，舒适又百搭~`;
  }
  if (temp >= 15) {
    return `${temp}°C ${w}，建议穿着风衣、卫衣或薄毛衣，早晚温差大注意添衣~`;
  }
  if (temp >= 10) {
    return `${temp}°C ${w}，建议穿着夹克、毛衣搭配长裤，注意保暖~`;
  }
  return `${temp}°C ${w}，天气较冷，建议穿着厚外套、羽绒服，注意防寒保暖~`;
};

export const getTomorrowOutfitTips = (tomorrow: DayWeather): string => {
  const avgTemp = Math.floor((tomorrow.tempHigh + tomorrow.tempLow) / 2);
  if (avgTemp >= 28) {
    return `明日${tomorrow.weather}，高温${tomorrow.tempHigh}°C，建议穿短袖短裤，做好防晒${tomorrow.weather.includes('雨') ? '并带伞' : ''}。`;
  }
  if (avgTemp >= 22) {
    return `明日${tomorrow.weather}，${tomorrow.tempLow}°C~${tomorrow.tempHigh}°C，建议穿轻薄长袖或短袖搭配长裤。`;
  }
  if (avgTemp >= 16) {
    return `明日${tomorrow.weather}，${tomorrow.tempLow}°C~${tomorrow.tempHigh}°C，建议穿卫衣、薄外套或风衣。`;
  }
  return `明日${tomorrow.weather}，${tomorrow.tempLow}°C~${tomorrow.tempHigh}°C，温度较低，建议穿厚外套注意保暖。`;
};

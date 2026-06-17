import Taro from '@tarojs/taro';
import { CityInfo, WeatherData } from '@/types';
import { HOT_CITIES, generateWeatherByCity } from '@/data/weather';
import { delay } from '@/utils';

export interface LocationResult {
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
}

export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    const permission = await Taro.getSetting();
    if (permission.authSetting['scope.userLocation'] === false) {
      const modal = await Taro.showModal({
        title: '需要定位权限',
        content: '获取当前位置以提供准确的天气信息',
        confirmText: '去设置',
        cancelText: '取消'
      });
      if (modal.confirm) {
        await Taro.openSetting();
      }
      throw new Error('定位权限被拒绝');
    }

    const res = await Taro.getLocation({
      type: 'gcj02',
      isHighAccuracy: true
    });

    let cityName = '当前位置';
    try {
      const geoRes = await Taro.request({
        url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=your_baidu_ak&output=json&coordtype=gcj02ll&location=${res.latitude},${res.longitude}`,
      });
      if (geoRes.data?.result?.addressComponent?.city) {
        cityName = geoRes.data.result.addressComponent.city.replace('市', '');
      }
    } catch (e) {
      cityName = '上海市';
    }

    return {
      latitude: res.latitude,
      longitude: res.longitude,
      city: cityName
    };
  } catch (error) {
    console.warn('[WeatherService] 获取定位失败，使用默认城市:', error);
    return {
      latitude: 31.2304,
      longitude: 121.4737,
      city: '上海'
    };
  }
};

export const searchCity = async (keyword: string): Promise<CityInfo[]> => {
  await delay(300);
  if (!keyword.trim()) return [];
  const lower = keyword.toLowerCase();
  return HOT_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(lower) ||
      (c.fullName && c.fullName.toLowerCase().includes(lower))
  );
};

export const fetchWeatherByCity = async (city: CityInfo): Promise<WeatherData> => {
  await delay(500);
  return generateWeatherByCity(city);
};

export const fetchWeatherByLocation = async (): Promise<WeatherData> => {
  const loc = await getCurrentLocation();
  const city: CityInfo = {
    name: loc.city || '当前位置',
    fullName: loc.city ? `${loc.city}市` : undefined,
    latitude: loc.latitude,
    longitude: loc.longitude,
    isLocation: true
  };
  return fetchWeatherByCity(city);
};

export const fetchWeather = async (city?: CityInfo): Promise<WeatherData> => {
  if (city) {
    return fetchWeatherByCity(city);
  }
  return fetchWeatherByLocation();
};

export { HOT_CITIES };

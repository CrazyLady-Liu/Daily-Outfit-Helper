import { create } from 'zustand';
import Taro from '@tarojs/taro';
import { OutfitPhoto, ScoreRecord, StyleTag, UserInfo, WeatherData, CityInfo } from '@/types';
import { mockOutfitPhotos } from '@/data/outfits';
import { mockScoreRecords as mockScores } from '@/data/scores';
import { mockStyleTags } from '@/data/tags';
import { getAvatarImage } from '@/utils';
import { fetchWeather, fetchWeatherByLocation } from '@/services/weatherService';

interface AppState {
  outfitPhotos: OutfitPhoto[];
  scoreRecords: ScoreRecord[];
  styleTags: StyleTag[];
  userInfo: UserInfo;
  currentCity: CityInfo | null;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  recentCities: CityInfo[];
  addOutfitPhoto: (photo: OutfitPhoto) => void;
  addScoreRecord: (record: ScoreRecord) => void;
  addStyleTag: (tag: StyleTag) => void;
  removeStyleTag: (id: string) => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  setCurrentCity: (city: CityInfo) => void;
  loadWeather: (city?: CityInfo) => Promise<void>;
  loadWeatherByLocation: () => Promise<void>;
  addRecentCity: (city: CityInfo) => void;
}

const STORAGE_KEY_RECENT = 'recent_cities';
const MAX_RECENT = 5;

let _weatherRequestLock = false;

const loadRecentCities = (): CityInfo[] => {
  try {
    const data = Taro.getStorageSync(STORAGE_KEY_RECENT);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRecentCities = (cities: CityInfo[]) => {
  try {
    Taro.setStorageSync(STORAGE_KEY_RECENT, JSON.stringify(cities));
  } catch {
    // ignore
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  outfitPhotos: [],
  scoreRecords: [],
  styleTags: mockStyleTags,
  userInfo: {
    nickname: '时尚小达人',
    avatar: getAvatarImage(64),
    totalOutfits: 0,
    totalScores: 0,
    favoriteStyle: '暂无'
  },
  currentCity: null,
  weather: null,
  weatherLoading: false,
  weatherError: null,
  recentCities: loadRecentCities(),

  addOutfitPhoto: (photo) =>
    set((state) => ({
      outfitPhotos: [photo, ...state.outfitPhotos],
      userInfo: {
        ...state.userInfo,
        totalOutfits: state.userInfo.totalOutfits + 1
      }
    })),
  addScoreRecord: (record) =>
    set((state) => ({
      scoreRecords: [record, ...state.scoreRecords],
      userInfo: {
        ...state.userInfo,
        totalScores: state.userInfo.totalScores + 1
      }
    })),
  addStyleTag: (tag) =>
    set((state) => ({
      styleTags: [...state.styleTags, tag]
    })),
  removeStyleTag: (id) =>
    set((state) => ({
      styleTags: state.styleTags.filter((t) => t.id !== id)
    })),
  updateUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info }
    })),

  setCurrentCity: (city) => {
    set({ currentCity: city });
    get().addRecentCity(city);
  },

  loadWeather: async (city) => {
    if (_weatherRequestLock) return;
    _weatherRequestLock = true;
    set({ weatherLoading: true, weatherError: null });
    try {
      const targetCity = city || get().currentCity;
      const weatherData = await fetchWeather(targetCity || undefined);
      if (targetCity) {
        get().setCurrentCity(targetCity);
      } else {
        set({ currentCity: weatherData.city });
        get().addRecentCity(weatherData.city);
      }
      set({ weather: weatherData });
    } catch (error) {
      set({ weatherError: error instanceof Error ? error.message : '获取天气失败' });
    } finally {
      set({ weatherLoading: false });
      _weatherRequestLock = false;
    }
  },

  loadWeatherByLocation: async () => {
    if (_weatherRequestLock) return;
    _weatherRequestLock = true;
    set({ weatherLoading: true, weatherError: null });
    try {
      const weatherData = await fetchWeatherByLocation();
      set({
        weather: weatherData,
        currentCity: weatherData.city
      });
      get().addRecentCity(weatherData.city);
    } catch (error) {
      set({ weatherError: error instanceof Error ? error.message : '获取定位天气失败' });
    } finally {
      set({ weatherLoading: false });
      _weatherRequestLock = false;
    }
  },

  addRecentCity: (city) => {
    set((state) => {
      const filtered = state.recentCities.filter(
        (c) => c.name !== city.name || c.isLocation !== city.isLocation
      );
      const updated = [city, ...filtered].slice(0, MAX_RECENT);
      saveRecentCities(updated);
      return { recentCities: updated };
    });
  }
}));

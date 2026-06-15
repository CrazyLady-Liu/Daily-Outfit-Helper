export interface WeatherData {
  city: string;
  temperature: number;
  feelsLike: number;
  weather: string;
  humidity: number;
  wind: string;
  icon: string;
  uvIndex: number;
}

export interface OutfitRecommend {
  id: string;
  title: string;
  description: string;
  image: string;
  temperatureRange: string;
  weatherType: string;
  tags: string[];
  style: string;
}

export interface OutfitPhoto {
  id: string;
  image: string;
  description: string;
  date: string;
  tags: string[];
  style: string;
  season: string;
}

export interface ScoreRecord {
  id: string;
  image: string;
  score: number;
  overallComment: string;
  details: ScoreDetail[];
  suggestions: string[];
  date: string;
}

export interface ScoreDetail {
  category: string;
  score: number;
  comment: string;
}

export interface StyleTag {
  id: string;
  name: string;
  color: string;
  count: number;
  icon?: string;
}

export interface UserInfo {
  nickname: string;
  avatar: string;
  totalOutfits: number;
  totalScores: number;
  favoriteStyle: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

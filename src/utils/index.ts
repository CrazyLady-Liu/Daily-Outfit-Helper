import Taro from '@tarojs/taro';

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatDate = (date: string): string => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}月${day}日`;
};

export const getScoreLevel = (score: number): { text: string; color: string } => {
  if (score >= 90) return { text: '优秀', color: '#52C41A' };
  if (score >= 80) return { text: '良好', color: '#1890FF' };
  if (score >= 70) return { text: '中等', color: '#FAAD14' };
  if (score >= 60) return { text: '及格', color: '#FF7D00' };
  return { text: '待提升', color: '#FF4D4F' };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  console.log(`[Track] ${eventName}`, params || '');
};

export const checkNetwork = async (): Promise<boolean> => {
  try {
    const res = await Taro.getNetworkType();
    return res.networkType !== 'none';
  } catch (error) {
    console.error('[Utils] Check network error:', error);
    return false;
  }
};

export type ImageCategory = 'outfit' | 'avatar' | 'fashion' | 'nature';

export type ImageSize = 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | 'square_hd';

const FALLBACK_COLORS = [
  '#FFE4E6', '#FCE7F3', '#F3E8FF', '#E0E7FF', '#DBEAFE',
  '#CFFAFE', '#CCFBF1', '#D1FAE5', '#ECFCCB', '#FEF3C7'
];

const getFallbackGradient = (seed: number): string => {
  const color1 = FALLBACK_COLORS[seed % FALLBACK_COLORS.length];
  const color2 = FALLBACK_COLORS[(seed + 3) % FALLBACK_COLORS.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#g)" />
      <text x="50%" y="50%" font-family="sans-serif" font-size="48" fill="#999" text-anchor="middle" dominant-baseline="middle">👗</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const getPromptForCategory = (category: ImageCategory): string => {
  const prompts: Record<ImageCategory, string> = {
    outfit: 'fashion outfit, stylish clothing, elegant apparel, modern fashion photography, high quality',
    avatar: 'portrait, person face, avatar, professional photo, soft lighting',
    fashion: 'fashion clothing, stylish wear, trendy outfit, boutique style',
    nature: 'natural scenery, outdoor landscape, beautiful view, nature photography'
  };
  return prompts[category];
};

export const getImageUrl = (
  seed: number,
  width: number = 400,
  height: number = 600,
  category: ImageCategory = 'outfit'
): string => {
  try {
    const sizeMap: Record<string, ImageSize> = {
      '400/600': 'portrait_4_3',
      '500/700': 'portrait_4_3',
      '200/200': 'square',
      '400/400': 'square',
      '600/400': 'landscape_4_3'
    };
    const sizeKey = `${width}/${height}`;
    const imageSize = sizeMap[sizeKey] || 'portrait_4_3';
    const prompt = encodeURIComponent(getPromptForCategory(category));
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${imageSize}`;
  } catch (error) {
    console.warn('[Utils] Failed to generate image URL, using fallback:', error);
    return getFallbackGradient(seed);
  }
};

export const getOutfitImage = (seed: number, width: number = 400, height: number = 600): string => {
  return getImageUrl(seed, width, height, 'outfit');
};

export const getAvatarImage = (seed: number = 64): string => {
  return getImageUrl(seed, 200, 200, 'avatar');
};

export const getFallbackImage = (seed: number): string => {
  return getFallbackGradient(seed);
};

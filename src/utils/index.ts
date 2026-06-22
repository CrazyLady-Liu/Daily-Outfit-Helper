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

export type OutfitStyle =
  | '休闲风'
  | '通勤风'
  | '甜酷风'
  | '复古风'
  | '学院风'
  | '甜美风'
  | '极简风'
  | '法式风'
  | '街头风'
  | '运动风'
  | '森系风'
  | '国风'
  | '暗黑风'
  | '度假风'
  | '朋克风'
  | '文艺风'
  | '少女风'
  | '测试';

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

interface StylePromptConfig {
  clothing: string;
  silhouette: string;
  colors: string;
  shoes: string;
  scene: string;
  mood: string;
}

const STYLE_PROMPT_MAP: Record<OutfitStyle, StylePromptConfig> = {
  '休闲风': {
    clothing: 'knit sweater, casual top, loose fit',
    silhouette: 'relaxed fit, comfortable silhouette',
    colors: 'beige, cream, light blue, soft neutrals',
    shoes: 'white sneakers, flat shoes',
    scene: 'cozy cafe, city street, casual lifestyle',
    mood: 'relaxed, comfortable, everyday chic'
  },
  '通勤风': {
    clothing: 'tailored blazer, crisp button-down shirt, knee-length pencil skirt',
    silhouette: 'structured, tailored, professional silhouette',
    colors: 'white, beige, navy, black, camel',
    shoes: 'low block heels, pointed toe flats, loafers',
    scene: 'office building lobby, city business district, modern interior',
    mood: 'professional, polished, confident, elegant'
  },
  '甜酷风': {
    clothing: 'cropped leather jacket, floral dress, band tee, cargo pants',
    silhouette: 'mixed silhouettes, short and long layers',
    colors: 'black, pink, purple, silver accents',
    shoes: 'combat boots, platform shoes, chunky sneakers',
    scene: 'urban street, graffiti wall, downtown alley',
    mood: 'edgy, rebellious yet sweet, street style'
  },
  '复古风': {
    clothing: 'corduroy blazer, plaid skirt, turtleneck sweater, wide-leg trousers',
    silhouette: 'A-line skirt, tailored jacket, vintage cut',
    colors: 'caramel, burgundy, mustard, olive green, brown',
    shoes: 'loafers, mary janes, block heels',
    scene: 'vintage bookstore, old street, autumn park',
    mood: 'nostalgic, timeless, sophisticated, literary'
  },
  '学院风': {
    clothing: 'V-neck knit vest, white button-down shirt, pleated skirt, blazer',
    silhouette: 'preppy, tailored, classic uniform style',
    colors: 'navy, gray, white, burgundy, camel',
    shoes: 'loafers, oxford shoes, knee-high boots',
    scene: 'college campus, library, ivy league building',
    mood: 'academic, youthful, preppy, intellectual'
  },
  '甜美风': {
    clothing: 'lace blouse, tulle skirt, floral dress, puffed sleeves',
    silhouette: 'feminine, flared, ruffled details',
    colors: 'pastel pink, lavender, baby blue, cream',
    shoes: 'mary jane shoes, ballet flats, strappy sandals',
    scene: 'flower garden, pastel cafe, cherry blossom trees',
    mood: 'sweet, romantic, feminine, dreamy'
  },
  '极简风': {
    clothing: 'white oversized tee, black wide-leg trousers, structured coat',
    silhouette: 'clean lines, oversized, minimalist cut',
    colors: 'white, black, gray, beige, neutral tones',
    shoes: 'white sneakers, black leather shoes, simple flats',
    scene: 'minimalist interior, modern architecture, art gallery',
    mood: 'clean, sophisticated, understated luxury'
  },
  '法式风': {
    clothing: 'midi tea dress, silk scarf, trench coat, breton stripe top',
    silhouette: 'fitted waist, flowing skirt, effortless chic',
    colors: 'navy, white, red, beige, camel',
    shoes: 'ballet flats, ankle boots, low block heels',
    scene: 'parisian street, cafe terrace, garden courtyard',
    mood: 'effortless chic, romantic, timeless elegance'
  },
  '街头风': {
    clothing: 'oversize graphic hoodie, cargo pants, bomber jacket, baseball cap',
    silhouette: 'baggy, oversized, layered streetwear',
    colors: 'black, army green, white, neon accents',
    shoes: 'chunky dad sneakers, basketball shoes, skate shoes',
    scene: 'skate park, street art wall, hip hop style street',
    mood: 'urban, bold, trendy, hip-hop culture'
  },
  '运动风': {
    clothing: 'quick-dry sports tee, athletic shorts, track suit, sports bra',
    silhouette: 'athletic fit, stretch fabric, functional design',
    colors: 'black, gray, white, neon accents',
    shoes: 'running shoes, training sneakers, sports footwear',
    scene: 'gym, running track, sports field, outdoor trail',
    mood: 'energetic, sporty, active, dynamic'
  },
  '森系风': {
    clothing: 'cotton linen dress, loose cardigan, straw hat, lace details',
    silhouette: 'loose, flowing, natural fiber clothing',
    colors: 'sage green, beige, off-white, earth tones',
    shoes: 'leather sandals, espadrilles, flat boots',
    scene: 'forest path, wildflower meadow, cottage garden',
    mood: 'natural, fresh, peaceful, earthy'
  },
  '国风': {
    clothing: 'qipao style top, mandarin collar, wide leg pants, embroidered details',
    silhouette: 'elegant, flowing, traditional chinese cut',
    colors: 'wine red, emerald green, gold, black, ivory',
    shoes: 'embroidered cloth shoes, silk slippers, block heels',
    scene: 'ancient chinese garden, traditional architecture, bamboo forest',
    mood: 'elegant, oriental, classical, cultural'
  },
  '暗黑风': {
    clothing: 'black oversized blazer, slip dress, leather pants, corset top',
    silhouette: 'sharp edges, layered black, dramatic silhouette',
    colors: 'all black, charcoal, gunmetal silver',
    shoes: 'chunky platform boots, leather combat boots',
    scene: 'dark alley, gothic architecture, night city',
    mood: 'mysterious, bold, gothic, powerful'
  },
  '度假风': {
    clothing: 'bohemian maxi dress, off-shoulder top, flowing skirt',
    silhouette: 'flowing, loose, breezy summer style',
    colors: 'bright colors, floral prints, turquoise, coral',
    shoes: 'flip flops, strappy sandals, espadrilles',
    scene: 'beach sunset, tropical garden, resort poolside',
    mood: 'relaxed, vacation, bohemian, carefree'
  },
  '朋克风': {
    clothing: 'studded leather jacket, ripped jeans, band tee, fishnet',
    silhouette: 'tough, rebellious, layered punk style',
    colors: 'black, red, plaid, metal studs',
    shoes: 'combat boots, platform boots, studded shoes',
    scene: 'punk rock concert, industrial street, underground club',
    mood: 'rebellious, bold, anti-establishment, raw'
  },
  '文艺风': {
    clothing: 'khaki trench coat, straight jeans, white shirt, knit sweater',
    silhouette: 'relaxed, classic, intellectual style',
    colors: 'khaki, navy, beige, forest green, brown',
    shoes: 'canvas sneakers, leather boots, brogues',
    scene: 'bookstore, art gallery, university campus, autumn park',
    mood: 'artistic, thoughtful, cultured, serene'
  },
  '少女风': {
    clothing: 'colorful knit cardigan, white blouse, pleated skirt, hair accessories',
    silhouette: 'cute, youthful, layered schoolgirl style',
    colors: 'pastel pink, lavender, mint green, baby blue',
    shoes: 'white sneakers, mary janes, platform sneakers',
    scene: 'candy shop, amusement park, pastel street',
    mood: 'youthful, cheerful, cute, energetic'
  },
  '测试': {
    clothing: 'casual t-shirt, jeans, simple outfit',
    silhouette: 'standard fit, simple design',
    colors: 'neutral colors',
    shoes: 'casual shoes',
    scene: 'simple background',
    mood: 'clean, simple, test style'
  }
};

const generateStylePrompt = (style: OutfitStyle, variant: number = 0): string => {
  const config = STYLE_PROMPT_MAP[style] || STYLE_PROMPT_MAP['休闲风'];
  const angleVariants = [
    'full body shot',
    'three-quarter view',
    'walking pose',
    'standing pose',
    'slightly angled view'
  ];
  const angle = angleVariants[variant % angleVariants.length];
  return `${angle}, fashion photography, ${config.clothing}, ${config.silhouette}, ${config.colors} color palette, ${config.shoes}, ${config.scene} background, ${config.mood} atmosphere, high quality, detailed, photorealistic`;
};

const usedImageSeeds = new Set<string>();

const generateUniqueSeed = (style: OutfitStyle, index: number): number => {
  let seed = 100 + index * 7 + (style.length * 3);
  let attempts = 0;
  const styleIndex = Object.keys(STYLE_PROMPT_MAP).indexOf(style);

  while (usedImageSeeds.has(`${style}-${seed}`) && attempts < 50) {
    seed += styleIndex + 11 + attempts * 3;
    attempts++;
  }

  usedImageSeeds.add(`${style}-${seed}`);
  return seed;
};

export const resetImageSeeds = () => {
  usedImageSeeds.clear();
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

export const getStyledOutfitImage = (
  style: OutfitStyle,
  index: number,
  width: number = 400,
  height: number = 600
): string => {
  try {
    const sizeMap: Record<string, ImageSize> = {
      '400/600': 'portrait_4_3',
      '500/700': 'portrait_4_3',
      '600/800': 'portrait_4_3',
      '200/200': 'square',
      '400/400': 'square',
      '600/400': 'landscape_4_3'
    };
    const sizeKey = `${width}/${height}`;
    const imageSize = sizeMap[sizeKey] || 'portrait_4_3';
    const uniqueSeed = generateUniqueSeed(style, index);
    const prompt = encodeURIComponent(generateStylePrompt(style, index));
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${imageSize}`;
  } catch (error) {
    console.warn('[Utils] Failed to generate styled image URL, using fallback:', error);
    return getFallbackGradient(index);
  }
};

export const getAvatarImage = (seed: number = 64): string => {
  return getImageUrl(seed, 200, 200, 'avatar');
};

export const getFallbackImage = (seed: number): string => {
  return getFallbackGradient(seed);
};

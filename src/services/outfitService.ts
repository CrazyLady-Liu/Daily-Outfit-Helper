import { OutfitDetail } from '@/types';
import { mockRecommendations } from '@/data/outfits';
import { getOutfitImage } from '@/utils';

export async function fetchOutfitDetail(outfitId: string): Promise<OutfitDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const recommend = mockRecommendations.find((item) => item.id === outfitId);
  if (!recommend) {
    return null;
  }

  if (outfitId === '999') {
    return {
      ...recommend,
      id: outfitId,
      coverImage: recommend.image,
      images: [recommend.image],
      isOffline: true,
      occasion: '日常',
      season: '春秋',
      items: [],
      createdAt: new Date().toISOString()
    };
  }

  const detail: OutfitDetail = {
    id: recommend.id,
    title: recommend.title,
    description: recommend.description,
    coverImage: recommend.image,
    images: [
      recommend.image,
      getOutfitImage(103 + parseInt(recommend.id), 600, 800),
      getOutfitImage(119 + parseInt(recommend.id), 600, 800)
    ],
    temperatureRange: recommend.temperatureRange,
    weatherType: recommend.weatherType,
    tags: recommend.tags,
    style: recommend.style,
    occasion: getOccasionByStyle(recommend.style),
    season: getSeasonByTemp(recommend.temperatureRange),
    items: [
      {
        id: `${outfitId}-top`,
        name: getTopByStyle(recommend.style),
        category: '上装',
        color: '米白色'
      },
      {
        id: `${outfitId}-bottom`,
        name: getBottomByStyle(recommend.style),
        category: '下装',
        color: '浅蓝色'
      },
      {
        id: `${outfitId}-shoes`,
        name: '小白鞋',
        category: '鞋履',
        color: '白色'
      }
    ],
    isOffline: false,
    createdAt: '2026-06-01T00:00:00.000Z'
  };

  return detail;
}

function getOccasionByStyle(style: string): string {
  const occasionMap: Record<string, string> = {
    '休闲风': '日常',
    '通勤风': '职场',
    '甜酷风': '约会',
    '复古风': '聚会',
    '学院风': '校园',
    '甜美风': '约会',
    '极简风': '职场'
  };
  return occasionMap[style] || '日常';
}

function getSeasonByTemp(tempRange: string): string {
  const match = tempRange.match(/(\d+)-(\d+)/);
  if (!match) return '春秋';
  const low = parseInt(match[1]);
  if (low >= 25) return '夏季';
  if (low >= 15) return '春秋';
  return '冬季';
}

function getTopByStyle(style: string): string {
  const topMap: Record<string, string> = {
    '休闲风': '米色针织衫',
    '通勤风': '白色衬衫',
    '甜酷风': '黑色短款皮衣',
    '复古风': '灯芯绒外套',
    '学院风': '针织背心',
    '甜美风': '碎花雪纺衫',
    '极简风': '白色T恤'
  };
  return topMap[style] || '百搭上衣';
}

function getBottomByStyle(style: string): string {
  const bottomMap: Record<string, string> = {
    '休闲风': '浅色牛仔裤',
    '通勤风': '卡其色半裙',
    '甜酷风': '碎花连衣裙',
    '复古风': '格纹半裙',
    '学院风': '百褶裙',
    '甜美风': 'A字短裙',
    '极简风': '黑色西装裤'
  };
  return bottomMap[style] || '百搭下装';
}

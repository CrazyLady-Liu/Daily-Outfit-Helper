import { OutfitDetail, OutfitItem } from '@/types';
import { mockRecommendations, generateStyledRecommendations } from '@/data/outfits';
import { getStyledOutfitImage, resetImageSeeds, OutfitStyle } from '@/utils';

export async function fetchOutfitDetail(outfitId: string): Promise<OutfitDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  resetImageSeeds();

  if (outfitId === 'not-found-test') {
    return null;
  }

  if (outfitId === 'offline') {
    return {
      id: outfitId,
      title: '已下架穿搭示例',
      description: '该穿搭已下架',
      coverImage: getStyledOutfitImage('休闲风', 100, 600, 800),
      images: [],
      temperatureRange: '20-28°',
      weatherType: '晴',
      tags: ['已下架'],
      style: '休闲风',
      items: [],
      occasion: '日常',
      season: '夏季',
      isOffline: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    };
  }

  const styledRecs = generateStyledRecommendations();
  const recommend = styledRecs.find((item) => item.id === outfitId && item.id !== 'not-found-test' && item.id !== 'offline');
  if (!recommend) {
    return null;
  }

  const style = recommend.style as OutfitStyle;

  const detail: OutfitDetail = {
    id: recommend.id,
    title: recommend.title,
    description: recommend.description,
    coverImage: recommend.image,
    images: [
      recommend.image,
      getStyledOutfitImage(style, 500 + parseInt(recommend.id || '0', 36), 600, 800),
      getStyledOutfitImage(style, 600 + parseInt(recommend.id || '0', 36), 600, 800)
    ],
    temperatureRange: recommend.temperatureRange,
    weatherType: recommend.weatherType,
    tags: recommend.tags,
    style: recommend.style,
    occasion: getOccasionByStyle(recommend.style),
    season: getSeasonByTemp(recommend.temperatureRange),
    items: getItemsByStyle(recommend.style, outfitId),
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
    '极简风': '职场',
    '法式风': '约会',
    '街头风': '日常',
    '运动风': '运动',
    '森系风': '日常',
    '国风': '节日',
    '暗黑风': '聚会',
    '度假风': '度假',
    '朋克风': '演出',
    '文艺风': '日常',
    '少女风': '校园'
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

function getItemsByStyle(style: string, outfitId: string): OutfitItem[] {
  const itemsMap: Record<string, OutfitItem[]> = {
    '休闲风': [
      { id: `${outfitId}-1`, name: '米色针织衫', category: '上装', color: '米白色' },
      { id: `${outfitId}-2`, name: '浅色直筒牛仔裤', category: '下装', color: '浅蓝色' },
      { id: `${outfitId}-3`, name: '小白鞋', category: '鞋履', color: '白色' },
      { id: `${outfitId}-4`, name: '帆布托特包', category: '配饰', color: '卡其色' }
    ],
    '通勤风': [
      { id: `${outfitId}-1`, name: '白色真丝衬衫', category: '上装', color: '白色' },
      { id: `${outfitId}-2`, name: '卡其色西装半裙', category: '下装', color: '卡其色' },
      { id: `${outfitId}-3`, name: '尖头高跟鞋', category: '鞋履', color: '裸色' },
      { id: `${outfitId}-4`, name: '简约手提包', category: '配饰', color: '棕色' }
    ],
    '甜酷风': [
      { id: `${outfitId}-1`, name: '黑色短款皮衣', category: '外套', color: '黑色' },
      { id: `${outfitId}-2`, name: '碎花连衣裙', category: '连衣裙', color: '黑底碎花' },
      { id: `${outfitId}-3`, name: '马丁靴', category: '鞋履', color: '黑色' },
      { id: `${outfitId}-4`, name: '链条斜挎包', category: '配饰', color: '银色' }
    ],
    '复古风': [
      { id: `${outfitId}-1`, name: '灯芯绒西装外套', category: '外套', color: '焦糖色' },
      { id: `${outfitId}-2`, name: '格纹A字半裙', category: '下装', color: '棕红格纹' },
      { id: `${outfitId}-3`, name: '乐福鞋', category: '鞋履', color: '棕色' },
      { id: `${outfitId}-4`, name: '贝雷帽', category: '配饰', color: '酒红色' }
    ],
    '学院风': [
      { id: `${outfitId}-1`, name: 'V领针织背心', category: '上装', color: '藏青色' },
      { id: `${outfitId}-2`, name: '白色长袖衬衫', category: '内搭', color: '白色' },
      { id: `${outfitId}-3`, name: '百褶短裙', category: '下装', color: '灰色' },
      { id: `${outfitId}-4`, name: '乐福鞋', category: '鞋履', color: '黑色' },
      { id: `${outfitId}-5`, name: '双肩背包', category: '配饰', color: '棕色' }
    ],
    '甜美风': [
      { id: `${outfitId}-1`, name: '蕾丝雪纺衫', category: '上装', color: '粉色' },
      { id: `${outfitId}-2`, name: 'A字短裙', category: '下装', color: '白色' },
      { id: `${outfitId}-3`, name: '玛丽珍鞋', category: '鞋履', color: '粉色' },
      { id: `${outfitId}-4`, name: '蝴蝶结发夹', category: '配饰', color: '粉色' }
    ],
    '极简风': [
      { id: `${outfitId}-1`, name: '白色廓形T恤', category: '上装', color: '白色' },
      { id: `${outfitId}-2`, name: '黑色西装长裤', category: '下装', color: '黑色' },
      { id: `${outfitId}-3`, name: '小白鞋', category: '鞋履', color: '白色' },
      { id: `${outfitId}-4`, name: '极简托特包', category: '配饰', color: '黑色' }
    ],
    '法式风': [
      { id: `${outfitId}-1`, name: '茶歇连衣裙', category: '连衣裙', color: '米白底碎花' },
      { id: `${outfitId}-2`, name: '珍珠项链', category: '配饰', color: '白色' },
      { id: `${outfitId}-3`, name: '草编包', category: '配饰', color: '米色' },
      { id: `${outfitId}-4`, name: '玛丽珍鞋', category: '鞋履', color: '黑色' }
    ],
    '街头风': [
      { id: `${outfitId}-1`, name: 'Oversize印花卫衣', category: '上装', color: '黑色' },
      { id: `${outfitId}-2`, name: '工装裤', category: '下装', color: '军绿色' },
      { id: `${outfitId}-3`, name: '老爹鞋', category: '鞋履', color: '黑白' },
      { id: `${outfitId}-4`, name: '棒球帽', category: '配饰', color: '黑色' }
    ],
    '运动风': [
      { id: `${outfitId}-1`, name: '速干运动T恤', category: '上装', color: '黑色' },
      { id: `${outfitId}-2`, name: '运动短裤', category: '下装', color: '灰色' },
      { id: `${outfitId}-3`, name: '专业跑步鞋', category: '鞋履', color: '黑白' },
      { id: `${outfitId}-4`, name: '运动头带', category: '配饰', color: '黑色' }
    ],
    '森系风': [
      { id: `${outfitId}-1`, name: '棉麻连衣裙', category: '连衣裙', color: '豆绿色' },
      { id: `${outfitId}-2`, name: '编织草帽', category: '配饰', color: '米色' },
      { id: `${outfitId}-3`, name: '藤编包', category: '配饰', color: '棕色' },
      { id: `${outfitId}-4`, name: '平底凉鞋', category: '鞋履', color: '棕色' }
    ],
    '国风': [
      { id: `${outfitId}-1`, name: '改良旗袍上衣', category: '上装', color: '酒红色' },
      { id: `${outfitId}-2`, name: '阔腿裤', category: '下装', color: '黑色' },
      { id: `${outfitId}-3`, name: '绣花布鞋', category: '鞋履', color: '红色' },
      { id: `${outfitId}-4`, name: '玉簪发饰', category: '配饰', color: '绿色' }
    ],
    '暗黑风': [
      { id: `${outfitId}-1`, name: '黑色廓形西装', category: '外套', color: '黑色' },
      { id: `${outfitId}-2`, name: '黑色吊带裙', category: '连衣裙', color: '黑色' },
      { id: `${outfitId}-3`, name: '厚底靴', category: '鞋履', color: '黑色' },
      { id: `${outfitId}-4`, name: '金属项链', category: '配饰', color: '银色' }
    ],
    '度假风': [
      { id: `${outfitId}-1`, name: '波西米亚长裙', category: '连衣裙', color: '花色' },
      { id: `${outfitId}-2`, name: '草编大檐帽', category: '配饰', color: '米色' },
      { id: `${outfitId}-3`, name: '草编包', category: '配饰', color: '棕色' },
      { id: `${outfitId}-4`, name: '夹脚凉鞋', category: '鞋履', color: '棕色' }
    ],
    '朋克风': [
      { id: `${outfitId}-1`, name: '铆钉皮衣', category: '外套', color: '黑色' },
      { id: `${outfitId}-2`, name: '破洞牛仔裤', category: '下装', color: '黑色' },
      { id: `${outfitId}-3`, name: '马丁靴', category: '鞋履', color: '黑色' },
      { id: `${outfitId}-4`, name: '铆钉腰带', category: '配饰', color: '黑色' }
    ],
    '文艺风': [
      { id: `${outfitId}-1`, name: '卡其色风衣', category: '外套', color: '卡其色' },
      { id: `${outfitId}-2`, name: '直筒牛仔裤', category: '下装', color: '深蓝色' },
      { id: `${outfitId}-3`, name: '帆布鞋', category: '鞋履', color: '白色' },
      { id: `${outfitId}-4`, name: '帆布包', category: '配饰', color: '米色' }
    ],
    '少女风': [
      { id: `${outfitId}-1`, name: '彩色针织开衫', category: '外套', color: '粉紫色' },
      { id: `${outfitId}-2`, name: '白色百褶裙', category: '下装', color: '白色' },
      { id: `${outfitId}-3`, name: '玛丽珍鞋', category: '鞋履', color: '粉色' },
      { id: `${outfitId}-4`, name: '蝴蝶结发饰', category: '配饰', color: '粉色' }
    ]
  };

  return itemsMap[style] || [
    { id: `${outfitId}-1`, name: '百搭上衣', category: '上装', color: '白色' },
    { id: `${outfitId}-2`, name: '百搭下装', category: '下装', color: '黑色' },
    { id: `${outfitId}-3`, name: '百搭鞋子', category: '鞋履', color: '白色' }
  ];
}

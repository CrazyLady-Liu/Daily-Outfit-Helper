import { OutfitRecommend, OutfitPhoto } from '@/types';
import { getStyledOutfitImage, getOutfitImage, resetImageSeeds } from '@/utils';

interface OutfitBaseData {
  id: string;
  title: string;
  description: string;
  temperatureRange: string;
  weatherType: string;
  tags: string[];
  style: string;
}

const outfitBaseData: OutfitBaseData[] = [
  {
    id: '1',
    title: '温柔奶油风',
    description: '米色针织衫搭配浅色牛仔裤，适合20-25度的多云天气，温柔又舒适',
    temperatureRange: '18-25°',
    weatherType: '多云',
    tags: ['休闲', '温柔', '日常'],
    style: '休闲风'
  },
  {
    id: '2',
    title: '清爽通勤装',
    description: '白衬衫加卡其色半裙，干练又不失优雅，适合职场穿搭',
    temperatureRange: '20-28°',
    weatherType: '晴',
    tags: ['通勤', '优雅', '知性'],
    style: '通勤风'
  },
  {
    id: '3',
    title: '甜酷少女风',
    description: '黑色短款皮衣搭配碎花裙，甜酷兼具，回头率超高',
    temperatureRange: '15-22°',
    weatherType: '多云',
    tags: ['甜酷', '个性', '约会'],
    style: '甜酷风'
  },
  {
    id: '4',
    title: '慵懒休闲风',
    description: '宽松卫衣加运动裤，舒适自在，周末出街首选',
    temperatureRange: '16-23°',
    weatherType: '阴',
    tags: ['休闲', '慵懒', '运动'],
    style: '休闲风'
  },
  {
    id: '5',
    title: '文艺复古风',
    description: '灯芯绒外套搭格纹半裙，文艺复古，秋日氛围感满分',
    temperatureRange: '12-20°',
    weatherType: '晴',
    tags: ['复古', '文艺', '秋天'],
    style: '复古风'
  },
  {
    id: '6',
    title: '清新校园风',
    description: '针织背心叠穿白衬衫，搭配百褶裙，清新减龄',
    temperatureRange: '18-25°',
    weatherType: '多云',
    tags: ['校园', '清新', '减龄'],
    style: '学院风'
  },
  {
    id: '7',
    title: '法式浪漫风',
    description: '茶歇连衣裙配珍珠项链，优雅浪漫，约会必备',
    temperatureRange: '20-28°',
    weatherType: '晴',
    tags: ['法式', '浪漫', '约会'],
    style: '法式风'
  },
  {
    id: '8',
    title: '街头潮流风',
    description: 'oversize卫衣搭工装裤，酷感十足，街头潮人必备',
    temperatureRange: '15-25°',
    weatherType: '多云',
    tags: ['街头', '潮流', '个性'],
    style: '街头风'
  },
  {
    id: '9',
    title: '甜美小仙女',
    description: '粉色蓬蓬裙搭配蕾丝上衣，甜美可爱，少女心满满',
    temperatureRange: '22-30°',
    weatherType: '晴',
    tags: ['甜美', '可爱', '约会'],
    style: '甜美风'
  },
  {
    id: '10',
    title: '极简高级感',
    description: '黑白灰经典配色，剪裁利落，简约不简单',
    temperatureRange: '18-26°',
    weatherType: '多云',
    tags: ['极简', '高级', '通勤'],
    style: '极简风'
  },
  {
    id: '11',
    title: '运动活力风',
    description: '速干运动套装，舒适透气，健身跑步都合适',
    temperatureRange: '20-30°',
    weatherType: '晴',
    tags: ['运动', '活力', '健身'],
    style: '运动风'
  },
  {
    id: '12',
    title: '森系清新风',
    description: '棉麻连衣裙配编织草帽，自然清新，森系女孩首选',
    temperatureRange: '18-26°',
    weatherType: '多云',
    tags: ['森系', '清新', '自然'],
    style: '森系风'
  },
  {
    id: '13',
    title: '新中式国风',
    description: '改良旗袍式上衣配阔腿裤，东方韵味，气质出众',
    temperatureRange: '20-28°',
    weatherType: '晴',
    tags: ['国风', '新中式', '气质'],
    style: '国风'
  },
  {
    id: '14',
    title: '暗黑系酷姐',
    description: '全黑look配金属配饰，酷飒有型，气场全开',
    temperatureRange: '15-23°',
    weatherType: '阴',
    tags: ['暗黑', '酷飒', '个性'],
    style: '暗黑风'
  },
  {
    id: '15',
    title: '度假海滩风',
    description: '波西米亚长裙配草编包，飘逸浪漫，度假氛围感拉满',
    temperatureRange: '25-32°',
    weatherType: '晴',
    tags: ['度假', '海滩', '波西米亚'],
    style: '度假风'
  },
  {
    id: '16',
    title: '朋克叛逆风',
    description: '铆钉皮衣配破洞牛仔裤，叛逆个性，摇滚范十足',
    temperatureRange: '12-20°',
    weatherType: '多云',
    tags: ['朋克', '叛逆', '摇滚'],
    style: '朋克风'
  },
  {
    id: '17',
    title: '知性文艺范',
    description: '卡其色风衣配直筒裤，知性大方，文艺青年标配',
    temperatureRange: '15-22°',
    weatherType: '多云',
    tags: ['知性', '文艺', '气质'],
    style: '文艺风'
  },
  {
    id: '18',
    title: '元气少女风',
    description: '彩色针织开衫配百褶裙，活力满满，减龄神器',
    temperatureRange: '16-24°',
    weatherType: '晴',
    tags: ['元气', '少女', '减龄'],
    style: '少女风'
  },
  {
    id: 'not-found-test',
    title: '【测试】穿搭不存在',
    description: '点击测试穿搭不存在的空状态页面',
    temperatureRange: '20-25°',
    weatherType: '多云',
    tags: ['测试', '空状态'],
    style: '测试'
  },
  {
    id: 'offline',
    title: '【测试】穿搭已下架',
    description: '点击测试穿搭已下架的空状态页面',
    temperatureRange: '20-25°',
    weatherType: '多云',
    tags: ['测试', '已下架'],
    style: '测试'
  }
];

export const generateStyledRecommendations = (): OutfitRecommend[] => {
  resetImageSeeds();

  return outfitBaseData.map((item, index) => {
    const style = item.style as any;
    return {
      ...item,
      image: getStyledOutfitImage(style, index)
    };
  });
};

export const mockRecommendations: OutfitRecommend[] = generateStyledRecommendations();

export const mockOutfitPhotos: OutfitPhoto[] = [
  {
    id: 'p1',
    image: getOutfitImage(103, 500, 700),
    description: '今日份温柔穿搭，米色针织真的太显气质啦~',
    date: '2026-06-14',
    tags: ['温柔', '日常', '约会'],
    style: '休闲风',
    season: '夏季'
  },
  {
    id: 'p2',
    image: getOutfitImage(119, 500, 700),
    description: '上班穿的通勤装，简单但很有质感',
    date: '2026-06-13',
    tags: ['通勤', '职场'],
    style: '通勤风',
    season: '夏季'
  },
  {
    id: 'p3',
    image: getOutfitImage(220, 500, 700),
    description: '周末和闺蜜约会穿的，甜酷女孩上线',
    date: '2026-06-12',
    tags: ['甜酷', '约会', '个性'],
    style: '甜酷风',
    season: '夏季'
  },
  {
    id: 'p4',
    image: getOutfitImage(225, 500, 700),
    description: '宅家舒适穿搭，卫衣yyds',
    date: '2026-06-11',
    tags: ['休闲', '居家', '舒适'],
    style: '休闲风',
    season: '夏季'
  },
  {
    id: 'p5',
    image: getOutfitImage(230, 500, 700),
    description: '复古风走起，被自己美到了',
    date: '2026-06-10',
    tags: ['复古', '文艺'],
    style: '复古风',
    season: '夏季'
  },
  {
    id: 'p6',
    image: getOutfitImage(250, 500, 700),
    description: '校园风拍照打卡，假装是学生妹',
    date: '2026-06-09',
    tags: ['校园', '清新', '减龄'],
    style: '学院风',
    season: '夏季'
  },
  {
    id: 'p7',
    image: getOutfitImage(103, 500, 700),
    description: '夏日清凉穿搭，小裙子安排上',
    date: '2026-06-08',
    tags: ['夏日', '清新', '甜美'],
    style: '甜美风',
    season: '夏季'
  },
  {
    id: 'p8',
    image: getOutfitImage(119, 500, 700),
    description: '简约高级感，黑白灰永不落伍',
    date: '2026-06-07',
    tags: ['简约', '高级', '通勤'],
    style: '极简风',
    season: '夏季'
  }
];

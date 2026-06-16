import { OutfitRecommend, OutfitPhoto } from '@/types';
import { getOutfitImage } from '@/utils';

export const mockRecommendations: OutfitRecommend[] = [
  {
    id: '1',
    title: '温柔奶油风',
    description: '米色针织衫搭配浅色牛仔裤，适合20-25度的多云天气，温柔又舒适',
    image: getOutfitImage(103, 400, 600),
    temperatureRange: '18-25°',
    weatherType: '多云',
    tags: ['休闲', '温柔', '日常'],
    style: '休闲风'
  },
  {
    id: '2',
    title: '清爽通勤装',
    description: '白衬衫加卡其色半裙，干练又不失优雅，适合职场穿搭',
    image: getOutfitImage(119, 400, 600),
    temperatureRange: '20-28°',
    weatherType: '晴',
    tags: ['通勤', '优雅', '知性'],
    style: '通勤风'
  },
  {
    id: '3',
    title: '甜酷少女风',
    description: '黑色短款皮衣搭配碎花裙，甜酷兼具，回头率超高',
    image: getOutfitImage(220, 400, 600),
    temperatureRange: '15-22°',
    weatherType: '多云',
    tags: ['甜酷', '个性', '约会'],
    style: '甜酷风'
  },
  {
    id: '4',
    title: '慵懒休闲风',
    description: '宽松卫衣加运动裤，舒适自在，周末出街首选',
    image: getOutfitImage(225, 400, 600),
    temperatureRange: '16-23°',
    weatherType: '阴',
    tags: ['休闲', '慵懒', '运动'],
    style: '休闲风'
  },
  {
    id: '5',
    title: '文艺复古风',
    description: '灯芯绒外套搭格纹半裙，文艺复古，秋日氛围感满分',
    image: getOutfitImage(230, 400, 600),
    temperatureRange: '12-20°',
    weatherType: '晴',
    tags: ['复古', '文艺', '秋天'],
    style: '复古风'
  },
  {
    id: '6',
    title: '清新校园风',
    description: '针织背心叠穿白衬衫，搭配百褶裙，清新减龄',
    image: getOutfitImage(250, 400, 600),
    temperatureRange: '18-25°',
    weatherType: '多云',
    tags: ['校园', '清新', '减龄'],
    style: '学院风'
  }
];

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

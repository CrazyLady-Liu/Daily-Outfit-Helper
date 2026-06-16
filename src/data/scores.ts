import { ScoreRecord } from '@/types';
import { getOutfitImage } from '@/utils';

export const mockScoreRecords: ScoreRecord[] = [
  {
    id: 's1',
    image: getOutfitImage(103, 500, 700),
    score: 88,
    overallComment: '整体搭配非常和谐，色彩搭配温柔舒适，是一套很成功的日常穿搭！',
    details: [
      { category: '色彩搭配', score: 90, comment: '同色系搭配运用得很好，视觉上非常舒适' },
      { category: '款式协调', score: 85, comment: '上下装风格统一，版型搭配合理' },
      { category: '场合适配', score: 88, comment: '适合日常约会、逛街等多种场合' },
      { category: '时尚感', score: 86, comment: '紧跟流行趋势，简约不简单' }
    ],
    suggestions: [
      '可以尝试添加一条精致的项链作为点缀',
      '鞋子可以换成同色系的乐福鞋会更加分',
      '发型可以尝试慵懒的低马尾，更显温柔'
    ],
    date: '2026-06-14'
  },
  {
    id: 's2',
    image: getOutfitImage(119, 500, 700),
    score: 92,
    overallComment: '非常出色的通勤穿搭！专业干练又不失女性魅力，堪称职场范本。',
    details: [
      { category: '色彩搭配', score: 94, comment: '经典的白+卡其配色，永远不会出错' },
      { category: '款式协调', score: 92, comment: '衬衫的利落与半裙的柔美完美平衡' },
      { category: '场合适配', score: 95, comment: '完美适配办公室、商务会议等正式场合' },
      { category: '时尚感', score: 88, comment: '简约大气，展现高级品味' }
    ],
    suggestions: [
      '可以搭配一条简约的丝巾，增加层次感',
      '佩戴简约的金属耳饰会更加精致',
      '建议选择尖头高跟鞋，拉长腿部线条'
    ],
    date: '2026-06-13'
  },
  {
    id: 's3',
    image: getOutfitImage(220, 500, 700),
    score: 78,
    overallComment: '甜酷风格很有个性，但整体搭配还有提升空间，继续加油！',
    details: [
      { category: '色彩搭配', score: 75, comment: '黑白配色经典，但略显单调' },
      { category: '款式协调', score: 80, comment: '皮衣和碎花裙的碰撞很有创意' },
      { category: '场合适配', score: 82, comment: '适合派对、约会等轻松场合' },
      { category: '时尚感', score: 85, comment: '风格独特，很有个人特色' }
    ],
    suggestions: [
      '可以尝试添加一条腰带来突出腰线',
      '内搭可以换成更有设计感的款式',
      '鞋子可以换成马丁靴，更符合甜酷风格'
    ],
    date: '2026-06-12'
  }
];

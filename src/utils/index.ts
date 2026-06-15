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

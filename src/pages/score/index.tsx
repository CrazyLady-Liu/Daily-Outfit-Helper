import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { ScoreRecord, LoadingState } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { delay, generateId, formatDate, getScoreLevel } from '@/utils';
import styles from './index.module.scss';

const ScorePage: React.FC = () => {
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [scoring, setScoring] = useState(false);
  const { scoreRecords, addScoreRecord, userInfo } = useAppStore();

  const loadData = async () => {
    setLoading('loading');
    console.log('[ScorePage] Loading score records...');
    try {
      await delay(500);
      setLoading('success');
    } catch (error) {
      console.error('[ScorePage] Load data error:', error);
      setLoading('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = () => {
    console.log('[ScorePage] Upload photo for scoring');
    Taro.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: async (res) => {
        console.log('[ScorePage] Selected source:', res.tapIndex);
        setScoring(true);

        await delay(2500);

        const mockScore = Math.floor(Math.random() * 30) + 70;
        const details = [
          { category: '色彩搭配', score: Math.floor(Math.random() * 20) + 80, comment: '色彩搭配和谐，视觉效果好' },
          { category: '款式协调', score: Math.floor(Math.random() * 20) + 75, comment: '款式搭配合理，风格统一' },
          { category: '场合适配', score: Math.floor(Math.random() * 20) + 70, comment: '适合多种场合穿着' },
          { category: '时尚感', score: Math.floor(Math.random() * 20) + 75, comment: '紧跟时尚潮流' }
        ];
        const avgScore = Math.round(details.reduce((a, b) => a + b.score, 0) / details.length);

        const newRecord: ScoreRecord = {
          id: generateId(),
          image: `https://picsum.photos/id/${100 + Math.floor(Math.random() * 80)}/500/700`,
          score: avgScore,
          overallComment: mockScore >= 85 
            ? '非常棒的搭配！整体效果出色，时尚感满满~' 
            : mockScore >= 75
              ? '整体搭配不错，还有一些提升空间哦~'
              : '搭配有待提升，参考建议继续加油！',
          details,
          suggestions: [
            '可以尝试添加配饰来增加层次感',
            '鞋子可以选择更搭配的款式',
            '建议根据场合调整穿搭风格'
          ],
          date: new Date().toISOString().split('T')[0]
        };

        addScoreRecord(newRecord);
        setScoring(false);

        Taro.showToast({ title: '打分完成！', icon: 'success' });
        Taro.navigateTo({ url: '/pages/score-result/index' });
      }
    });
  };

  const handleHistoryClick = (record: ScoreRecord) => {
    console.log('[ScorePage] Click history record:', record.id);
    Taro.navigateTo({ url: '/pages/score-result/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>AI 搭配打分</Text>
        <Text className={styles.pageSubtitle}>智能分析你的穿搭，获取专业建议 ✨</Text>
      </View>

      <View className={styles.uploadCard}>
        <View className={styles.uploadArea} onClick={handleUpload}>
          <Text className={styles.uploadIcon}>👗</Text>
          <Text className={styles.uploadTitle}>上传穿搭照片</Text>
          <Text className={styles.uploadDesc}>支持拍照或从相册选择，AI 多维度智能评分</Text>
          <Button className={styles.uploadBtn} onClick={handleUpload}>
            立即开始打分
          </Button>
        </View>
      </View>

      <View className={styles.historySection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>打分记录</Text>
          <Text className={styles.historyCount}>共 {scoreRecords.length} 次</Text>
        </View>

        {loading === 'loading' ? (
          <Loading text='加载打分记录...' />
        ) : scoreRecords.length === 0 ? (
          <EmptyState
            icon='📊'
            title='暂无打分记录'
            description='上传你的第一张穿搭照片，看看能得多少分吧'
            buttonText='去打分'
            onButtonClick={handleUpload}
          />
        ) : (
          <View className={styles.historyList}>
            {scoreRecords.map((record) => {
              const level = getScoreLevel(record.score);
              return (
                <View
                  className={styles.historyCard}
                  key={record.id}
                  onClick={() => handleHistoryClick(record)}
                >
                  <Image
                    className={styles.historyImage}
                    src={record.image}
                    mode='aspectFill'
                    onError={(e) => console.error('[ScorePage] Image load error:', e)}
                  />
                  <View className={styles.historyContent}>
                    <View className={styles.historyHeader}>
                      <View className={styles.scoreBadge}>
                        <Text className={styles.scoreValue} style={{ color: level.color }}>
                          {record.score}
                        </Text>
                        <Text className={styles.scoreLabel} style={{ background: level.color }}>
                          {level.text}
                        </Text>
                      </View>
                    </View>
                    <Text className={styles.historyComment}>{record.overallComment}</Text>
                    <View className={styles.historyFooter}>
                      <Text className={styles.historyDate}>{formatDate(record.date)}</Text>
                      <Text className={styles.historyDetail}>查看详情 →</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {scoring && (
        <View className={styles.scoringOverlay}>
          <View className={styles.scoringContent}>
            <View className={styles.scoringSpinner} />
            <Text className={styles.scoringText}>AI 正在分析你的穿搭...</Text>
            <Text className={styles.scoringSubtext}>色彩搭配、款式协调、时尚感多维度评估中</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ScorePage;

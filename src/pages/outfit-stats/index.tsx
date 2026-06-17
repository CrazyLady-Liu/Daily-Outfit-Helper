import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { OutfitPhoto, ScoreRecord } from '@/types';
import styles from './index.module.scss';

type TimeRange = 'week' | 'month' | 'year' | 'all';

interface ScoreRange {
  label: string;
  min: number;
  max: number;
  color: string;
}

const scoreRanges: ScoreRange[] = [
  { label: '0-20', min: 0, max: 20, color: '#FF6B6B' },
  { label: '21-40', min: 21, max: 40, color: '#FF8E53' },
  { label: '41-60', min: 41, max: 60, color: '#FFD166' },
  { label: '61-80', min: 61, max: 80, color: '#A8D8EA' },
  { label: '81-100', min: 81, max: 100, color: '#52C41A' }
];

const timeFilterOptions: { key: TimeRange; label: string }[] = [
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'year', label: '本年' },
  { key: 'all', label: '全部' }
];

const mockItems = [
  { name: '白色T恤', icon: '👕', count: 28 },
  { name: '牛仔裤', icon: '👖', count: 22 },
  { name: '小白鞋', icon: '👟', count: 19 },
  { name: '针织衫', icon: '🧥', count: 15 },
  { name: '连衣裙', icon: '👗', count: 12 }
];

const OutfitStatsPage: React.FC = () => {
  const { outfitPhotos, scoreRecords, styleTags } = useAppStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const filterByTimeRange = <T extends { date: string }>(items: T[]): T[] => {
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      switch (timeRange) {
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return itemDate >= weekAgo;
        }
        case 'month': {
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }
        case 'year': {
          return itemDate.getFullYear() === now.getFullYear();
        }
        default:
          return true;
      }
    });
  };

  const filteredOutfits = useMemo(() => filterByTimeRange(outfitPhotos), [outfitPhotos, timeRange]);
  const filteredScores = useMemo(() => filterByTimeRange(scoreRecords), [scoreRecords, timeRange]);

  const uniqueTagsCount = useMemo(() => {
    const tags = new Set<string>();
    filteredOutfits.forEach((outfit) => {
      outfit.tags.forEach((tag) => tags.add(tag));
    });
    return tags.size;
  }, [filteredOutfits]);

  const styleDistribution = useMemo(() => {
    const map = new Map<string, number>();
    filteredOutfits.forEach((outfit) => {
      map.set(outfit.style, (map.get(outfit.style) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => {
        const tag = styleTags.find((t) => t.name === name);
        return {
          name,
          count,
          color: tag?.color || '#FFB8C5',
          percent: filteredOutfits.length > 0 ? (count / filteredOutfits.length) * 100 : 0
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [filteredOutfits, styleTags]);

  const pieConicGradient = useMemo(() => {
    if (styleDistribution.length === 0) return '#FFF0F3';
    let gradient = '';
    let currentPercent = 0;
    styleDistribution.forEach((item) => {
      const start = currentPercent;
      currentPercent += item.percent;
      gradient += `${item.color} ${start}% ${currentPercent}%, `;
    });
    return `conic-gradient(${gradient.slice(0, -2)})`;
  }, [styleDistribution]);

  const avgScore = useMemo(() => {
    if (filteredScores.length === 0) return 0;
    const total = filteredScores.reduce((sum, s) => sum + s.score, 0);
    return Math.round(total / filteredScores.length);
  }, [filteredScores]);

  const highestScore = useMemo(() => {
    if (filteredScores.length === 0) return null;
    return filteredScores.reduce((max, s) => (s.score > max.score ? s : max), filteredScores[0]);
  }, [filteredScores]);

  const lowestScore = useMemo(() => {
    if (filteredScores.length === 0) return null;
    return filteredScores.reduce((min, s) => (s.score < min.score ? s : min), filteredScores[0]);
  }, [filteredScores]);

  const scoreDistribution = useMemo(() => {
    const ranges = scoreRanges.map((r) => ({ ...r, count: 0 }));
    filteredScores.forEach((s) => {
      const range = ranges.find((r) => s.score >= r.min && s.score <= r.max);
      if (range) range.count++;
    });
    const maxCount = Math.max(...ranges.map((r) => r.count), 1);
    return ranges.map((r) => ({
      ...r,
      percent: (r.count / maxCount) * 100
    }));
  }, [filteredScores]);

  const [activeRangeIndex, setActiveRangeIndex] = useState<number | null>(null);

  const rangeScores = useMemo(() => {
    if (activeRangeIndex === null) return [];
    const range = scoreRanges[activeRangeIndex];
    return filteredScores.filter((s) => s.score >= range.min && s.score <= range.max);
  }, [activeRangeIndex, filteredScores]);

  const handleBarClick = useCallback((index: number) => {
    setActiveRangeIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleClosePopup = useCallback(() => {
    setActiveRangeIndex(null);
  }, []);

  const handleScoreDetailClick = useCallback((id: string) => {
    Taro.navigateTo({ url: `/pages/score-result/index?id=${id}` });
  }, []);

  const tagRanking = useMemo(() => {
    const map = new Map<string, number>();
    filteredOutfits.forEach((outfit) => {
      outfit.tags.forEach((tag) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredOutfits]);

  const getRankClass = (index: number) => {
    if (index === 0) return 'top1';
    if (index === 1) return 'top2';
    if (index === 2) return 'top3';
    return '';
  };

  const getRankIndexClass = (index: number) => {
    if (index === 0) return styles.rank1;
    if (index === 1) return styles.rank2;
    if (index === 2) return styles.rank3;
    return styles.rankOther;
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.timeFilter}>
        <View className={styles.filterTabs}>
          {timeFilterOptions.map((option) => (
            <View
              key={option.key}
              className={classnames(styles.filterTab, timeRange === option.key && styles.active)}
              onClick={() => setTimeRange(option.key)}
            >
              <Text>{option.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.statsHeader}>
        <Text className={styles.statsTitle}>📊 穿搭数据总览</Text>
        <Text className={styles.statsSubtitle}>记录你的每一次时尚选择</Text>
      </View>

      <View className={styles.coreMetrics}>
        <View className={classnames(styles.metricCard, styles.metricOutfit)}>
          <Text className={styles.metricIcon}>👗</Text>
          <Text className={classnames(styles.metricValue, filteredOutfits.length === 0 && styles.metricValueEmpty)}>
            {filteredOutfits.length === 0 ? '--' : filteredOutfits.length}
          </Text>
          <Text className={styles.metricLabel}>穿搭记录</Text>
        </View>
        <View className={classnames(styles.metricCard, styles.metricScore)}>
          <Text className={styles.metricIcon}>⭐</Text>
          <Text className={classnames(styles.metricValue, filteredScores.length === 0 && styles.metricValueEmpty)}>
            {filteredScores.length === 0 ? '--' : filteredScores.length}
          </Text>
          <Text className={styles.metricLabel}>AI打分</Text>
        </View>
        <View className={classnames(styles.metricCard, styles.metricTag)}>
          <Text className={styles.metricIcon}>🏷️</Text>
          <Text className={classnames(styles.metricValue, filteredOutfits.length === 0 && styles.metricValueEmpty)}>
            {filteredOutfits.length === 0 ? '--' : uniqueTagsCount}
          </Text>
          <Text className={styles.metricLabel}>使用标签</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🎨</Text>
              风格分布
            </Text>
            <Text className={styles.sectionExtra}>共 {styleDistribution.length} 种风格</Text>
          </View>

          {styleDistribution.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🎨</Text>
              <Text className={styles.emptyText}>暂无穿搭风格数据，快去创建穿搭记录吧</Text>
              <View
                className={styles.emptyBtn}
                onClick={() => Taro.switchTab({ url: '/pages/album/index' })}
              >
                <Text className={styles.emptyBtnText}>去记录穿搭</Text>
              </View>
            </View>
          ) : (
            <View className={styles.styleDistribution}>
              <View className={styles.pieChart} style={{ background: pieConicGradient }}>
                <View className={styles.pieCenter}>
                  <Text className={styles.pieCenterValue}>{filteredOutfits.length}</Text>
                  <Text className={styles.pieCenterLabel}>总数</Text>
                </View>
              </View>

              <View className={styles.styleRankList}>
                {styleDistribution.slice(0, 5).map((item, index) => (
                  <View key={item.name} className={styles.styleRankItem}>
                    <View className={classnames(styles.rankIndex, getRankIndexClass(index))}>
                      {index + 1}
                    </View>
                    <Text className={styles.styleName}>{item.name}</Text>
                    <View className={styles.styleBarWrap}>
                      <View
                        className={styles.styleBar}
                        style={{ width: `${item.percent}%`, background: item.color }}
                      />
                    </View>
                    <Text className={styles.styleCount}>{item.count}次</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🤖</Text>
              AI打分分析
            </Text>
            <Text className={styles.sectionExtra}>基于 {filteredScores.length} 次评分</Text>
          </View>

          {filteredScores.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🤖</Text>
              <Text className={styles.emptyText}>暂无AI打分数据，快去给穿搭打个分吧</Text>
              <View
                className={styles.emptyBtn}
                onClick={() => Taro.switchTab({ url: '/pages/score/index' })}
              >
                <Text className={styles.emptyBtnText}>去打分</Text>
              </View>
            </View>
          ) : (
            <View className={styles.scoreSection}>
              <View className={styles.keyMetrics}>
                <View
                  className={styles.keyMetricItem}
                  onClick={() => highestScore && handleScoreDetailClick(highestScore.id)}
                >
                  <Text className={styles.keyMetricLabel}>🏆 最高分</Text>
                  <Text className={classnames(styles.keyMetricValue, styles.highest)}>
                    {highestScore?.score ?? '--'}
                  </Text>
                  {highestScore && (
                    <Text className={styles.keyMetricHint}>点击查看 ›</Text>
                  )}
                </View>
                <View
                  className={styles.keyMetricItem}
                  onClick={() => lowestScore && handleScoreDetailClick(lowestScore.id)}
                >
                  <Text className={styles.keyMetricLabel}>📉 最低分</Text>
                  <Text className={classnames(styles.keyMetricValue, styles.lowest)}>
                    {lowestScore?.score ?? '--'}
                  </Text>
                  {lowestScore && (
                    <Text className={styles.keyMetricHint}>点击查看 ›</Text>
                  )}
                </View>
                <View className={styles.keyMetricItem}>
                  <Text className={styles.keyMetricLabel}>📊 平均分</Text>
                  <Text className={classnames(styles.keyMetricValue, styles.average)}>
                    {avgScore || '--'}
                  </Text>
                </View>
              </View>

              <View className={styles.barChartWrap}>
                <View className={styles.barChart}>
                  {scoreDistribution.map((range, index) => (
                    <View
                      key={range.label}
                      className={styles.barCol}
                      onClick={() => handleBarClick(index)}
                    >
                      <Text className={styles.barCount}>{range.count > 0 ? range.count : ''}</Text>
                      <View className={styles.barTrack}>
                        <View
                          className={classnames(
                            styles.barFill,
                            activeRangeIndex === index && styles.barFillActive
                          )}
                          style={{
                            height: `${Math.max(range.percent, range.count > 0 ? 8 : 0)}%`,
                            background: range.color
                          }}
                        />
                      </View>
                      <Text
                        className={classnames(
                          styles.barLabel,
                          activeRangeIndex === index && styles.barLabelActive
                        )}
                      >
                        {range.label}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className={styles.barHint}>点击柱状图查看区间详情</Text>
              </View>

              {activeRangeIndex !== null && (
                <View className={styles.rangePopup}>
                  <View className={styles.rangePopupHeader}>
                    <Text className={styles.rangePopupTitle}>
                      {scoreRanges[activeRangeIndex].label}分 · {rangeScores.length}条记录
                    </Text>
                    <View className={styles.rangePopupClose} onClick={handleClosePopup}>
                      <Text className={styles.rangePopupCloseText}>✕</Text>
                    </View>
                  </View>
                  {rangeScores.length === 0 ? (
                    <Text className={styles.rangePopupEmpty}>该区间暂无穿搭记录</Text>
                  ) : (
                    <ScrollView className={styles.rangePopupList} scrollY style={{ maxHeight: '400rpx' }}>
                      {rangeScores.map((record) => (
                        <View
                          key={record.id}
                          className={styles.rangePopupItem}
                          onClick={() => handleScoreDetailClick(record.id)}
                        >
                          <Image
                            className={styles.rangePopupImg}
                            src={record.image}
                            mode='aspectFill'
                          />
                          <View className={styles.rangePopupInfo}>
                            <Text className={styles.rangePopupScore}>{record.score}分</Text>
                            <Text className={styles.rangePopupDate}>{record.date}</Text>
                          </View>
                          <Text className={styles.rangePopupArrow}>›</Text>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🏆</Text>
              使用排行
            </Text>
            <Text className={styles.sectionExtra}>高频使用TOP榜</Text>
          </View>

          <View className={styles.tagsRanking}>
            <View className={styles.rankBlock}>
              <Text className={styles.rankBlockTitle}>
                <Text className={styles.rankBlockIcon}>🏷️</Text>
                高频标签
              </Text>
              {tagRanking.length === 0 ? (
                <View className={styles.emptyInline}>
                  <Text className={styles.emptyInlineText}>暂无标签使用数据</Text>
                </View>
              ) : (
                <View className={styles.tagCloud}>
                  {tagRanking.map((tag, index) => (
                    <View
                      key={tag.name}
                      className={classnames(styles.tagRankItem, getRankClass(index))}
                    >
                      <Text className={styles.tagName}>{tag.name}</Text>
                      <Text className={styles.tagCount}>×{tag.count}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className={styles.rankBlock}>
              <Text className={styles.rankBlockTitle}>
                <Text className={styles.rankBlockIcon}>👚</Text>
                高频单品
              </Text>
              {filteredOutfits.length === 0 ? (
                <View className={styles.emptyInline}>
                  <Text className={styles.emptyInlineText}>暂无单品使用数据</Text>
                </View>
              ) : (
                <View className={styles.itemRankList}>
                  {mockItems.map((item, index) => (
                    <View key={item.name} className={styles.itemRankRow}>
                      <View className={classnames(styles.itemRankIndex, getRankIndexClass(index))}>
                        {index + 1}
                      </View>
                      <Text className={styles.itemIcon}>{item.icon}</Text>
                      <Text className={styles.itemName}>{item.name}</Text>
                      <Text className={styles.itemUsage}>{item.count}次</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OutfitStatsPage;

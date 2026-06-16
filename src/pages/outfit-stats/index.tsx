import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { OutfitPhoto, ScoreRecord } from '@/types';
import styles from './index.module.scss';

type TimeRange = 'week' | 'month' | 'year' | 'all';

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

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: '60分以下', min: 0, max: 59, count: 0 },
      { label: '60-69', min: 60, max: 69, count: 0 },
      { label: '70-79', min: 70, max: 79, count: 0 },
      { label: '80-89', min: 80, max: 89, count: 0 },
      { label: '90-100', min: 90, max: 100, count: 0 }
    ];
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
          <Text className={styles.metricValue}>{filteredOutfits.length}</Text>
          <Text className={styles.metricLabel}>穿搭记录</Text>
        </View>
        <View className={classnames(styles.metricCard, styles.metricScore)}>
          <Text className={styles.metricIcon}>⭐</Text>
          <Text className={styles.metricValue}>{filteredScores.length}</Text>
          <Text className={styles.metricLabel}>AI打分</Text>
        </View>
        <View className={classnames(styles.metricCard, styles.metricTag)}>
          <Text className={styles.metricIcon}>🏷️</Text>
          <Text className={styles.metricValue}>{uniqueTagsCount}</Text>
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

          <View className={styles.scoreSection}>
            <View className={styles.avgScoreCard}>
              <View
                className={styles.avgScoreCircle}
                style={{ ['--progress' as any]: `${avgScore}%` }}
              >
                <View className={styles.avgScoreInner}>
                  <Text className={styles.avgScoreValue}>{avgScore}</Text>
                  <Text className={styles.avgScoreLabel}>平均分</Text>
                </View>
              </View>
              <View className={styles.avgScoreInfo}>
                <Text className={styles.avgScoreTitle}>
                  {avgScore >= 90
                    ? '时尚达人 🌟'
                    : avgScore >= 80
                    ? '品味出众 ✨'
                    : avgScore >= 70
                    ? '稳步提升 💪'
                    : '继续加油 🎯'}
                </Text>
                <Text className={styles.avgScoreDesc}>
                  {avgScore >= 90
                    ? '你的穿搭品味非常出色，继续保持这份时尚敏感度！'
                    : avgScore >= 80
                    ? '整体搭配很和谐，在细节上再花点心思会更完美~'
                    : avgScore >= 70
                    ? '穿搭有一定的个人风格，多尝试不同搭配会有惊喜！'
                    : '每一次尝试都是进步，期待看到你的蜕变！'}
                </Text>
              </View>
            </View>

            <View className={styles.scoreDistribution}>
              {scoreDistribution.map((range) => (
                <View key={range.label} className={styles.distributionItem}>
                  <Text className={styles.distributionLabel}>{range.label}</Text>
                  <View className={styles.distributionBarWrap}>
                    <View
                      className={styles.distributionBar}
                      style={{ width: `${Math.max(range.percent, range.count > 0 ? 15 : 0)}%` }}
                    >
                      {range.count > 0 && (
                        <Text className={styles.distributionValue}>{range.count}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
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
            </View>

            <View className={styles.rankBlock}>
              <Text className={styles.rankBlockTitle}>
                <Text className={styles.rankBlockIcon}>👚</Text>
                高频单品
              </Text>
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
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default OutfitStatsPage;

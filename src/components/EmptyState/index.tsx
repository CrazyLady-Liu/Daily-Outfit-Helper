import React, { useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

export type EmptyStatePreset =
  | 'outfit-empty'
  | 'outfit-filter'
  | 'outfit-not-found'
  | 'outfit-offline'
  | 'score-empty'
  | 'weather-empty'
  | 'tag-empty'
  | 'network-error'
  | 'custom';

interface PresetConfig {
  icon: string;
  title: string;
  description: string;
  primaryButton?: { text: string };
  secondaryButton?: { text: string };
  tips?: string[];
}

const PRESET_CONFIG_MAP: Record<Exclude<EmptyStatePreset, 'custom'>, PresetConfig> = {
  'outfit-empty': {
    icon: '📸',
    title: '还没有穿搭记录',
    description: '记录你的每一次美丽穿搭，打造专属穿搭日记~',
    primaryButton: { text: '去上传穿搭' },
    tips: [
      '✨ 拍照记录今日穿搭',
      '🏷️ 添加标签方便查找',
      '📊 让AI为你的搭配打分'
    ]
  },
  'outfit-filter': {
    icon: '🔍',
    title: '该分类下暂无穿搭',
    description: '试试其他标签，或者上传新的穿搭吧~',
    primaryButton: { text: '上传新穿搭' },
    secondaryButton: { text: '查看全部穿搭' }
  },
  'outfit-not-found': {
    icon: '👗',
    title: '穿搭不存在',
    description: '抱歉，该穿搭不存在或已被删除，看看其他推荐吧~',
    primaryButton: { text: '返回上一页' },
    secondaryButton: { text: '重新加载' }
  },
  'outfit-offline': {
    icon: '🚫',
    title: '穿搭已下架',
    description: '该穿搭已下架，快来看看其他精选穿搭吧~',
    primaryButton: { text: '返回上一页' },
    secondaryButton: { text: '去看推荐' }
  },
  'score-empty': {
    icon: '📊',
    title: '还没有打分记录',
    description: '上传穿搭照片，AI多维度分析你的搭配',
    primaryButton: { text: '立即去打分' },
    tips: [
      '🎨 色彩搭配分析',
      '👗 款式协调评估',
      '💡 专业搭配建议'
    ]
  },
  'weather-empty': {
    icon: '🌤️',
    title: '暂时无法获取天气',
    description: '请检查网络连接，或尝试刷新页面获取最新天气',
    primaryButton: { text: '重新获取天气' },
    secondaryButton: { text: '浏览全部推荐' }
  },
  'tag-empty': {
    icon: '🏷️',
    title: '暂无风格标签',
    description: '创建属于你的风格标签，更好管理穿搭',
    primaryButton: { text: '创建标签' }
  },
  'network-error': {
    icon: '📡',
    title: '网络连接异常',
    description: '请检查网络设置后重试',
    primaryButton: { text: '重新加载' }
  }
};

interface EmptyStateProps {
  type?: EmptyStatePreset;
  icon?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
  tips?: string[];
  compact?: boolean;
}

function EmptyStateShell({
  type = 'custom',
  icon,
  title,
  description,
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
  tips,
  compact = false
}: EmptyStateProps) {
  const preset = useMemo(() => {
    return type !== 'custom' ? PRESET_CONFIG_MAP[type] : null;
  }, [type]);

  const finalIcon = icon || preset?.icon || '📷';
  const finalTitle = title || preset?.title || '暂无数据';
  const finalDescription = description || preset?.description || '';
  const finalPrimaryText = primaryButtonText || preset?.primaryButton?.text;
  const finalSecondaryText = secondaryButtonText || preset?.secondaryButton?.text;
  const finalTips = tips || preset?.tips;

  return (
    <View className={classnames(styles.emptyContainer, compact && styles.compact)}>
      <View className={styles.iconWrapper}>
        <Text className={styles.icon}>{finalIcon}</Text>
      </View>
      <Text className={styles.title}>{finalTitle}</Text>
      {finalDescription && (
        <Text className={styles.description}>{finalDescription}</Text>
      )}
      <View className={styles.buttonGroup}>
        {finalPrimaryText && (
          <Button className={styles.button} onClick={onPrimaryButtonClick}>
            {finalPrimaryText}
          </Button>
        )}
        {finalSecondaryText && (
          <Button className={styles.secondaryButton} onClick={onSecondaryButtonClick}>
            {finalSecondaryText}
          </Button>
        )}
      </View>
      {finalTips && finalTips.length > 0 && (
        <View className={styles.tipList}>
          {finalTips.map((tip, index) => (
            <View className={styles.tipItem} key={index}>
              <Text className={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default EmptyStateShell;

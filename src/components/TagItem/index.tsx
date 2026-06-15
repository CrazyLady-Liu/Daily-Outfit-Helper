import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { StyleTag } from '@/types';
import styles from './index.module.scss';

interface TagItemProps {
  tag: StyleTag | { name: string; color?: string; count?: number };
  active?: boolean;
  showCount?: boolean;
  showDelete?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const TagItem: React.FC<TagItemProps> = ({
  tag,
  active = false,
  showCount = false,
  showDelete = false,
  onClick,
  onDelete
}) => {
  return (
    <View
      className={classnames(styles.tagItem, active && styles.active)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {tag.color && <View className={styles.colorDot} style={{ background: tag.color }} />}
      <Text className={styles.tagName}>{tag.name}</Text>
      {showCount && (tag as StyleTag).count !== undefined && (
        <Text className={styles.tagCount}>{(tag as StyleTag).count}</Text>
      )}
      {showDelete && (
        <Text
          className={styles.deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          ×
        </Text>
      )}
    </View>
  );
};

export default TagItem;

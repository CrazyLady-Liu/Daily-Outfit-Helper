import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ text = '加载中...', fullScreen = false }) => {
  return (
    <View className={classnames(styles.loadingContainer, fullScreen && styles.fullScreen)}>
      <View className={styles.spinner} />
      <Text className={styles.text}>{text}</Text>
    </View>
  );
};

export default Loading;

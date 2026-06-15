import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import type { LoadingScene } from '@/hooks/useGlobalLoading';
import styles from './index.module.scss';

type LoadingVariant = 'default' | 'row' | 'fullScreen' | 'overlay' | 'compact';

interface LoadingProps {
  scene?: LoadingScene;
  text?: string;
  subtext?: string;
  variant?: LoadingVariant;
  showProgress?: boolean;
  fullScreen?: boolean;
}

function Loading({
  scene,
  text,
  subtext,
  variant = 'default',
  showProgress = false,
  fullScreen = false
}: LoadingProps) {
  const { getLoadingText } = useGlobalLoading();

  const displayText = text || (scene ? getLoadingText(scene) : '加载中...');

  const spinnerEl = (
    <View
      className={classnames(
        styles.spinnerWrapper,
        (variant === 'overlay' || variant === 'fullScreen') && styles.spinnerLarge
      )}
    >
      <View
        className={classnames(
          styles.spinner,
          (variant === 'overlay' || variant === 'fullScreen') && styles.spinnerLarge
        )}
      />
      {variant === 'overlay' && <View className={styles.pulseDot} />}
    </View>
  );

  if (variant === 'overlay') {
    return (
      <View className={styles.overlay}>
        <View className={styles.overlayContent}>
          {spinnerEl}
          <Text className={styles.overlayText}>{displayText}</Text>
          {subtext && <Text className={styles.overlaySubtext}>{subtext}</Text>}
          {showProgress && (
            <View className={styles.progressBar}>
              <View className={styles.progressFill} />
            </View>
          )}
        </View>
      </View>
    );
  }

  if (variant === 'row') {
    return (
      <View className={styles.loadingRow}>
        {spinnerEl}
        <Text className={styles.textRow}>{displayText}</Text>
      </View>
    );
  }

  return (
    <View
      className={classnames(
        styles.loadingContainer,
        (fullScreen || variant === 'fullScreen') && styles.fullScreen,
        variant === 'compact' && styles.compact
      )}
    >
      {spinnerEl}
      <Text className={styles.text}>{displayText}</Text>
    </View>
  );
}

export interface SceneLoadingProps {
  scene: LoadingScene;
  fallback?: React.ReactNode;
  variant?: LoadingVariant;
  showProgress?: boolean;
  subtext?: string;
  children: React.ReactNode;
}

export function SceneLoading({
  scene,
  fallback,
  variant,
  showProgress,
  subtext,
  children
}: SceneLoadingProps) {
  const { isLoading } = useGlobalLoading();
  const loading = isLoading(scene);

  if (!loading) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <Loading
      scene={scene}
      variant={variant}
      showProgress={showProgress}
      subtext={subtext}
    />
  );
}

export default Loading;

import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useGlobalLoading, DEFAULT_LOADING_TEXTS } from '@/hooks/useGlobalLoading';
import type { LoadingScene } from '@/hooks/useGlobalLoading';
import styles from './index.module.scss';

type LoadingVariant = 'default' | 'row' | 'fullScreen' | 'overlay' | 'compact';

interface LoadingSpinnerProps {
  scene?: LoadingScene;
  text?: string;
  subtext?: string;
  variant?: LoadingVariant;
  showProgress?: boolean;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  scene,
  text,
  subtext,
  variant = 'default',
  showProgress = false,
  fullScreen = false
}: LoadingSpinnerProps) => {
  const { getLoadingText } = useGlobalLoading();

  const displayText = useMemo(() => {
    if (text) return text;
    if (scene) return getLoadingText(scene);
    return DEFAULT_LOADING_TEXTS.global || '加载中...';
  }, [text, scene, getLoadingText]);

  const spinnerNode = (
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
          {spinnerNode}
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
        {spinnerNode}
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
      {spinnerNode}
      <Text className={styles.text}>{displayText}</Text>
    </View>
  );
};

export interface SceneLoadingProps {
  scene: LoadingScene;
  fallback?: React.ReactNode;
  variant?: LoadingVariant;
  showProgress?: boolean;
  subtext?: string;
  children: React.ReactNode;
}

function SceneLoadingBoundary({
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
    <LoadingSpinner
      scene={scene}
      variant={variant}
      showProgress={showProgress}
      subtext={subtext}
    />
  );
}

export const SceneLoading = SceneLoadingBoundary;

export const withLoading = (options: {
  scene: LoadingScene;
  variant?: LoadingVariant;
  errorFallback?: React.ReactNode;
}) => {
  return <P extends object>(Component: React.ComponentType<P>) => {
    const WithLoadingWrapper = (props: P) => {
      const { isLoading, startLoading, stopLoading } = useGlobalLoading();
      const [hasError, setHasError] = React.useState(false);

      React.useEffect(() => {
        const runAsync = async () => {
          startLoading(options.scene);
          try {
            await new Promise<void>((resolve) => setTimeout(resolve, 600));
            stopLoading(options.scene);
          } catch {
            setHasError(true);
            stopLoading(options.scene);
          }
        };
        runAsync();
      }, [startLoading, stopLoading, options.scene]);

      if (isLoading(options.scene)) {
        return <LoadingSpinner scene={options.scene} variant={options.variant} />;
      }

      if (hasError) {
        return (
          options.errorFallback || (
            <View className={styles.loadingContainer}>
              <Text className={styles.text}>加载失败，请重试</Text>
            </View>
          )
        );
      }

      return <Component {...props} />;
    };
    return WithLoadingWrapper;
  };
};

export default LoadingSpinner;

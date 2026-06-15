import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

export type ErrorBoundaryMode = 'page' | 'section' | 'inline';

interface AppErrorBoundaryProps {
  mode?: ErrorBoundaryMode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorType: 'render' | 'unknown';
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorType: 'unknown'
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorType: 'render'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[AppErrorBoundary] Caught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    try {
      Taro.reportMonitor?.('app_error', error.message);
    } catch {
      // ignore
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorType: 'unknown'
    });
  };

  handleReload = () => {
    this.handleReset();
    try {
      const pages = Taro.getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage && (currentPage as any).onPullDownRefresh) {
        (currentPage as any).onPullDownRefresh();
      } else {
        Taro.reLaunch({
          url: '/pages/home/index'
        });
      }
    } catch {
      // fallback to home
      Taro.switchTab({ url: '/pages/home/index' });
    }
  };

  render() {
    const { mode = 'page', fallback, children } = this.props;
    const { hasError, error, errorType } = this.state;

    if (!hasError) {
      return <>{children}</>;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    if (mode === 'inline') {
      return (
        <View className={styles.inlineError}>
          <Text className={styles.inlineIcon}>⚠️</Text>
          <Text className={styles.inlineText}>加载异常</Text>
          <Button className={styles.inlineBtn} onClick={this.handleReset}>
            重试
          </Button>
        </View>
      );
    }

    if (mode === 'section') {
      return (
        <View className={styles.sectionError}>
          <Text className={styles.errorIcon}>❌</Text>
          <Text className={styles.errorTitle}>内容加载失败</Text>
          <Text className={styles.errorDesc}>
            {error?.message || '请检查网络后重试'}
          </Text>
          <Button className={styles.retryBtn} onClick={this.handleReload}>
            重新加载
          </Button>
        </View>
      );
    }

    return (
      <View className={styles.errorPage}>
        <View className={styles.errorContent}>
          <Text className={styles.errorEmoji}>😵</Text>
          <Text className={styles.errorTitle}>哎呀，出了点小问题</Text>
          <Text className={styles.errorSubtitle}>
            {errorType === 'render'
              ? '页面渲染异常，开发团队已收到通知'
              : '加载过程中遇到问题'}
          </Text>
          <Text className={styles.errorMessage} selectable>
            {error?.message || '未知错误'}
          </Text>
          <View className={styles.errorActions}>
            <Button className={styles.primaryBtn} onClick={this.handleReload}>
              重新加载
            </Button>
            <Button className={styles.secondaryBtn} onClick={this.handleReset}>
              忽略继续
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default AppErrorBoundary;

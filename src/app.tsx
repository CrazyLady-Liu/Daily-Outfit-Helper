import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { LoadingProvider } from '@/hooks/useGlobalLoading';
import AppErrorBoundary from '@/components/AppErrorBoundary';
import './app.scss';

function AppRoot(props: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[App] 应用初始化');
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        console.error('[Global Error]', { message, source, lineno, colno, error });
        try {
          Taro.reportMonitor?.('global_error', String(message));
        } catch {
          // ignore
        }
        return false;
      };

      window.onunhandledrejection = (event) => {
        console.error('[Unhandled Promise Rejection]', event.reason);
        try {
          Taro.reportMonitor?.('unhandled_promise', String(event.reason));
        } catch {
          // ignore
        }
      };
    }
  }, []);

  useDidShow(() => {
    console.log('[App] 页面显示');
  });

  useDidHide(() => {
    console.log('[App] 页面隐藏');
  });

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('[AppErrorBoundary] Render error caught:', error, errorInfo);
    try {
      Taro.reportMonitor?.('render_error', error.message);
    } catch {
      // ignore
    }
  };

  return (
    <LoadingProvider>
      <AppErrorBoundary mode='page' onError={handleError}>
        {props.children}
      </AppErrorBoundary>
    </LoadingProvider>
  );
}

export default AppRoot;

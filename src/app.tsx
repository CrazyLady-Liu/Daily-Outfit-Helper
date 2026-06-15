import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { LoadingProvider } from '@/hooks/useGlobalLoading';
import './app.scss';

function App(props: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('[App] 应用初始化');
  }, []);

  useDidShow(() => {
    console.log('[App] 页面显示');
  });

  useDidHide(() => {
    console.log('[App] 页面隐藏');
  });

  return <LoadingProvider>{props.children}</LoadingProvider>;
}

export default App;

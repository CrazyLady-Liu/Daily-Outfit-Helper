import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LoadingScene =
  | 'weather'
  | 'recommend'
  | 'outfit-list'
  | 'outfit-upload'
  | 'score-history'
  | 'score-calc'
  | 'tag-list'
  | 'tag-create'
  | 'user-info'
  | 'global';

interface LoadingContextType {
  loadingStates: Record<LoadingScene, boolean>;
  loadingTexts: Record<LoadingScene, string>;
  isLoading: (scene: LoadingScene) => boolean;
  getLoadingText: (scene: LoadingScene) => string;
  startLoading: (scene: LoadingScene, text?: string) => void;
  stopLoading: (scene: LoadingScene) => void;
  withLoading: <T>(
    scene: LoadingScene,
    fn: () => Promise<T>,
    text?: string
  ) => Promise<T | null>;
  anyLoading: boolean;
}

const DEFAULT_LOADING_TEXTS: Record<LoadingScene, string> = {
  weather: '正在获取天气信息...',
  recommend: '正在生成穿搭推荐...',
  'outfit-list': '加载穿搭记录...',
  'outfit-upload': '正在上传穿搭...',
  'score-history': '加载打分记录...',
  'score-calc': 'AI 正在分析你的穿搭...',
  'tag-list': '加载标签...',
  'tag-create': '创建标签中...',
  'user-info': '加载用户信息...',
  global: '加载中...'
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<LoadingScene, boolean>>(
    {} as Record<LoadingScene, boolean>
  );
  const [loadingTexts, setLoadingTexts] = useState<Record<LoadingScene, string>>(
    DEFAULT_LOADING_TEXTS
  );

  const isLoading = useCallback(
    (scene: LoadingScene) => !!loadingStates[scene],
    [loadingStates]
  );

  const getLoadingText = useCallback(
    (scene: LoadingScene) => loadingTexts[scene] || DEFAULT_LOADING_TEXTS[scene] || '加载中...',
    [loadingTexts]
  );

  const startLoading = useCallback((scene: LoadingScene, text?: string) => {
    console.log(`[GlobalLoading] Start: ${scene}`);
    setLoadingStates((prev) => ({ ...prev, [scene]: true });
    if (text) {
      setLoadingTexts((prev) => ({ ...prev, [scene]: text });
    }
  }, []);

  const stopLoading = useCallback((scene: LoadingScene) => {
    console.log(`[GlobalLoading] Stop: ${scene}`);
    setLoadingStates((prev) => ({ ...prev, [scene]: false }));
  }, []);

  const withLoading = useCallback(
    async <T,>(
      scene: LoadingScene,
      fn: () => Promise<T>,
      text?: string
    ): Promise<T | null> => {
      startLoading(scene, text);
      try {
        const result = await fn();
        return result;
      } catch (error) {
          console.error(`[GlobalLoading] Error in ${scene}:`, error);
          throw error;
        } finally {
          stopLoading(scene);
        }
      },
      [startLoading, stopLoading]
    );

  const anyLoading = Object.values(loadingStates).some(Boolean);

  return (
    <LoadingContext.Provider
      value={{
        loadingStates,
        loadingTexts,
        isLoading,
        getLoadingText,
        startLoading,
        stopLoading,
        withLoading,
        anyLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
}

export default LoadingContext;

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

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
  | 'profile-edit'
  | 'profile-save'
  | 'global';

export const DEFAULT_LOADING_TEXTS: Record<LoadingScene, string> = {
  weather: '正在获取天气信息...',
  recommend: '正在生成穿搭推荐...',
  'outfit-list': '加载穿搭记录...',
  'outfit-upload': '正在上传穿搭...',
  'score-history': '加载打分记录...',
  'score-calc': 'AI 正在分析你的穿搭...',
  'tag-list': '加载标签...',
  'tag-create': '创建标签中...',
  'user-info': '加载用户信息...',
  'profile-edit': '正在进入编辑页...',
  'profile-save': '正在保存...',
  global: '加载中...'
};

interface LoadingContextValue {
  loadingStates: Record<LoadingScene, boolean>;
  isLoading: (scene: LoadingScene) => boolean;
  getLoadingText: (scene: LoadingScene) => string;
  startLoading: (scene: LoadingScene, text?: string) => void;
  stopLoading: (scene: LoadingScene) => void;
  withLoading: <T>(scene: LoadingScene, fn: () => Promise<T>, text?: string) => Promise<T>;
  anyLoading: boolean;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

const createInitialStates = (): Record<LoadingScene, boolean> => ({
  weather: false,
  recommend: false,
  'outfit-list': false,
  'outfit-upload': false,
  'score-history': false,
  'score-calc': false,
  'tag-list': false,
  'tag-create': false,
  'user-info': false,
  'profile-edit': false,
  'profile-save': false,
  global: false
} as Record<LoadingScene, boolean>);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<LoadingScene, boolean>>(
    createInitialStates()
  );
  const [customTexts, setCustomTexts] = useState<Partial<Record<LoadingScene, string>>>({});

  const isLoading = useCallback(
    (scene: LoadingScene) => !!loadingStates[scene],
    [loadingStates]
  );

  const getLoadingText = useCallback(
    (scene: LoadingScene) => {
      return customTexts[scene] || DEFAULT_LOADING_TEXTS[scene] || '加载中...';
    },
    [customTexts]
  );

  const startLoading = useCallback((scene: LoadingScene, text?: string) => {
    setLoadingStates((prev) => ({ ...prev, [scene]: true }));
    if (text) {
      setCustomTexts((prev) => ({ ...prev, [scene]: text }));
    }
  }, []);

  const stopLoading = useCallback((scene: LoadingScene) => {
    setLoadingStates((prev) => ({ ...prev, [scene]: false }));
  }, []);

  const withLoading = useCallback(
    async <T,>(scene: LoadingScene, fn: () => Promise<T>, text?: string): Promise<T> => {
      startLoading(scene, text);
      try {
        const result = await fn();
        return result;
      } finally {
        stopLoading(scene);
      }
    },
    [startLoading, stopLoading]
  );

  const anyLoading = useMemo(
    () => Object.values(loadingStates).some(Boolean),
    [loadingStates]
  );

  const value = useMemo<LoadingContextValue>(
    () => ({
      loadingStates,
      isLoading,
      getLoadingText,
      startLoading,
      stopLoading,
      withLoading,
      anyLoading
    }),
    [loadingStates, isLoading, getLoadingText, startLoading, stopLoading, withLoading, anyLoading]
  );

  return React.createElement(LoadingContext.Provider, { value }, children);
}

export function useGlobalLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    const fallback: LoadingContextValue = {
      loadingStates: createInitialStates(),
      isLoading: () => false,
      getLoadingText: (scene) => DEFAULT_LOADING_TEXTS[scene] || '加载中...',
      startLoading: () => {},
      stopLoading: () => {},
      withLoading: async (_scene, fn) => fn(),
      anyLoading: false
    };
    return fallback;
  }
  return context;
}

export default LoadingContext;

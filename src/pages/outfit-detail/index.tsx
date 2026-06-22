import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { OutfitDetail } from '@/types';
import { fetchOutfitDetail } from '@/services/outfitService';
import styles from './index.module.scss';

type EmptyType = 'not-found' | 'offline' | null;

const OutfitDetailPage: React.FC = () => {
  const router = useRouter();
  const { withLoading, isLoading } = useGlobalLoading();
  const [outfitDetail, setOutfitDetail] = useState<OutfitDetail | null>(null);
  const [emptyType, setEmptyType] = useState<EmptyType>(null);

  const outfitId = router.params.outfitId as string;

  const loadOutfitDetail = useCallback(async (id: string) => {
    console.log('[OutfitDetail] Loading detail for outfitId:', id);
    setEmptyType(null);
    setOutfitDetail(null);

    try {
      const detail = await withLoading('outfit-detail', () => fetchOutfitDetail(id));

      if (!detail) {
        console.log('[OutfitDetail] Outfit not found:', id);
        setEmptyType('not-found');
        return;
      }

      if (detail.isOffline) {
        console.log('[OutfitDetail] Outfit is offline:', id);
        setEmptyType('offline');
        return;
      }

      console.log('[OutfitDetail] Detail loaded successfully:', detail.title);
      setOutfitDetail(detail);
    } catch (error) {
      console.error('[OutfitDetail] Failed to load detail:', error);
      setEmptyType('not-found');
    }
  }, [withLoading]);

  useEffect(() => {
    if (!outfitId) {
      console.log('[OutfitDetail] No outfitId provided');
      setEmptyType('not-found');
      return;
    }

    loadOutfitDetail(outfitId);
  }, [outfitId, loadOutfitDetail]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleRetry = () => {
    if (outfitId) {
      loadOutfitDetail(outfitId);
    }
  };

  const handleGoRecommend = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const emptyStateProps = useMemo(() => {
    if (emptyType === 'offline') {
      return {
        type: 'outfit-offline' as const,
        onPrimaryButtonClick: handleBack,
        onSecondaryButtonClick: handleGoRecommend
      };
    }
    return {
      type: 'outfit-not-found' as const,
      onPrimaryButtonClick: handleBack,
      onSecondaryButtonClick: handleRetry
    };
  }, [emptyType]);

  if (isLoading('outfit-detail')) {
    return (
      <View className={styles.loadingContainer}>
        <Loading scene='outfit-detail' variant='fullScreen' />
      </View>
    );
  }

  if (emptyType) {
    return (
      <View className={styles.emptyState}>
        <EmptyState {...emptyStateProps} />
      </View>
    );
  }

  if (!outfitDetail) {
    return null;
  }

  const getItemIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      '上装': '👚',
      '下装': '👖',
      '鞋履': '👟',
      '配饰': '👜',
      '外套': '🧥',
      '连衣裙': '👗',
      '内搭': '👕'
    };
    return iconMap[category] || '👔';
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <Image
        className={styles.coverImage}
        src={outfitDetail.coverImage}
        mode='aspectFill'
      />

      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{outfitDetail.title}</Text>
          <Text className={styles.description}>{outfitDetail.description}</Text>

          <View className={styles.metaRow}>
            <View className={styles.metaBadge}>🌡️ {outfitDetail.temperatureRange}</View>
            <View className={styles.metaBadge}>☁️ {outfitDetail.weatherType}</View>
            <View className={styles.metaBadge}>🎯 {outfitDetail.occasion}</View>
            <View className={styles.metaBadge}>🌸 {outfitDetail.season}</View>
            <View className={styles.metaBadge}>✨ {outfitDetail.style}</View>
          </View>

          <View className={styles.tags}>
            {outfitDetail.tags.map((tag, index) => (
              <View key={index} className={styles.tag}>
                {tag}
              </View>
            ))}
          </View>
        </View>

        {outfitDetail.images.length > 1 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>穿搭展示</Text>
            <ScrollView className={styles.imageGallery} scrollX>
              {outfitDetail.images.map((image, index) => (
                <Image
                  key={index}
                  className={styles.galleryImage}
                  src={image}
                  mode='aspectFill'
                />
              ))}
            </ScrollView>
          </View>
        )}

        {outfitDetail.items.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>搭配单品</Text>
            <View className={styles.itemList}>
              {outfitDetail.items.map((item) => (
                <View key={item.id} className={styles.itemCard}>
                  <View className={styles.itemIcon}>
                    <Text>{getItemIcon(item.category)}</Text>
                  </View>
                  <View className={styles.itemInfo}>
                    <Text className={styles.itemName}>{item.name}</Text>
                    <Text className={styles.itemMeta}>{item.category} · {item.color}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OutfitDetailPage;

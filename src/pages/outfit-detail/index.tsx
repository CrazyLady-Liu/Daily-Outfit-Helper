import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { OutfitDetail } from '@/types';
import { fetchOutfitDetail } from '@/services/outfitService';
import styles from './index.module.scss';

const OutfitDetailPage: React.FC = () => {
  const router = useRouter();
  const { withLoading, isLoading } = useGlobalLoading();
  const [outfitDetail, setOutfitDetail] = useState<OutfitDetail | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const outfitId = router.params.outfitId as string;

  const loadOutfitDetail = useCallback(async (id: string) => {
    console.log('[OutfitDetail] Loading detail for outfitId:', id);
    setIsNotFound(false);
    setIsOffline(false);
    setOutfitDetail(null);

    try {
      const detail = await withLoading('outfit-detail', () => fetchOutfitDetail(id));

      if (!detail) {
        console.log('[OutfitDetail] Outfit not found:', id);
        setIsNotFound(true);
        return;
      }

      if (detail.isOffline) {
        console.log('[OutfitDetail] Outfit is offline:', id);
        setIsOffline(true);
        return;
      }

      console.log('[OutfitDetail] Detail loaded successfully:', detail.title);
      setOutfitDetail(detail);
    } catch (error) {
      console.error('[OutfitDetail] Failed to load detail:', error);
      setIsNotFound(true);
    }
  }, [withLoading]);

  useEffect(() => {
    if (!outfitId) {
      console.log('[OutfitDetail] No outfitId provided');
      setIsNotFound(true);
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

  if (isLoading('outfit-detail')) {
    return (
      <View className={styles.loadingContainer}>
        <Loading scene='outfit-detail' variant='fullScreen' />
      </View>
    );
  }

  if (isNotFound || isOffline) {
    return (
      <View className={styles.emptyState}>
        <EmptyState
          icon='👗'
          title='穿搭不存在'
          description={isOffline ? '该穿搭已下架，看看其他推荐吧~' : '抱歉，该穿搭不存在或已被删除'}
          primaryButtonText='返回上一页'
          secondaryButtonText={isNotFound ? '重新加载' : undefined}
          onPrimaryButtonClick={handleBack}
          onSecondaryButtonClick={isNotFound ? handleRetry : undefined}
        />
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
      '外套': '🧥'
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

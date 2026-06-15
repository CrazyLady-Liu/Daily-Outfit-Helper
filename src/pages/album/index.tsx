import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import OutfitCard from '@/components/OutfitCard';
import { OutfitPhoto, LoadingState } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { mockQuickTags } from '@/data/tags';
import { delay, generateId } from '@/utils';
import styles from './index.module.scss';
import classnames from 'classnames';

const AlbumPage: React.FC = () => {
  const [loading, setLoading] = useState<LoadingState>('loading');
  const [activeFilter, setActiveFilter] = useState<string>('全部');
  const { outfitPhotos, addOutfitPhoto, userInfo } = useAppStore();
  const [filteredPhotos, setFilteredPhotos] = useState<OutfitPhoto[]>([]);

  const filters = ['全部', ...mockQuickTags];

  const loadData = async () => {
    setLoading('loading');
    console.log('[AlbumPage] Loading outfit photos...');
    try {
      await delay(600);
      setLoading('success');
    } catch (error) {
      console.error('[AlbumPage] Load data error:', error);
      setLoading('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeFilter === '全部') {
      setFilteredPhotos(outfitPhotos);
    } else {
      setFilteredPhotos(
        outfitPhotos.filter((photo) => photo.tags.includes(activeFilter) || photo.style === activeFilter)
      );
    }
  }, [activeFilter, outfitPhotos]);

  const handleAddPhoto = async () => {
    console.log('[AlbumPage] Add new outfit photo');
    Taro.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: async (res) => {
        console.log('[AlbumPage] Selected source:', res.tapIndex);
        Taro.showLoading({ title: '上传中...', mask: true });
        
        await delay(1500);
        
        const newPhoto: OutfitPhoto = {
          id: generateId(),
          image: `https://picsum.photos/id/${100 + Math.floor(Math.random() * 50)}/500/700`,
          description: '新上传的穿搭，快来看看吧~',
          date: new Date().toISOString().split('T')[0],
          tags: ['日常'],
          style: '休闲风',
          season: '夏季'
        };
        
        addOutfitPhoto(newPhoto);
        Taro.hideLoading();
        Taro.showToast({ title: '上传成功！', icon: 'success' });
      }
    });
  };

  const handlePhotoClick = (photo: OutfitPhoto) => {
    console.log('[AlbumPage] Click photo:', photo.id);
    Taro.navigateTo({ url: '/pages/outfit-detail/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.pageTitle}>我的穿搭</Text>
        <Text className={styles.pageSubtitle}>记录每一个漂亮的瞬间 📸</Text>
      </View>

      <View className={styles.statsBar}>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{userInfo.totalOutfits}</Text>
          <Text className={styles.statsLabel}>穿搭总数</Text>
        </View>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{new Set(outfitPhotos.flatMap(p => p.tags)).size}</Text>
          <Text className={styles.statsLabel}>标签数量</Text>
        </View>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{new Set(outfitPhotos.map(p => p.style)).size}</Text>
          <Text className={styles.statsLabel}>风格种类</Text>
        </View>
      </View>

      <View className={styles.filterBar}>
        <ScrollView className={styles.filterScroll} scrollX enhanced showScrollbar={false}>
          {filters.map((filter) => (
            <View
              key={filter}
              className={classnames(
                styles.filterTag,
                activeFilter === filter && styles.filterTagActive
              )}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </View>
          ))}
        </ScrollView>
      </View>

      {loading === 'loading' ? (
        <Loading text='加载穿搭记录...' />
      ) : filteredPhotos.length === 0 ? (
        <EmptyState
          icon='📷'
          title='暂无穿搭记录'
          description={activeFilter === '全部' ? '快去记录你的第一套穿搭吧！' : `该分类下暂无穿搭，换个标签看看`}
          buttonText='上传穿搭'
          onButtonClick={handleAddPhoto}
        />
      ) : (
        <View className={styles.photoGrid}>
          {filteredPhotos.map((photo) => (
            <View className={styles.photoItem} key={photo.id}>
              <OutfitCard data={photo} type='photo' onClick={() => handlePhotoClick(photo)} />
            </View>
          ))}
        </View>
      )}

      <Button className={styles.fabButton} onClick={handleAddPhoto}>
        <Text className={styles.fabIcon}>+</Text>
      </Button>
    </ScrollView>
  );
};

export default AlbumPage;

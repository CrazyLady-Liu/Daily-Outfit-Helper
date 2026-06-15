import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading';
import { LoadingState } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { delay } from '@/utils';
import styles from './index.module.scss';

const menuItems = [
  { icon: '📝', text: '我的收藏', badge: '' },
  { icon: '📊', text: '穿搭数据', badge: '' },
  { icon: '⚙️', text: '设置', badge: '' },
  { icon: '💬', text: '意见反馈', badge: '' },
  { icon: 'ℹ️', text: '关于我们', badge: 'v1.0.0' }
];

const MinePage: React.FC = () => {
  const [loading, setLoading] = useState<LoadingState>('loading');
  const { userInfo, outfitPhotos, scoreRecords } = useAppStore();

  const loadData = async () => {
    setLoading('loading');
    console.log('[MinePage] Loading user info...');
    try {
      await delay(400);
      setLoading('success');
    } catch (error) {
      console.error('[MinePage] Load data error:', error);
      setLoading('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditProfile = () => {
    console.log('[MinePage] Edit profile');
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    console.log('[MinePage] Click menu item:', item.text);
    Taro.showToast({ title: `${item.text}功能开发中`, icon: 'none' });
  };

  if (loading === 'loading') {
    return <Loading text='加载用户信息...' fullScreen />;
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <Image
            className={styles.avatar}
            src={userInfo.avatar}
            mode='aspectFill'
            onError={(e) => console.error('[MinePage] Avatar load error:', e)}
          />
          <View className={styles.profileText}>
            <Text className={styles.nickname}>{userInfo.nickname}</Text>
            <Text className={styles.tagline}>每天都要美美哒 ✨</Text>
          </View>
          <Button className={styles.editBtn} onClick={handleEditProfile}>
            编辑
          </Button>
        </View>
      </View>

      <View className={styles.statsCard}>
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{userInfo.totalOutfits}</Text>
          <Text className={styles.statsLabel}>穿搭记录</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{userInfo.totalScores}</Text>
          <Text className={styles.statsLabel}>AI打分</Text>
        </View>
        <View className={styles.statsDivider} />
        <View className={styles.statsItem}>
          <Text className={styles.statsValue}>{new Set(outfitPhotos.flatMap(p => p.tags)).size}</Text>
          <Text className={styles.statsLabel}>使用标签</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>我的风格</Text>
        <View className={styles.favoriteCard}>
          <View className={styles.favoriteIcon}>👗</View>
          <View className={styles.favoriteInfo}>
            <Text className={styles.favoriteLabel}>最常穿搭风格</Text>
            <Text className={styles.favoriteStyle}>{userInfo.favoriteStyle}</Text>
          </View>
          <Text className={styles.menuArrow}>→</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>更多功能</Text>
        <View className={styles.menuList}>
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={styles.menuItem}
              onClick={() => handleMenuClick(item)}
            >
              <View className={styles.menuIcon}>{item.icon}</View>
              <Text className={styles.menuText}>{item.text}</Text>
              {item.badge && <Text className={styles.menuBadge}>{item.badge}</Text>}
              <Text className={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;

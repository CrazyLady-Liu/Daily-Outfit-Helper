import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { SceneLoading } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAppStore } from '@/store/useAppStore';
import { delay, trackEvent, checkNetwork } from '@/utils';
import styles from './index.module.scss';

const menuItems = [
  { icon: '📝', text: '我的收藏', badge: '' },
  { icon: '📊', text: '穿搭数据', badge: '' },
  { icon: '⚙️', text: '设置', badge: '' },
  { icon: '💬', text: '意见反馈', badge: '' },
  { icon: 'ℹ️', text: '关于我们', badge: 'v1.0.0' }
];

const MinePage: React.FC = () => {
  const { withLoading, isLoading } = useGlobalLoading();
  const { userInfo, outfitPhotos, scoreRecords } = useAppStore();

  const loadUserInfo = async () => {
    await delay(400);
  };

  const loadData = async () => {
    console.log('[MinePage] Loading user info via global Loading...');
    await withLoading('user-info', loadUserInfo).catch((e) => {
      console.error('[MinePage] Load data error:', e);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditProfile = async () => {
    trackEvent('click_mine_edit');

    if (isLoading('profile-edit')) {
      return;
    }

    const hasNetwork = await checkNetwork();
    if (!hasNetwork) {
      Taro.showToast({ title: '网络异常，请检查网络后重试', icon: 'none' });
      return;
    }

    try {
      await withLoading('profile-edit', async () => {
        await delay(300);
      });
      Taro.navigateTo({ url: '/pages/profile-edit/index' });
    } catch (error) {
      console.error('[MinePage] Navigate to edit page failed:', error);
      Taro.showToast({ title: '进入编辑页失败，请重试', icon: 'none' });
    }
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    console.log('[MinePage] Click menu item:', item.text);
    if (item.text === '穿搭数据') {
      Taro.navigateTo({ url: '/pages/outfit-stats/index' });
    } else {
      Taro.showToast({ title: `${item.text}功能开发中`, icon: 'none' });
    }
  };

  return (
    <SceneLoading scene='user-info' variant='fullScreen'>
      {!userInfo ? (
        <EmptyState
          type='network-error'
          onPrimaryButtonClick={loadData}
        />
      ) : (
        <ScrollView className={styles.page} scrollY>
          <View className={styles.profileHeader}>
            <View className={styles.profileInfo}>
              <Image
                className={styles.avatar}
                src={userInfo.avatar}
                mode='aspectFill'
                onError={(e) => console.error('[MinePage] Avatar load error:', e)}
              />
              <View className={styles.profileTextGroup}>
                <Text className={styles.nicknameCol}>{userInfo.nickname}</Text>
                <Text className={styles.taglineCol}>每天都要美美哒</Text>
              </View>
              <View
                className={classnames(styles.editBtn, isLoading('profile-edit') && styles.editBtnDisabled)}
                onTap={handleEditProfile}
              >
                {isLoading('profile-edit') ? (
                  <View className={styles.editBtnLoading}>
                    <View className={styles.editBtnSpinner} />
                    <Text className={styles.editBtnText}>加载中</Text>
                  </View>
                ) : (
                  <Text className={styles.editBtnText}>编辑</Text>
                )}
              </View>
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
              <Text className={styles.statsValue}>
                {new Set(outfitPhotos.flatMap((p) => p.tags)).size}
              </Text>
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
      )}
    </SceneLoading>
  );
};

export default MinePage;

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading, { SceneLoading } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAppStore } from '@/store/useAppStore';
import { delay } from '@/utils';
import styles from './index.module.scss';

interface ArcCharStyle {
  transform: string;
  left: string;
  top: string;
}

const getArcTextStyles = (
  text: string,
  radius: number,
  startAngle: number,
  angleStep: number,
  offsetX: number = 0,
  offsetY: number = 0,
  rotateScale: number = 0.3
): ArcCharStyle[] => {
  const chars = text.split('');

  return chars.map((_, index) => {
    const angle = startAngle + index * angleStep;
    const radian = (angle * Math.PI) / 180;
    const x = Math.sin(radian) * radius + offsetX;
    const y = -Math.cos(radian) * radius + offsetY;
    const rotate = angle * rotateScale;

    return {
      transform: `rotate(${rotate}deg)`,
      left: `${x}rpx`,
      top: `${y}rpx`
    };
  });
};

const menuItems = [
  { icon: '📝', text: '我的收藏', badge: '' },
  { icon: '📊', text: '穿搭数据', badge: '' },
  { icon: '⚙️', text: '设置', badge: '' },
  { icon: '💬', text: '意见反馈', badge: '' },
  { icon: 'ℹ️', text: '关于我们', badge: 'v1.0.0' }
];

const MinePage: React.FC = () => {
  const { withLoading } = useGlobalLoading();
  const { userInfo, outfitPhotos, scoreRecords } = useAppStore();

  const nicknameArcStyles = useMemo(() => {
    if (!userInfo?.nickname) return [];
    const text = userInfo.nickname;
    const radius = 280;
    const startAngle = -14;
    const angleStep = 5;
    return getArcTextStyles(text, radius, startAngle, angleStep, 70, 0, 0.4);
  }, [userInfo?.nickname]);

  const taglineArcStyles = useMemo(() => {
    const tagline = '每天都要美美哒 ✨';
    const radius = 260;
    const startAngle = -10;
    const angleStep = 3;
    return getArcTextStyles(tagline, radius, startAngle, angleStep, 78, 52, 0.35);
  }, []);

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

  const handleEditProfile = () => {
    console.log('[MinePage] Edit profile');
    Taro.showToast({ title: '功能开发中', icon: 'none' });
  };

  const handleMenuClick = (item: typeof menuItems[0]) => {
    console.log('[MinePage] Click menu item:', item.text);
    Taro.showToast({ title: `${item.text}功能开发中`, icon: 'none' });
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
              <View className={styles.arcTextWrapper}>
                <View className={styles.arcNickname}>
                  {userInfo.nickname.split('').map((char, index) => (
                    <Text
                      key={`nick-${index}`}
                      className={styles.arcNicknameChar}
                      style={nicknameArcStyles[index] || {}}
                    >
                      {char}
                    </Text>
                  ))}
                </View>
                <View className={styles.arcTagline}>
                  {'每天都要美美哒 ✨'.split('').map((char, index) => (
                    <Text
                      key={`tag-${index}`}
                      className={styles.arcTaglineChar}
                      style={taglineArcStyles[index] || {}}
                    >
                      {char}
                    </Text>
                  ))}
                </View>
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

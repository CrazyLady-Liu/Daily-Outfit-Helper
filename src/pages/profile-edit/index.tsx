import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useAppStore } from '@/store/useAppStore';
import { delay } from '@/utils';
import styles from './index.module.scss';
import classnames from 'classnames';

const styleOptions = ['休闲风', '甜美风', '通勤风', '运动风', '复古风', '优雅风', '街头风', '简约风'];

const ProfileEditPage: React.FC = () => {
  const { withLoading, isLoading } = useGlobalLoading();
  const { userInfo, updateUserInfo } = useAppStore();

  const [nickname, setNickname] = useState(userInfo.nickname);
  const [selectedStyle, setSelectedStyle] = useState(userInfo.favoriteStyle);
  const [avatar, setAvatar] = useState(userInfo.avatar);

  useEffect(() => {
    setNickname(userInfo.nickname);
    setSelectedStyle(userInfo.favoriteStyle);
    setAvatar(userInfo.avatar);
  }, [userInfo]);

  const handleAvatarClick = () => {
    Taro.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        console.log('[ProfileEdit] Select avatar source:', res.tapIndex);
        Taro.showToast({ title: '头像更换功能开发中', icon: 'none' });
      }
    });
  };

  const handleSave = async () => {
    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    try {
      await withLoading('profile-save', async () => {
        await delay(800);
        updateUserInfo({
          nickname: nickname.trim(),
          favoriteStyle: selectedStyle,
          avatar
        });
      });
      Taro.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('[ProfileEdit] Save failed:', error);
      Taro.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
  };

  return (
    <>
      <ScrollView className={styles.page} scrollY>
        <View className={styles.avatarSection}>
          <Text className={styles.avatarTitle}>点击更换头像</Text>
          <View className={styles.avatarWrapper} onClick={handleAvatarClick}>
            <Image
              className={styles.avatar}
              src={avatar}
              mode='aspectFill'
            />
            <View className={styles.avatarEditIcon}>📷</View>
          </View>
        </View>

        <View className={styles.formSection}>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>昵称</Text>
            <Input
              className={styles.formInput}
              placeholder='请输入昵称'
              value={nickname}
              onInput={(e) => setNickname(e.detail.value)}
              maxlength={20}
              placeholderClass={styles.formInput}
            />
          </View>
        </View>

        <View className={styles.styleSection}>
          <Text className={styles.sectionTitle}>我的风格</Text>
          <View className={styles.styleTags}>
            {styleOptions.map((style) => (
              <View
                key={style}
                className={classnames(styles.styleTag, selectedStyle === style && styles.active)}
                onClick={() => setSelectedStyle(style)}
              >
                {style}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.saveBtnWrapper}>
        <View
          className={classnames(styles.saveBtn, isLoading('profile-save') && styles.saveBtnDisabled)}
          onTap={handleSave}
        >
          <Text className={styles.saveBtnText}>
            {isLoading('profile-save') ? '保存中...' : '保存'}
          </Text>
        </View>
      </View>

      {isLoading('profile-save') && (
        <Loading scene='profile-save' variant='overlay' compact />
      )}
    </>
  );
};

export default ProfileEditPage;

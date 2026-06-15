import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import Loading, { SceneLoading } from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import TagItem from '@/components/TagItem';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { StyleTag } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { mockQuickTags } from '@/data/tags';
import { delay, generateId } from '@/utils';
import styles from './index.module.scss';
import classnames from 'classnames';

const colorOptions = [
  '#FF8FA3', '#A8D8EA', '#FFB8C5', '#D4A373', '#B8C0FF',
  '#C9A7EB', '#ADB5BD', '#90E0EF', '#B5E48C', '#E5989B',
  '#FFD166', '#06D6A0'
];

const styleIcons = ['👗', '👠', '👜', '🧥', '👚', '🎀', '💄', '🌸', '✨', '🌺'];

const TagsPage: React.FC = () => {
  const { withLoading, isLoading } = useGlobalLoading();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const { styleTags, addStyleTag, removeStyleTag } = useAppStore();
  const [loadError, setLoadError] = useState(false);

  const loadTagList = async () => {
    setLoadError(false);
    await delay(500);
  };

  const loadData = async () => {
    console.log('[TagsPage] Loading style tags via global Loading...');
    await withLoading('tag-list', loadTagList).catch((e) => {
      console.error('[TagsPage] Load data error:', e);
      setLoadError(true);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const performCreateTag = async (): Promise<StyleTag> => {
    await delay(600);
    const newTag: StyleTag = {
      id: generateId(),
      name: newTagName.trim(),
      color: selectedColor,
      count: 0,
      icon: styleIcons[Math.floor(Math.random() * styleIcons.length)]
    };
    addStyleTag(newTag);
    return newTag;
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      Taro.showToast({ title: '请输入标签名称', icon: 'none' });
      return;
    }

    try {
      await withLoading('tag-create', performCreateTag);
      setNewTagName('');
      setSelectedColor(colorOptions[0]);
      setShowAddModal(false);
      Taro.showToast({ title: '添加成功！', icon: 'success' });
    } catch (error) {
      console.error('[TagsPage] Create tag failed:', error);
      Taro.showToast({ title: '创建失败，请重试', icon: 'none' });
    }
  };

  const handleRemoveTag = (tag: StyleTag) => {
    Taro.showModal({
      title: '删除标签',
      content: `确定要删除标签"${tag.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          removeStyleTag(tag.id);
          Taro.showToast({ title: '已删除', icon: 'success' });
          console.log('[TagsPage] Removed tag:', tag.id);
        }
      }
    });
  };

  const handleTagClick = (tag: StyleTag) => {
    console.log('[TagsPage] Click tag:', tag.name);
    Taro.showToast({ title: `查看${tag.name}穿搭`, icon: 'none' });
  };

  const handleQuickTagClick = (tag: string) => {
    console.log('[TagsPage] Click quick tag:', tag);
    Taro.showToast({ title: `筛选"${tag}"穿搭`, icon: 'none' });
  };

  return (
    <>
      <ScrollView className={styles.page} scrollY>
        <View className={styles.header}>
          <Text className={styles.pageTitle}>风格标签</Text>
          <Text className={styles.pageSubtitle}>管理你的穿搭风格分类 🏷️</Text>
        </View>

        <View className={styles.section}>
          <View className={styles.quickTags}>
            <Text className={styles.quickTagTitle}>快捷筛选</Text>
            <View className={styles.quickTagList}>
              {mockQuickTags.map((tag) => (
                <View
                  key={tag}
                  className={styles.quickTagItem}
                  onClick={() => handleQuickTagClick(tag)}
                >
                  {tag}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            我的风格
            <Button className={styles.addTagBtn} onClick={() => setShowAddModal(true)}>
              + 新增
            </Button>
          </View>

          <SceneLoading scene='tag-list' variant='default'>
            {loadError ? (
              <EmptyState
                type='network-error'
                onPrimaryButtonClick={loadData}
              />
            ) : styleTags.length === 0 ? (
              <EmptyState
                type='tag-empty'
                onPrimaryButtonClick={() => setShowAddModal(true)}
              />
            ) : (
              <View className={styles.styleCardList}>
                {styleTags.map((tag) => (
                  <View
                    key={tag.id}
                    className={styles.styleCard}
                    onClick={() => handleTagClick(tag)}
                  >
                    <View className={styles.styleColor} style={{ background: tag.color + '30' }}>
                      <Text className={styles.styleIcon}>{tag.icon || '🎨'}</Text>
                    </View>
                    <View className={styles.styleInfo}>
                      <Text className={styles.styleName}>{tag.name}</Text>
                      <Text className={styles.styleCount}>{tag.count} 套穿搭</Text>
                    </View>
                    <Text
                      className={styles.styleArrow}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag);
                      }}
                    >
                      ✕
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </SceneLoading>
        </View>

        {showAddModal && (
          <View className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <Text className={styles.modalTitle}>新增风格标签</Text>

              <View className={styles.inputWrapper}>
                <Text className={styles.inputLabel}>标签名称</Text>
                <Input
                  className={styles.input}
                  placeholder='请输入标签名称'
                  value={newTagName}
                  onInput={(e) => setNewTagName(e.detail.value)}
                  maxlength={10}
                />
              </View>

              <View className={styles.colorPicker}>
                <Text className={styles.colorPickerLabel}>选择颜色</Text>
                <View className={styles.colorOptions}>
                  {colorOptions.map((color) => (
                    <View
                      key={color}
                      className={classnames(
                        styles.colorOption,
                        selectedColor === color && styles.colorOptionActive
                      )}
                      style={{ background: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>

              <View className={styles.modalActions}>
                <Button
                  className={classnames(styles.modalBtn, styles.modalBtnCancel)}
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </Button>
                <Button
                  className={classnames(styles.modalBtn, styles.modalBtnConfirm)}
                  onClick={handleAddTag}
                >
                  {isLoading('tag-create') ? '创建中...' : '确定'}
                </Button>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {isLoading('tag-create') && (
        <Loading
          scene='tag-create'
          variant='overlay'
          compact
        />
      )}
    </>
  );
};

export default TagsPage;

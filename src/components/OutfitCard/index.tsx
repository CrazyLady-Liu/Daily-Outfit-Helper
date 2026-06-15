import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { OutfitRecommend, OutfitPhoto } from '@/types';
import { formatDate } from '@/utils';
import styles from './index.module.scss';

interface OutfitCardProps {
  data: OutfitRecommend | OutfitPhoto;
  type?: 'recommend' | 'photo';
  onClick?: () => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ data, type = 'recommend', onClick }) => {
  const isPhoto = type === 'photo';
  const photoData = data as OutfitPhoto;
  const recommendData = data as OutfitRecommend;

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={data.image}
          mode='aspectFill'
          onError={(e) => console.error('[OutfitCard] Image load error:', e)}
        />
        {!isPhoto && recommendData.temperatureRange && (
          <View className={styles.tempBadge}>🌡️ {recommendData.temperatureRange}</View>
        )}
      </View>

      <View className={styles.content}>
        {!isPhoto ? (
          <>
            <Text className={styles.title}>{recommendData.title}</Text>
            <Text className={styles.description}>{recommendData.description}</Text>
            <View className={styles.tags}>
              <Text className={styles.styleLabel}>{recommendData.style}</Text>
              {recommendData.tags.slice(0, 2).map((tag, index) => (
                <Text key={index} className={styles.tag}>
                  {tag}
                </Text>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text className={styles.description}>{photoData.description}</Text>
            <View className={styles.tags}>
              {photoData.tags.slice(0, 3).map((tag, index) => (
                <Text key={index} className={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
            <View className={styles.photoInfo}>
              <Text className={styles.date}>{formatDate(photoData.date)}</Text>
              <Text className={styles.styleName}>{photoData.style}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default OutfitCard;

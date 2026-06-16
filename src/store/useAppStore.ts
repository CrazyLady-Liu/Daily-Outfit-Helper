import { create } from 'zustand';
import { OutfitPhoto, ScoreRecord, StyleTag, UserInfo } from '@/types';
import { mockOutfitPhotos } from '@/data/outfits';
import { mockScoreRecords as mockScores } from '@/data/scores';
import { mockStyleTags } from '@/data/tags';
import { getAvatarImage } from '@/utils';

interface AppState {
  outfitPhotos: OutfitPhoto[];
  scoreRecords: ScoreRecord[];
  styleTags: StyleTag[];
  userInfo: UserInfo;
  addOutfitPhoto: (photo: OutfitPhoto) => void;
  addScoreRecord: (record: ScoreRecord) => void;
  addStyleTag: (tag: StyleTag) => void;
  removeStyleTag: (id: string) => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  outfitPhotos: mockOutfitPhotos,
  scoreRecords: mockScores,
  styleTags: mockStyleTags,
  userInfo: {
    nickname: '时尚小达人',
    avatar: getAvatarImage(64),
    totalOutfits: mockOutfitPhotos.length,
    totalScores: mockScores.length,
    favoriteStyle: '休闲风'
  },
  addOutfitPhoto: (photo) =>
    set((state) => ({
      outfitPhotos: [photo, ...state.outfitPhotos],
      userInfo: {
        ...state.userInfo,
        totalOutfits: state.userInfo.totalOutfits + 1
      }
    })),
  addScoreRecord: (record) =>
    set((state) => ({
      scoreRecords: [record, ...state.scoreRecords],
      userInfo: {
        ...state.userInfo,
        totalScores: state.userInfo.totalScores + 1
      }
    })),
  addStyleTag: (tag) =>
    set((state) => ({
      styleTags: [...state.styleTags, tag]
    })),
  removeStyleTag: (id) =>
    set((state) => ({
      styleTags: state.styleTags.filter((t) => t.id !== id)
    })),
  updateUserInfo: (info) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...info }
    }))
}));

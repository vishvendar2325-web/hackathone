import { create } from 'zustand';
import { ShortFormPlatform } from '@focusflow/shared-types';

interface ReelsState {
  todayEstimatedReels: number;
  todayReelsMinutes: number;
  dailyQuotaMinutes: number;
  platformBreakdown: Record<ShortFormPlatform, number>;
  incrementReel: (platform: ShortFormPlatform) => void;
  resetDay: () => void;
}

export const useReelsStore = create<ReelsState>((set) => ({
  todayEstimatedReels: 28,
  todayReelsMinutes: 24,
  dailyQuotaMinutes: 30,
  platformBreakdown: {
    INSTAGRAM_REELS: 18,
    YOUTUBE_SHORTS: 8,
    FACEBOOK_REELS: 2,
    TIKTOK: 0,
  },
  incrementReel: (platform) =>
    set((state) => ({
      todayEstimatedReels: state.todayEstimatedReels + 1,
      todayReelsMinutes: state.todayReelsMinutes + 1,
      platformBreakdown: {
        ...state.platformBreakdown,
        [platform]: (state.platformBreakdown[platform] || 0) + 1,
      },
    })),
  resetDay: () =>
    set({
      todayEstimatedReels: 0,
      todayReelsMinutes: 0,
      platformBreakdown: {
        INSTAGRAM_REELS: 0,
        YOUTUBE_SHORTS: 0,
        FACEBOOK_REELS: 0,
        TIKTOK: 0,
      },
    }),
}));

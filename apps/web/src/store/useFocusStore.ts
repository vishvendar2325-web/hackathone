import { create } from 'zustand';
import { FocusSessionMode, FocusSessionStatus } from '@focusflow/shared-types';

interface FocusState {
  mode: FocusSessionMode;
  status: FocusSessionStatus;
  targetMinutes: number;
  secondsRemaining: number;
  isActive: boolean;
  setMode: (mode: FocusSessionMode) => void;
  startSession: (minutes?: number) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  resetSession: () => void;
  tick: () => void;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  mode: 'POMODORO',
  status: 'COMPLETED',
  targetMinutes: 25,
  secondsRemaining: 25 * 60,
  isActive: false,
  setMode: (mode) => {
    const mins = mode === 'POMODORO' ? 25 : mode === 'DEEP_WORK' ? 50 : mode === 'QUICK_SPRINT' ? 15 : 90;
    set({ mode, targetMinutes: mins, secondsRemaining: mins * 60, isActive: false, status: 'COMPLETED' });
  },
  startSession: (minutes) => {
    const target = minutes || get().targetMinutes;
    set({ targetMinutes: target, secondsRemaining: target * 60, isActive: true, status: 'ACTIVE' });
  },
  pauseSession: () => set({ isActive: false, status: 'PAUSED' }),
  resumeSession: () => set({ isActive: true, status: 'ACTIVE' }),
  resetSession: () => set({ secondsRemaining: get().targetMinutes * 60, isActive: false, status: 'COMPLETED' }),
  tick: () => {
    const { secondsRemaining, isActive } = get();
    if (isActive && secondsRemaining > 0) {
      set({ secondsRemaining: secondsRemaining - 1 });
    } else if (secondsRemaining === 0 && isActive) {
      set({ isActive: false, status: 'COMPLETED' });
    }
  },
}));

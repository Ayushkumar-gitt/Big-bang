import { create } from 'zustand';

interface AppState {
  currentEra: number;
  setCurrentEra: (era: number) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  currentEra: 0,
  setCurrentEra: (era) => set({ currentEra: era }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  isAudioPlaying: false,
  setIsAudioPlaying: (playing) => set({ isAudioPlaying: playing }),
}));

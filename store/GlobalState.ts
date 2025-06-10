import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  minimumStudyHours: number,
  setMinimumStudyHours: (by: number) => void,
}

export const useStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        minimumStudyHours: 3,
        setMinimumStudyHours: (by) => set((state) => ({ minimumStudyHours: by })),
      }),
      {
        name: "global-state-storage",
      }
    )
  )
);

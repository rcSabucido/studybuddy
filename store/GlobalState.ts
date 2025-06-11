import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  minimumStudyHours: number,
  setMinimumStudyHours: (by: number) => void,
  fetchTaskId: number,
  setFetchTaskId: (by: number) => void,
}

export const useStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        minimumStudyHours: 1,
        setMinimumStudyHours: (by) => set((state) => ({ minimumStudyHours: by })),
        fetchTaskId: 0,
        setFetchTaskId: (by) => set((state) => ({ fetchTaskId: by })),
      }),
      {
        name: "studybuddy-global-state-storage",
      }
    )
  )
);

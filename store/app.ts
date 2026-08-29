import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage, STORAGE_KEYS } from '@/services/storage';

interface AppState {
  onboarded: boolean;
  hydrated: boolean;
  completeOnboarding: () => void;
  markHydrated: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      hydrated: false,
      completeOnboarding: () => set({ onboarded: true }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.app,
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({ onboarded: state.onboarded }) as unknown as AppState,
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

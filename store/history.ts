import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage, STORAGE_KEYS } from '@/services/storage';
import type { Calculation } from '@/types';

/** Evita que o histórico cresça sem limite num dispositivo modesto. */
const MAX_ENTRIES = 200;

interface HistoryState {
  items: Calculation[];
  hydrated: boolean;
  add: (calculation: Calculation) => void;
  remove: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clear: () => void;
  markHydrated: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      add: (calculation) =>
        set((state) => ({ items: [calculation, ...state.items].slice(0, MAX_ENTRIES) })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      toggleFavorite: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, favorite: !item.favorite } : item
          ),
        })),
      clear: () => set({ items: [] }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.history,
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({ items: state.items }) as unknown as HistoryState,
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

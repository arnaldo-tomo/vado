import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_SETTINGS, LIMITS } from '@/constants/defaults';
import { asyncStorage, STORAGE_KEYS } from '@/services/storage';
import type { Settings } from '@/types';

interface SettingsState extends Settings {
  hydrated: boolean;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
  markHydrated: () => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function extractSettings(state: Settings): Settings {
  return {
    freightRate: state.freightRate,
    cifDivisor: state.cifDivisor,
    currency: state.currency,
    themeMode: state.themeMode,
    decimals: state.decimals,
    showQuickAmounts: state.showQuickAmounts,
  };
}

/** Mantém as definições dentro de limites utilizáveis, venham elas do disco ou do ecrã. */
function sanitize(settings: Settings): Settings {
  return {
    ...settings,
    freightRate: clamp(settings.freightRate, LIMITS.freightRate.min, LIMITS.freightRate.max),
    cifDivisor: clamp(settings.cifDivisor, LIMITS.cifDivisor.min, LIMITS.cifDivisor.max),
    decimals: Math.round(clamp(settings.decimals, LIMITS.decimals.min, LIMITS.decimals.max)),
  };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,
      hydrated: false,
      update: (key, value) => set(sanitize({ ...extractSettings(get()), [key]: value })),
      reset: () => set({ ...DEFAULT_SETTINGS }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => extractSettings(state) as unknown as SettingsState,
      merge: (persisted, current) => ({
        ...current,
        ...sanitize({ ...DEFAULT_SETTINGS, ...(persisted as Partial<Settings>) }),
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

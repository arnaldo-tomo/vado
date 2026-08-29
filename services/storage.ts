import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const STORAGE_KEYS = {
  settings: 'vado.settings.v1',
  history: 'vado.history.v1',
  app: 'vado.app.v1',
} as const;

/**
 * Adaptador para o middleware `persist`. Falhas de escrita não devem
 * derrubar a aplicação — o cálculo continua a funcionar sem persistência.
 */
export const asyncStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // silencioso: armazenamento indisponível
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // silencioso
    }
  },
};

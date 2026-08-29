import { useCallback } from 'react';
import { Share } from 'react-native';

import { useSettingsStore } from '@/store/settings';
import type { Calculation } from '@/types';
import { buildShareMessage } from '@/utils/share';

import { useHaptics } from './use-haptics';

export function useShareCalculation() {
  const decimals = useSettingsStore((state) => state.decimals);
  const haptic = useHaptics();

  return useCallback(
    async (calculation: Calculation) => {
      haptic('light');
      try {
        await Share.share({ message: buildShareMessage(calculation, decimals) });
      } catch {
        // o utilizador cancelou ou não existe app de partilha — sem ruído
      }
    },
    [decimals, haptic]
  );
}

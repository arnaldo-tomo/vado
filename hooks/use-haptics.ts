import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

type Feedback = 'light' | 'medium' | 'success' | 'warning';

/** Feedback táctil discreto; nunca deve interromper a acção se falhar. */
export function useHaptics() {
  return useCallback((type: Feedback = 'light') => {
    const run =
      type === 'success'
        ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        : type === 'warning'
          ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          : Haptics.impactAsync(
              type === 'medium'
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light
            );
    run.catch(() => undefined);
  }, []);
}

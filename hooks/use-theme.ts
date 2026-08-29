import { useColorScheme } from 'react-native';

import { colors, type ColorScheme } from '@/constants/theme';
import { useSettingsStore } from '@/store/settings';

export interface Theme {
  colors: ColorScheme;
  scheme: 'light' | 'dark';
  isDark: boolean;
}

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);

  const scheme: 'light' | 'dark' =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;
  return { colors: colors[scheme], scheme, isDark: scheme === 'dark' };
}

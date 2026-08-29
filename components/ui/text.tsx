import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

import { tabularNumbers, typography, type TypographyVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'default' | 'secondary' | 'accent' | 'inverse' | 'error' | 'success';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  tone?: Tone;
  tabular?: boolean;
}

export function Text({
  variant = 'body',
  tone = 'default',
  tabular = false,
  style,
  ...rest
}: TextProps) {
  const { colors } = useTheme();

  const toneColor = {
    default: colors.text,
    secondary: colors.textSecondary,
    accent: colors.accent,
    inverse: colors.onPrimary,
    error: colors.error,
    success: colors.success,
  }[tone];

  return (
    <RNText
      style={StyleSheet.flatten([
        typography[variant],
        { color: toneColor },
        tabular && tabularNumbers,
        style,
      ])}
      {...rest}
    />
  );
}

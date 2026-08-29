import { View, StyleSheet, type ViewProps } from 'react-native';

import { radius, shadows, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface CardProps extends ViewProps {
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ padded = true, elevated = false, style, ...rest }: CardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={StyleSheet.flatten([
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        padded && styles.padded,
        elevated && !isDark && shadows.card,
        style,
      ])}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    // Mantém o destaque de toque das linhas dentro dos cantos arredondados.
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.lg,
  },
});

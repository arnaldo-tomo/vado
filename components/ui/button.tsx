import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { fonts, radius, spacing, typography } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';

import { Text } from './text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  onPress,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const haptic = useHaptics();

  const surface = {
    primary: isDark ? colors.accent : colors.primary,
    secondary: 'transparent',
    ghost: 'transparent',
    danger: colors.errorSoft,
  }[variant];

  const labelColor = {
    primary: isDark ? colors.onAccent : colors.onPrimary,
    secondary: colors.text,
    ghost: colors.accent,
    danger: colors.error,
  }[variant];

  const borderColor = variant === 'secondary' ? colors.border : 'transparent';
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={(event) => {
        haptic('light');
        onPress?.(event);
      }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sizeSm : styles.sizeMd,
        {
          backgroundColor: surface,
          borderColor,
          borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              size === 'sm' ? typography.smallMedium : typography.bodyMedium,
              styles.label,
              { color: labelColor },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  sizeMd: { height: 52 },
  sizeSm: { height: 40, paddingHorizontal: spacing.md },
  fullWidth: { alignSelf: 'stretch' },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.semibold,
  },
});

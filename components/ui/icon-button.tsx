import { Pressable, StyleSheet } from 'react-native';

import { hitSlop, radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'plain' | 'soft';
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
}: IconButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'soft' && { backgroundColor: colors.surfaceMuted },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
});

import { RotateCcw } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import type { Calculation } from '@/types';
import { formatMoney, formatTimestamp } from '@/utils/format';

import { Text } from '../ui/text';

interface LastCalculationProps {
  calculation: Calculation;
  decimals: number;
  onReuse: () => void;
}

export function LastCalculation({ calculation, decimals, onReuse }: LastCalculationProps) {
  const { colors } = useTheme();
  const haptic = useHaptics();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Usar novamente ${formatMoney(calculation.invoice, calculation.currency, decimals)}`}
      onPress={() => {
        haptic('light');
        onReuse();
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.text}>
        <Text variant="caption" tone="secondary">
          ÚLTIMO CÁLCULO • {formatTimestamp(calculation.createdAt).toUpperCase()}
        </Text>
        <Text variant="bodyMedium" tabular style={styles.value}>
          {formatMoney(calculation.invoice, calculation.currency, decimals)}
        </Text>
      </View>
      <View style={[styles.action, { backgroundColor: colors.accentSoft }]}>
        <RotateCcw size={14} color={colors.accent} strokeWidth={2} />
        <Text variant="caption" tone="accent">
          Usar novamente
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: { flex: 1 },
  value: { marginTop: 2 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
});

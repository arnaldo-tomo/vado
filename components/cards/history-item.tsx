import { Bookmark } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import type { Calculation } from '@/types';
import { formatAmount, formatMoney, formatTimestamp } from '@/utils/format';

import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';

interface HistoryItemProps {
  calculation: Calculation;
  decimals: number;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function HistoryItem({
  calculation,
  decimals,
  onPress,
  onToggleFavorite,
}: HistoryItemProps) {
  const { colors } = useTheme();
  const haptic = useHaptics();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cálculo de ${formatMoney(calculation.invoice, calculation.currency, decimals)}`}
      accessibilityHint="Abre os detalhes deste cálculo"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text variant="bodyMedium" tabular>
            {formatMoney(calculation.invoice, calculation.currency, decimals)}
          </Text>
          <Text variant="caption" tone="secondary" style={styles.timestamp}>
            {formatTimestamp(calculation.createdAt)}
          </Text>
        </View>
        <IconButton
          icon={
            <Bookmark
              size={18}
              color={calculation.favorite ? colors.accent : colors.textSecondary}
              fill={calculation.favorite ? colors.accent : 'transparent'}
              strokeWidth={1.75}
            />
          }
          onPress={() => {
            haptic('light');
            onToggleFavorite();
          }}
          accessibilityLabel={
            calculation.favorite ? 'Remover dos favoritos' : 'Guardar nos favoritos'
          }
        />
      </View>

      <View style={[styles.values, { borderTopColor: colors.border }]}>
        <ValueCell label="CIF" value={formatAmount(calculation.cif, decimals)} />
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
        <ValueCell label="CFR" value={formatAmount(calculation.cfr, decimals)} />
      </View>
    </Pressable>
  );
}

function ValueCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text variant="caption" tone="secondary">
        {label}
      </Text>
      <Text variant="smallMedium" tabular style={styles.cellValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headText: { flex: 1 },
  timestamp: { marginTop: 2 },
  values: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  cell: { flex: 1 },
  cellValue: { marginTop: 2 },
  separator: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.lg,
  },
});

import { ScrollView, StyleSheet } from 'react-native';

import { QUICK_AMOUNTS } from '@/constants/defaults';
import { spacing } from '@/constants/theme';
import { formatAmount } from '@/utils/format';

import { Chip } from '../ui/chip';

interface QuickAmountsProps {
  onSelect: (amount: number) => void;
}

export function QuickAmounts({ onSelect }: QuickAmountsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {QUICK_AMOUNTS.map((amount) => (
        <Chip
          key={amount}
          label={formatAmount(amount, 0)}
          onPress={() => onSelect(amount)}
          accessibilityLabel={`Usar ${formatAmount(amount, 0)}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },
});

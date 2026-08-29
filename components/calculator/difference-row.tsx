import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from '../ui/text';

interface DifferenceRowProps {
  value: string;
  insight: string;
}

export function DifferenceRow({ value, insight }: DifferenceRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: colors.surfaceMuted }]}>
      <View style={styles.head}>
        <Text variant="smallMedium" tone="secondary">
          Diferença
        </Text>
        <Text variant="smallMedium" tabular>
          {value}
        </Text>
      </View>
      <Text variant="caption" tone="secondary" style={styles.insight}>
        {insight}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  insight: { marginTop: spacing.xs, lineHeight: 18 },
});

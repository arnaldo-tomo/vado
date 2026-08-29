import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Text } from '../ui/text';

interface DetailRowProps {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
}

export function DetailRow({ label, value, hint, strong = false }: DetailRowProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.labels}>
        <Text variant={strong ? 'bodyMedium' : 'body'} tone={strong ? 'default' : 'secondary'}>
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" tone="secondary" style={styles.hint} tabular>
            {hint}
          </Text>
        ) : null}
      </View>
      <Text variant={strong ? 'bodyMedium' : 'body'} tabular style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  labels: { flex: 1 },
  hint: { marginTop: 2 },
  value: { textAlign: 'right' },
});

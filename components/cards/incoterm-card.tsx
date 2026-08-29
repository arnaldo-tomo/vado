import { Check, Minus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Incoterm } from '@/constants/incoterms';

import { Text } from '../ui/text';

export function IncotermCard({ incoterm }: { incoterm: Incoterm }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="h2">{incoterm.code}</Text>
      <Text variant="small" tone="accent" style={styles.fullName}>
        {incoterm.fullName}
      </Text>
      <Text variant="small" tone="secondary" style={styles.description}>
        {incoterm.description}
      </Text>

      <View style={[styles.coverage, { borderTopColor: colors.border }]}>
        {incoterm.coverage.map((item) => (
          <View key={item.label} style={styles.coverageRow}>
            <View
              style={[
                styles.marker,
                { backgroundColor: item.included ? colors.accentSoft : colors.surfaceMuted },
              ]}
            >
              {item.included ? (
                <Check size={13} color={colors.accent} strokeWidth={2.5} />
              ) : (
                <Minus size={13} color={colors.textSecondary} strokeWidth={2.5} />
              )}
            </View>
            <Text
              variant="small"
              tone={item.included ? 'default' : 'secondary'}
              style={styles.coverageLabel}
            >
              {item.label}
            </Text>
            <Text variant="caption" tone={item.included ? 'accent' : 'secondary'}>
              {item.included ? 'Incluído' : 'Não incluído'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  fullName: { marginTop: 2 },
  description: { marginTop: spacing.md, lineHeight: 21 },
  coverage: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  coverageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  marker: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageLabel: { flex: 1 },
});

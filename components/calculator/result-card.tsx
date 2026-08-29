import { Copy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';

interface ResultCardProps {
  code: string;
  fullName: string;
  value: string;
  note: string;
  emphasis?: boolean;
  onCopy?: () => void;
}

export function ResultCard({
  code,
  fullName,
  value,
  note,
  emphasis = false,
  onCopy,
}: ResultCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: emphasis ? colors.accent : colors.border,
          borderWidth: emphasis ? 1 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.head}>
        <View style={styles.titles}>
          <View style={styles.codeRow}>
            <Text variant="h2">{code}</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: emphasis ? colors.accentSoft : colors.surfaceMuted },
              ]}
            >
              <Text variant="caption" tone={emphasis ? 'accent' : 'secondary'}>
                {emphasis ? 'Com seguro' : 'Sem seguro'}
              </Text>
            </View>
          </View>
          <Text variant="small" tone="secondary" style={styles.fullName}>
            {fullName}
          </Text>
        </View>
        {onCopy ? (
          <IconButton
            icon={<Copy size={18} color={colors.textSecondary} strokeWidth={1.75} />}
            onPress={onCopy}
            accessibilityLabel={`Copiar valor ${code}`}
          />
        ) : null}
      </View>

      <Text
        variant="amountLarge"
        tabular
        style={styles.value}
        accessibilityLabel={`${code}: ${value}`}
      >
        {value}
      </Text>
      <Text variant="caption" tone="secondary">
        {note}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  titles: { flex: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  fullName: { marginTop: 2 },
  value: { marginTop: spacing.md, marginBottom: spacing.xs },
});

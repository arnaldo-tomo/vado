import { X } from 'lucide-react-native';
import { StyleSheet, TextInput, View } from 'react-native';

import { fonts, radius, spacing, tabularNumbers } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CurrencyCode } from '@/types';

import { IconButton } from '../ui/icon-button';
import { Text } from '../ui/text';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  currency: CurrencyCode;
  decimals: number;
}

export function AmountInput({
  value,
  onChangeText,
  onClear,
  currency,
  decimals,
}: AmountInputProps) {
  const { colors } = useTheme();
  const placeholder = decimals > 0 ? `0${','}${'0'.repeat(decimals)}` : '0';

  return (
    <View style={[styles.field, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.labelRow}>
        <Text variant="caption" tone="secondary" style={styles.label}>
          VALOR DA FACTURA
        </Text>
        {value ? (
          <IconButton
            icon={<X size={16} color={colors.textSecondary} strokeWidth={2} />}
            onPress={onClear}
            accessibilityLabel="Limpar valor"
          />
        ) : null}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          inputMode="decimal"
          placeholder={placeholder}
          placeholderTextColor={colors.border}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          maxLength={22}
          accessible
          accessibilityLabel="Valor da factura"
          style={[styles.input, tabularNumbers, { color: colors.text }]}
        />
        <View style={[styles.currency, { backgroundColor: colors.surfaceMuted }]}>
          <Text variant="smallMedium" tone="secondary">
            {currency}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },
  label: { letterSpacing: 0.6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 34,
    lineHeight: 44,
    paddingVertical: 0,
    // O padding vertical zero mantém o campo alinhado com o selo da moeda.
    includeFontPadding: false,
  },
  currency: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
});

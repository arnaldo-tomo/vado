import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { fonts, radius, spacing, tabularNumbers } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { parseDecimalInput } from '@/utils/format';

import { Text } from './text';

interface SettingFieldProps {
  label: string;
  description?: string;
  value: number;
  suffix?: string;
  min: number;
  max: number;
  format: (value: number) => string;
  onCommit: (value: number) => void;
}

/**
 * Campo numérico que só aplica o valor quando é válido — evita estados
 * intermédios inconsistentes enquanto o utilizador escreve.
 */
export function SettingField({
  label,
  description,
  value,
  suffix,
  min,
  max,
  format,
  onCommit,
}: SettingFieldProps) {
  const { colors } = useTheme();
  // `draft` só existe enquanto o campo está a ser editado; fora disso o valor
  // apresentado deriva directamente das definições, sem sincronizações.
  const [draft, setDraft] = useState<string | null>(null);
  const focused = draft !== null;

  const commit = () => {
    const parsed = draft === null ? null : parseDecimalInput(draft);
    setDraft(null);
    if (parsed === null || parsed < min || parsed > max) return;
    onCommit(parsed);
  };

  return (
    <View style={styles.row}>
      <View style={styles.labels}>
        <Text variant="bodyMedium">{label}</Text>
        {description ? (
          <Text variant="caption" tone="secondary" style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surfaceMuted,
            borderColor: focused ? colors.accent : 'transparent',
          },
        ]}
      >
        <TextInput
          value={draft ?? format(value)}
          onChangeText={setDraft}
          onFocus={() => setDraft(format(value))}
          onBlur={commit}
          onSubmitEditing={commit}
          keyboardType="decimal-pad"
          inputMode="decimal"
          returnKeyType="done"
          maxLength={8}
          selectionColor={colors.accent}
          cursorColor={colors.accent}
          accessible
          accessibilityLabel={label}
          style={[styles.input, tabularNumbers, { color: colors.text }]}
        />
        {suffix ? (
          <Text variant="smallMedium" tone="secondary">
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 64,
  },
  labels: { flex: 1 },
  description: { marginTop: 2, lineHeight: 16 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 96,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 16,
    textAlign: 'right',
    padding: 0,
    includeFontPadding: false,
  },
});

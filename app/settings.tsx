import { RotateCcw } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Section } from '@/components/layout/section';
import { StackHeader } from '@/components/layout/stack-header';
import {
  Card,
  Chip,
  ConfirmDialog,
  Divider,
  ListRow,
  Screen,
  SegmentedControl,
  SettingField,
  useToast,
} from '@/components/ui';
import { CURRENCIES, currencyLabel } from '@/constants/currencies';
import { DEFAULT_SETTINGS, LIMITS } from '@/constants/defaults';
import { spacing } from '@/constants/theme';
import { useHaptics } from '@/hooks/use-haptics';
import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings';
import type { ThemeMode } from '@/types';
import { formatDivisor, formatRate } from '@/utils/format';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

const DECIMAL_OPTIONS = ['0', '1', '2', '3', '4'].map((value) => ({ value, label: value }));

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const toast = useToast();
  const haptic = useHaptics();

  const freightRate = useSettingsStore((state) => state.freightRate);
  const cifDivisor = useSettingsStore((state) => state.cifDivisor);
  const currency = useSettingsStore((state) => state.currency);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const decimals = useSettingsStore((state) => state.decimals);
  const showQuickAmounts = useSettingsStore((state) => state.showQuickAmounts);
  const update = useSettingsStore((state) => state.update);
  const reset = useSettingsStore((state) => state.reset);

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = useCallback(() => {
    reset();
    setConfirmReset(false);
    haptic('success');
    toast.show('Valores padrão repostos');
  }, [reset, haptic, toast]);

  return (
    <Screen>
      <StackHeader title="Definições" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <Section title="Cálculo">
          <Card padded={false}>
            <SettingField
              label="Taxa de frete"
              description="Esta taxa será usada no cálculo do CFR."
              value={freightRate}
              suffix="%"
              min={LIMITS.freightRate.min}
              max={LIMITS.freightRate.max}
              format={(value) => String(value).replace('.', ',')}
              onCommit={(value) => update('freightRate', value)}
            />
            <Divider inset={spacing.lg} />
            <SettingField
              label="Divisor CIF"
              description="Altere apenas se souber exactamente o valor que deve utilizar."
              value={cifDivisor}
              min={LIMITS.cifDivisor.min}
              max={LIMITS.cifDivisor.max}
              format={formatDivisor}
              onCommit={(value) => update('cifDivisor', value)}
            />
          </Card>
        </Section>

        <Section
          title="Moeda"
          footnote={`Os valores passam a ser apresentados em ${currency} — ${currencyLabel(currency)}.`}
        >
          {/* Chips com quebra de linha: seis códigos não cabem lado a lado. */}
          <View style={styles.currencies} accessibilityRole="radiogroup">
            {CURRENCIES.map(({ code, label }) => (
              <Chip
                key={code}
                label={code}
                selected={code === currency}
                onPress={() => update('currency', code)}
                accessibilityLabel={`${label} (${code})`}
              />
            ))}
          </View>
        </Section>

        <Section title="Aparência">
          <SegmentedControl
            options={THEME_OPTIONS}
            value={themeMode}
            onChange={(value) => update('themeMode', value)}
            accessibilityLabel="Tema"
          />
        </Section>

        <Section
          title="Apresentação"
          footnote={`Exemplo: taxa de frete apresentada como ${formatRate(freightRate)}.`}
        >
          <Card padded={false}>
            <View style={styles.decimals}>
              <ListRow title="Casas decimais" description="Aplicado a todos os valores." />
              <View style={styles.decimalsControl}>
                <SegmentedControl
                  options={DECIMAL_OPTIONS}
                  value={String(decimals)}
                  onChange={(value) => update('decimals', Number(value))}
                  accessibilityLabel="Casas decimais"
                />
              </View>
            </View>
            <Divider inset={spacing.lg} />
            <ListRow
              title="Valores rápidos"
              description="Sugestões por baixo do campo da factura."
              accessory={
                <Switch
                  value={showQuickAmounts}
                  onValueChange={(value) => update('showQuickAmounts', value)}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                  accessibilityLabel="Mostrar valores rápidos"
                />
              }
            />
          </Card>
        </Section>

        <Section>
          <Card padded={false}>
            <ListRow
              icon={<RotateCcw size={20} color={colors.error} strokeWidth={1.75} />}
              title="Repor valores padrão"
              description="Taxa de frete, divisor, moeda e tema"
              onPress={() => setConfirmReset(true)}
              destructive
            />
          </Card>
        </Section>
      </ScrollView>

      <ConfirmDialog
        visible={confirmReset}
        title="Repor valores padrão"
        message={`A taxa de frete volta a ${formatRate(DEFAULT_SETTINGS.freightRate)}, o divisor a ${formatDivisor(DEFAULT_SETTINGS.cifDivisor)}, a moeda a ${DEFAULT_SETTINGS.currency} e o tema ao do sistema.`}
        confirmLabel="Repor"
        destructive
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg },
  currencies: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  decimals: { paddingBottom: spacing.lg },
  decimalsControl: { paddingHorizontal: spacing.lg },
});

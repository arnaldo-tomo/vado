import * as Clipboard from 'expo-clipboard';
import { Redirect, useRouter } from 'expo-router';
import { ListTree, Save, Share2 } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmountInput } from '@/components/calculator/amount-input';
import { DetailsSheet } from '@/components/calculator/details-sheet';
import { DifferenceRow } from '@/components/calculator/difference-row';
import { LastCalculation } from '@/components/calculator/last-calculation';
import { QuickAmounts } from '@/components/calculator/quick-amounts';
import { ResultCard } from '@/components/calculator/result-card';
import { BrandHeader } from '@/components/layout/brand-header';
import { Button, Screen, useToast } from '@/components/ui';
import { getIncoterm } from '@/constants/incoterms';
import { spacing } from '@/constants/theme';
import { useCalculation } from '@/hooks/use-calculation';
import { useHaptics } from '@/hooks/use-haptics';
import { useShareCalculation } from '@/hooks/use-share-calculation';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app';
import { useCalculatorStore } from '@/store/calculator';
import { useHistoryStore } from '@/store/history';
import { useSettingsStore } from '@/store/settings';
import type { Calculation } from '@/types';
import {
  formatAmount,
  formatAmountInput,
  formatMoney,
  formatRate,
  formatSignedMoney,
  parseAmount,
  sanitizeAmountInput,
} from '@/utils/format';
import { createId } from '@/utils/id';

const CIF = getIncoterm('CIF');
const CFR = getIncoterm('CFR');
const PLACEHOLDER = '—';

export default function CalculatorScreen() {
  const onboarded = useAppStore((state) => state.onboarded);
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Calculator />;
}

function Calculator() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const haptic = useHaptics();
  const share = useShareCalculation();

  const { colors, isDark } = useTheme();

  const freightRate = useSettingsStore((state) => state.freightRate);
  const cifDivisor = useSettingsStore((state) => state.cifDivisor);
  const currency = useSettingsStore((state) => state.currency);
  const decimals = useSettingsStore((state) => state.decimals);
  const showQuickAmounts = useSettingsStore((state) => state.showQuickAmounts);
  const raw = useCalculatorStore((state) => state.raw);
  const savedId = useCalculatorStore((state) => state.savedId);
  const setRaw = useCalculatorStore((state) => state.setRaw);
  const markSaved = useCalculatorStore((state) => state.markSaved);
  const addToHistory = useHistoryStore((state) => state.add);
  const lastCalculation = useHistoryStore((state) => state.items[0]);
  const savedEntry = useHistoryStore((state) =>
    savedId ? state.items.find((item) => item.id === savedId) : undefined
  );

  const [detailsOpen, setDetailsOpen] = useState(false);

  const invoice = useMemo(() => parseAmount(raw), [raw]);
  const result = useCalculation(invoice, cifDivisor, freightRate, decimals);

  const calculation: Calculation | null = useMemo(() => {
    if (!result) return null;
    return {
      ...result,
      id: savedId ?? 'draft',
      freightRate,
      cifDivisor,
      currency,
      createdAt: 0,
      favorite: false,
    };
  }, [result, savedId, freightRate, cifDivisor, currency]);

  const handleChange = useCallback(
    (text: string) => setRaw(formatAmountInput(sanitizeAmountInput(text, decimals))),
    [decimals, setRaw]
  );

  const handleClear = useCallback(() => {
    haptic('light');
    setRaw('');
  }, [haptic, setRaw]);

  const handleQuickAmount = useCallback(
    (amount: number) => setRaw(formatAmount(amount, 0)),
    [setRaw]
  );

  const handleCopy = useCallback(
    async (label: string, value: number) => {
      haptic('light');
      await Clipboard.setStringAsync(formatMoney(value, currency, decimals));
      toast.show(`${label} copiado`);
    },
    [currency, decimals, haptic, toast]
  );

  // Alterar a taxa, o divisor ou a moeda depois de guardar produz outro
  // resultado — o botão tem de voltar a ficar disponível.
  const isSaved =
    !!savedEntry &&
    !!result &&
    savedEntry.invoice === result.invoice &&
    savedEntry.cif === result.cif &&
    savedEntry.cfr === result.cfr &&
    savedEntry.currency === currency;

  const handleSave = useCallback(() => {
    if (!calculation || isSaved) return;
    const id = createId();
    addToHistory({ ...calculation, id, createdAt: Date.now() });
    markSaved(id);
    haptic('success');
    toast.show('Cálculo guardado');
  }, [calculation, isSaved, addToHistory, markSaved, haptic, toast]);

  const handleReuse = useCallback(() => {
    if (!lastCalculation) return;
    setRaw(formatAmount(lastCalculation.invoice, decimals));
  }, [lastCalculation, decimals, setRaw]);

  const money = useCallback(
    (value: number | undefined) =>
      value === undefined ? PLACEHOLDER : formatMoney(value, currency, decimals),
    [currency, decimals]
  );

  return (
    <Screen>
      <BrandHeader greeting="Olá, Rivaldo" subtitle="Calcula rapidamente CIF e CFR." />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <View style={styles.block}>
          <AmountInput
            value={raw}
            onChangeText={handleChange}
            onClear={handleClear}
            currency={currency}
            decimals={decimals}
          />
        </View>

        {showQuickAmounts ? (
          <View style={styles.quick}>
            <QuickAmounts onSelect={handleQuickAmount} />
          </View>
        ) : null}

        <View style={[styles.block, styles.results]}>
          <ResultCard
            code={CIF.code}
            fullName={CIF.fullName}
            value={money(result?.cif)}
            note={CIF.shortNote}
            emphasis
            onCopy={result ? () => handleCopy('CIF', result.cif) : undefined}
          />
          <ResultCard
            code={CFR.code}
            fullName={CFR.fullName}
            value={money(result?.cfr)}
            note={CFR.shortNote}
            onCopy={result ? () => handleCopy('CFR', result.cfr) : undefined}
          />
        </View>

        {result ? (
          <View style={styles.block}>
            <DifferenceRow
              value={formatSignedMoney(result.difference, currency, decimals)}
              insight={`Com uma taxa de ${formatRate(freightRate)}, o frete representa ${formatMoney(result.freight, currency, decimals)} deste cálculo.`}
            />
          </View>
        ) : null}

        {result ? (
          <View style={[styles.block, styles.actions]}>
            <Button
              label={isSaved ? 'Guardado no histórico' : 'Guardar no histórico'}
              icon={
                <Save
                  size={18}
                  color={isDark ? colors.onAccent : colors.onPrimary}
                  strokeWidth={1.9}
                />
              }
              onPress={handleSave}
              disabled={isSaved}
              fullWidth
            />
            <View style={styles.actionRow}>
              <Button
                label="Ver detalhes"
                variant="secondary"
                icon={<ListTree size={18} color={colors.textSecondary} strokeWidth={1.9} />}
                onPress={() => setDetailsOpen(true)}
                style={styles.action}
              />
              <Button
                label="Partilhar"
                variant="secondary"
                icon={<Share2 size={18} color={colors.textSecondary} strokeWidth={1.9} />}
                onPress={() => calculation && share(calculation)}
                style={styles.action}
              />
            </View>
          </View>
        ) : lastCalculation ? (
          <View style={styles.block}>
            <LastCalculation
              calculation={lastCalculation}
              decimals={decimals}
              onReuse={handleReuse}
            />
          </View>
        ) : null}
      </ScrollView>

      <DetailsSheet
        visible={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        calculation={calculation}
        decimals={decimals}
        footer={
          <Button
            label="Ver Incoterms"
            variant="secondary"
            fullWidth
            onPress={() => {
              setDetailsOpen(false);
              router.navigate('/incoterms');
            }}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.xs },
  block: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  quick: { marginBottom: spacing.lg },
  results: { gap: spacing.md },
  actions: { gap: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1 },
});

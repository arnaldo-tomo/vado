import { StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Calculation } from '@/types';
import { formatDivisor, formatMoney, formatRate } from '@/utils/format';

import { BottomSheet } from '../ui/bottom-sheet';
import { Text } from '../ui/text';

import { DetailRow } from './detail-row';

interface DetailsSheetProps {
  visible: boolean;
  onClose: () => void;
  calculation: Calculation | null;
  decimals: number;
  footer?: React.ReactNode;
}

export function DetailsSheet({
  visible,
  onClose,
  calculation,
  decimals,
  footer,
}: DetailsSheetProps) {
  const { colors } = useTheme();
  if (!calculation) return null;

  const { currency } = calculation;
  const money = (value: number) => formatMoney(value, currency, decimals);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Detalhes do cálculo"
      subtitle="Como se chegou a cada valor."
    >
      <DetailRow label="Valor da factura" value={money(calculation.invoice)} strong />
      <DetailRow
        label="CIF"
        hint={`Factura ÷ ${formatDivisor(calculation.cifDivisor)}`}
        value={money(calculation.cif)}
      />
      <DetailRow label="Taxa de frete" value={formatRate(calculation.freightRate)} />
      <DetailRow
        label="Frete"
        hint={`Factura × ${formatRate(calculation.freightRate)}`}
        value={money(calculation.freight)}
      />
      <DetailRow
        label="Factura + frete"
        value={money(calculation.invoice + calculation.freight)}
      />
      <DetailRow
        label="CFR"
        hint={`(Factura + Frete) ÷ ${formatDivisor(calculation.cifDivisor)}`}
        value={money(calculation.cfr)}
        strong
      />

      <View style={[styles.formulas, { backgroundColor: colors.surfaceMuted }]}>
        <Text variant="caption" tone="secondary" style={styles.formulaTitle}>
          FÓRMULAS
        </Text>
        <Text variant="small" tabular>
          CIF = Factura ÷ {formatDivisor(calculation.cifDivisor)}
        </Text>
        <Text variant="small" tabular style={styles.formula}>
          Frete = Factura × {formatRate(calculation.freightRate)}
        </Text>
        <Text variant="small" tabular style={styles.formula}>
          CFR = (Factura + Frete) ÷ {formatDivisor(calculation.cifDivisor)}
        </Text>
      </View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  formulas: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  formulaTitle: { marginBottom: spacing.sm, letterSpacing: 0.6 },
  formula: { marginTop: spacing.xs },
  footer: { marginTop: spacing.xl },
});

import type { Calculation } from '@/types';
import { formatMoney, formatRate } from './format';

/** Mensagem partilhada via WhatsApp, email ou qualquer app de partilha. */
export function buildShareMessage(calculation: Calculation, decimals = 2): string {
  const { currency } = calculation;
  return [
    'Vado',
    '',
    `Valor da factura: ${formatMoney(calculation.invoice, currency, decimals)}`,
    `CIF: ${formatMoney(calculation.cif, currency, decimals)}`,
    `CFR: ${formatMoney(calculation.cfr, currency, decimals)}`,
    `Frete (${formatRate(calculation.freightRate)}): ${formatMoney(calculation.freight, currency, decimals)}`,
    '',
    'Calculado com Vado.',
  ].join('\n');
}

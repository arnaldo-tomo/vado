import type { CalculationResult } from '@/types';

/**
 * Corta nas casas pedidas **sem arredondar**, como a calculadora usada no
 * escritório: 6363,6363… -> 6363,63 (e não 6363,64).
 *
 * A correcção do `scaled` é necessária porque em vírgula flutuante
 * `0.29 * 100` dá 28,999999999999996 — cortar directamente daria 0,28.
 */
export function truncateTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  const scaled = value * factor;
  const nearest = Math.round(scaled);
  const corrected = Math.abs(scaled - nearest) < 1e-9 ? nearest : scaled;
  return Math.trunc(corrected) / factor;
}

export function calculateCif(invoice: number, divisor: number): number {
  if (!Number.isFinite(invoice) || !Number.isFinite(divisor) || divisor === 0) return 0;
  return invoice / divisor;
}

export function calculateFreight(invoice: number, rate: number): number {
  if (!Number.isFinite(invoice) || !Number.isFinite(rate)) return 0;
  return invoice * (rate / 100);
}

/**
 * O frete é somado à factura **antes** da divisão pelo divisor — não é
 * acrescentado ao CIF depois. Ex.: 7000 -> (7000 + 140) ÷ 1,122 = 6363,64.
 */
export function calculateCfr(invoice: number, divisor: number, rate: number): number {
  if (!Number.isFinite(divisor) || divisor === 0) return 0;
  const base = invoice + calculateFreight(invoice, rate);
  if (!Number.isFinite(base)) return 0;
  return base / divisor;
}

/** Calcula o conjunto completo, já cortado para apresentação e persistência. */
export function calculate(
  invoice: number,
  divisor: number,
  rate: number,
  decimals = 2
): CalculationResult {
  const cif = truncateTo(calculateCif(invoice, divisor), decimals);
  const freight = truncateTo(calculateFreight(invoice, rate), decimals);
  const cfr = truncateTo(calculateCfr(invoice, divisor, rate), decimals);
  return {
    invoice: truncateTo(invoice, decimals),
    cif,
    freight,
    cfr,
    difference: truncateTo(cfr - cif, decimals),
  };
}

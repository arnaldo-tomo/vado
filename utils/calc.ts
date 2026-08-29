import type { CalculationResult } from '@/types';

/**
 * Arredonda para um número fixo de casas evitando os artefactos habituais
 * de vírgula flutuante (ex.: 1.005 -> 1.00 em vez de 1.01).
 */
export function roundTo(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return (
    Math.round((value + Number.EPSILON * Math.sign(value) * Math.abs(value)) * factor) / factor
  );
}

export function calculateCif(invoice: number, divisor: number): number {
  if (!Number.isFinite(invoice) || !Number.isFinite(divisor) || divisor === 0) return 0;
  return invoice / divisor;
}

export function calculateFreight(invoice: number, rate: number): number {
  if (!Number.isFinite(invoice) || !Number.isFinite(rate)) return 0;
  return invoice * (rate / 100);
}

export function calculateCfr(invoice: number, divisor: number, rate: number): number {
  return calculateCif(invoice, divisor) + calculateFreight(invoice, rate);
}

/** Calcula o conjunto completo, já arredondado para apresentação e persistência. */
export function calculate(
  invoice: number,
  divisor: number,
  rate: number,
  decimals = 2
): CalculationResult {
  const cif = roundTo(calculateCif(invoice, divisor), decimals);
  const freight = roundTo(calculateFreight(invoice, rate), decimals);
  const cfr = roundTo(cif + freight, decimals);
  return {
    invoice: roundTo(invoice, decimals),
    cif,
    freight,
    cfr,
    difference: roundTo(cfr - cif, decimals),
  };
}

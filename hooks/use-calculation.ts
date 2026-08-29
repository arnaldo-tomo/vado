import { useMemo } from 'react';

import { calculate } from '@/utils/calc';
import type { CalculationResult } from '@/types';

/** Recalcula apenas quando o valor ou os parâmetros mudam. */
export function useCalculation(
  invoice: number | null,
  divisor: number,
  rate: number,
  decimals: number
): CalculationResult | null {
  return useMemo(() => {
    if (invoice === null || invoice <= 0) return null;
    return calculate(invoice, divisor, rate, decimals);
  }, [invoice, divisor, rate, decimals]);
}

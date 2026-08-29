import type { Settings } from '@/types';

export const DEFAULT_SETTINGS: Settings = {
  freightRate: 2,
  cifDivisor: 1.122,
  currency: 'MZN',
  themeMode: 'system',
  decimals: 2,
  showQuickAmounts: true,
};

export const QUICK_AMOUNTS = [50000, 100000, 250000, 500000];

export const LIMITS = {
  freightRate: { min: 0, max: 100 },
  cifDivisor: { min: 0.0001, max: 10 },
  decimals: { min: 0, max: 4 },
  invoice: { max: 1_000_000_000_000 },
};

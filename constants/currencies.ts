import type { CurrencyCode } from '@/types';

interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'MZN', label: 'Metical moçambicano' },
  { code: 'USD', label: 'Dólar americano' },
  { code: 'ZAR', label: 'Rand sul-africano' },
  { code: 'EUR', label: 'Euro' },
];

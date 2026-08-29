export type CurrencyCode = 'MZN' | 'USD' | 'ZAR' | 'EUR';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface Settings {
  /** Percentagem aplicada sobre o valor da factura para obter o frete. */
  freightRate: number;
  /** Divisor usado no cálculo do CIF. */
  cifDivisor: number;
  currency: CurrencyCode;
  themeMode: ThemeMode;
  decimals: number;
  showQuickAmounts: boolean;
}

export interface CalculationResult {
  invoice: number;
  cif: number;
  freight: number;
  cfr: number;
  difference: number;
}

export interface Calculation extends CalculationResult {
  id: string;
  freightRate: number;
  cifDivisor: number;
  currency: CurrencyCode;
  /** Milissegundos desde a época (Date.now). */
  createdAt: number;
  favorite: boolean;
}

export type HistoryFilter = 'all' | 'favorites';

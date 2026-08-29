import type { CurrencyCode } from '@/types';

const GROUP_SEPARATOR = ' ';
const DECIMAL_SEPARATOR = ',';

function groupInteger(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
}

/** 125000 -> "125 000,00" */
export function formatAmount(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  const safe = Math.abs(value) < 1 / 10 ** (decimals + 1) ? 0 : value;
  const fixed = Math.abs(safe).toFixed(decimals);
  const [intPart, fracPart] = fixed.split('.');
  const body = fracPart
    ? `${groupInteger(intPart)}${DECIMAL_SEPARATOR}${fracPart}`
    : groupInteger(intPart);
  return safe < 0 ? `-${body}` : body;
}

/** 125000 -> "125 000,00 MZN" */
export function formatMoney(value: number, currency: CurrencyCode, decimals = 2): string {
  return `${formatAmount(value, decimals)} ${currency}`;
}

export function formatSignedMoney(value: number, currency: CurrencyCode, decimals = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${sign ? ' ' : ''}${formatMoney(Math.abs(value), currency, decimals)}`;
}

/** 2 -> "2%"; 2.5 -> "2,5%" */
export function formatRate(rate: number): string {
  const rounded = Math.round(rate * 100) / 100;
  return `${String(rounded).replace('.', DECIMAL_SEPARATOR)}%`;
}

export function formatDivisor(divisor: number): string {
  return String(divisor).replace('.', DECIMAL_SEPARATOR);
}

/**
 * Normaliza o texto escrito pelo utilizador: apenas dígitos e um separador
 * decimal, limitado ao número de casas configurado.
 */
export function sanitizeAmountInput(text: string, decimals = 2): string {
  const cleaned = text.replace(/[^\d.,]/g, '').replace(/\./g, DECIMAL_SEPARATOR);
  const firstSeparator = cleaned.indexOf(DECIMAL_SEPARATOR);
  if (firstSeparator === -1) return cleaned.replace(/^0+(?=\d)/, '');
  if (decimals === 0) return cleaned.slice(0, firstSeparator).replace(/^0+(?=\d)/, '');
  const integerPart = cleaned.slice(0, firstSeparator).replace(/^0+(?=\d)/, '');
  const fractionPart = cleaned
    .slice(firstSeparator + 1)
    .replace(/[^\d]/g, '')
    .slice(0, decimals);
  return `${integerPart}${DECIMAL_SEPARATOR}${fractionPart}`;
}

/** Aplica separadores de milhar preservando o que está a ser escrito. */
export function formatAmountInput(raw: string): string {
  if (!raw) return '';
  const [intPart, fracPart] = raw.split(DECIMAL_SEPARATOR);
  const grouped = groupInteger(intPart || '');
  return fracPart === undefined ? grouped : `${grouped}${DECIMAL_SEPARATOR}${fracPart}`;
}

/** "125 000,50" -> 125000.5 ; entrada inválida -> null */
export function parseAmount(raw: string): number | null {
  if (!raw) return null;
  const normalized = raw
    .replace(new RegExp(`\\${GROUP_SEPARATOR}`, 'g'), '')
    .replace(DECIMAL_SEPARATOR, '.');
  if (!/^\d*(\.\d*)?$/.test(normalized) || normalized === '' || normalized === '.') return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

/** Aceita "2", "2,5" ou "2.5" — usado nos campos das definições. */
export function parseDecimalInput(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.');
  if (!/^\d*(\.\d*)?$/.test(normalized) || normalized === '' || normalized === '.') return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

const TIME_FORMAT = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "Hoje • 08:42", "Ontem • 17:03" ou "12 mar 2025 • 09:15" */
export function formatTimestamp(timestamp: number, now = new Date()): string {
  const date = new Date(timestamp);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const time = TIME_FORMAT(date);
  if (isSameDay(date, now)) return `Hoje • ${time}`;
  if (isSameDay(date, yesterday)) return `Ontem • ${time}`;

  const year = date.getFullYear() === now.getFullYear() ? '' : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${year} • ${time}`;
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} • ${TIME_FORMAT(date)}`;
}

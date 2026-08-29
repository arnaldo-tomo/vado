import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { calculate } from '@/utils/calc';
import { formatMoney, formatRate } from '@/utils/format';

/**
 * As definições são o único ponto onde a taxa e o divisor mudam — estes testes
 * garantem que a alteração se propaga a todos os valores apresentados.
 */
describe('alterações das definições', () => {
  const invoice = 100000;

  it('uma taxa diferente muda o frete e o CFR, mas não o CIF', () => {
    const base = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, 2);
    const higher = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, 5);

    expect(higher.cif).toBe(base.cif);
    expect(higher.freight).toBe(5000);
    expect(higher.cfr).toBeCloseTo((invoice + 5000) / DEFAULT_SETTINGS.cifDivisor, 2);
    expect(higher.cfr).toBeGreaterThan(base.cfr);
  });

  it('um divisor diferente muda o CIF e o CFR, mas não o frete', () => {
    const base = calculate(invoice, 1.122, DEFAULT_SETTINGS.freightRate);
    const other = calculate(invoice, 1.5, DEFAULT_SETTINGS.freightRate);

    expect(other.freight).toBe(base.freight);
    expect(other.cif).toBeCloseTo(66666.67, 2);
    expect(other.cfr).toBeCloseTo(68000, 2);
  });

  it('taxa de 0% torna o CFR igual ao CIF', () => {
    const result = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, 0);
    expect(result.freight).toBe(0);
    expect(result.cfr).toBe(result.cif);
    expect(result.difference).toBe(0);
  });

  it('a moeda escolhida acompanha todos os valores apresentados', () => {
    const result = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, DEFAULT_SETTINGS.freightRate);
    expect(formatMoney(result.cif, 'MZN')).toBe('89 126,56 MZN');
    expect(formatMoney(result.cif, 'USD')).toBe('89 126,56 USD');
  });

  it('os valores por defeito correspondem ao esperado', () => {
    expect(DEFAULT_SETTINGS.freightRate).toBe(2);
    expect(DEFAULT_SETTINGS.cifDivisor).toBe(1.122);
    expect(DEFAULT_SETTINGS.currency).toBe('MZN');
    expect(DEFAULT_SETTINGS.decimals).toBe(2);
    expect(formatRate(DEFAULT_SETTINGS.freightRate)).toBe('2%');
  });
});

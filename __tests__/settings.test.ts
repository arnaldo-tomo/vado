import { CURRENCIES, currencyLabel } from '@/constants/currencies';
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
    expect(higher.cfr).toBeCloseTo((invoice + 5000) / DEFAULT_SETTINGS.cifDivisor, 1);
    expect(higher.cfr).toBeGreaterThan(base.cfr);
  });

  it('um divisor diferente muda o CIF e o CFR, mas não o frete', () => {
    const base = calculate(invoice, 1.122, DEFAULT_SETTINGS.freightRate);
    const other = calculate(invoice, 1.5, DEFAULT_SETTINGS.freightRate);

    expect(other.freight).toBe(base.freight);
    expect(other.cif).toBe(66666.66);
    expect(other.cfr).toBe(68000);
  });

  it('taxa de 0% torna o CFR igual ao CIF', () => {
    const result = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, 0);
    expect(result.freight).toBe(0);
    expect(result.cfr).toBe(result.cif);
    expect(result.difference).toBe(0);
  });

  it('todas as moedas suportadas formatam da mesma maneira', () => {
    const codes = CURRENCIES.map((currency) => currency.code);
    expect(codes).toEqual(['MZN', 'USD', 'ZAR', 'EUR', 'CNY', 'JPY']);

    for (const code of codes) {
      expect(formatMoney(6363.63, code)).toBe(`6 363,63 ${code}`);
      expect(currencyLabel(code)).not.toBe(code);
    }
  });

  it('o iene fica legível com zero casas decimais', () => {
    // O JPY não usa subunidade; basta pôr as casas decimais a 0 nas Definições.
    expect(formatMoney(741000, 'JPY', 0)).toBe('741 000 JPY');
  });

  it('a moeda escolhida acompanha todos os valores apresentados', () => {
    const result = calculate(invoice, DEFAULT_SETTINGS.cifDivisor, DEFAULT_SETTINGS.freightRate);
    expect(formatMoney(result.cif, 'MZN')).toBe('89 126,55 MZN');
    expect(formatMoney(result.cif, 'USD')).toBe('89 126,55 USD');
  });

  it('os valores por defeito correspondem ao esperado', () => {
    expect(DEFAULT_SETTINGS.freightRate).toBe(2);
    expect(DEFAULT_SETTINGS.cifDivisor).toBe(1.122);
    expect(DEFAULT_SETTINGS.currency).toBe('MZN');
    expect(DEFAULT_SETTINGS.decimals).toBe(2);
    expect(formatRate(DEFAULT_SETTINGS.freightRate)).toBe('2%');
  });
});

import { DEFAULT_SETTINGS } from '@/constants/defaults';
import {
  calculate,
  calculateCfr,
  calculateCif,
  calculateFreight,
  truncateTo,
} from '@/utils/calc';

const { cifDivisor: DIVISOR, freightRate: RATE } = DEFAULT_SETTINGS;

describe('calculateCif', () => {
  it('divide a factura pelo divisor configurado', () => {
    expect(calculateCif(100000, DIVISOR)).toBeCloseTo(89126.56, 2);
    expect(calculateCif(125000, DIVISOR)).toBeCloseTo(111408.2, 2);
  });

  it('acompanha alterações do divisor', () => {
    expect(calculateCif(100000, 1)).toBe(100000);
    expect(calculateCif(100000, 2)).toBe(50000);
  });

  it('devolve zero em vez de Infinity quando o divisor é zero', () => {
    expect(calculateCif(100000, 0)).toBe(0);
  });
});

describe('calculateFreight', () => {
  it('aplica a taxa como percentagem da factura', () => {
    expect(calculateFreight(100000, 2)).toBe(2000);
    expect(calculateFreight(125000, 2)).toBe(2500);
  });

  it('acompanha alterações da taxa', () => {
    expect(calculateFreight(100000, 0)).toBe(0);
    expect(calculateFreight(100000, 5)).toBe(5000);
    expect(calculateFreight(100000, 2.5)).toBe(2500);
  });
});

describe('calculateCfr', () => {
  it('divide a soma da factura com o frete', () => {
    expect(calculateCfr(7000, DIVISOR, RATE)).toBeCloseTo(6363.64, 2);
    expect(calculateCfr(100000, DIVISOR, RATE)).toBeCloseTo(90909.09, 2);
    expect(calculateCfr(125000, DIVISOR, RATE)).toBeCloseTo(113636.36, 2);
  });

  it('o frete entra antes da divisão, não depois', () => {
    const invoice = 372450.75;
    const freight = calculateFreight(invoice, RATE);

    expect(calculateCfr(invoice, DIVISOR, RATE)).toBeCloseTo((invoice + freight) / DIVISOR, 6);
    expect(calculateCfr(invoice, DIVISOR, RATE)).not.toBeCloseTo(
      calculateCif(invoice, DIVISOR) + freight,
      2
    );
  });

  it('devolve zero em vez de Infinity quando o divisor é zero', () => {
    expect(calculateCfr(100000, 0, RATE)).toBe(0);
  });
});

describe('truncateTo', () => {
  it('corta, não arredonda', () => {
    expect(truncateTo(89126.5597, 2)).toBe(89126.55);
    expect(truncateTo(89126.5597, 0)).toBe(89126);
    expect(truncateTo(89126.5597, 4)).toBe(89126.5597);
    expect(truncateTo(6363.636363, 2)).toBe(6363.63);
  });

  it('não corta um cêntimo a mais por erro de vírgula flutuante', () => {
    // 0.29 * 100 dá 28,999999999999996 em binário; cortar às cegas daria 0,28.
    expect(truncateTo(0.29, 2)).toBe(0.29);
    expect(truncateTo(1.15, 2)).toBe(1.15);
    expect(truncateTo(8.7, 2)).toBe(8.7);
    expect(truncateTo(0.1 + 0.2, 2)).toBe(0.3);
  });

  it('trata valores não finitos como zero', () => {
    expect(truncateTo(Number.NaN, 2)).toBe(0);
    expect(truncateTo(Number.POSITIVE_INFINITY, 2)).toBe(0);
  });
});

describe('calculate', () => {
  it('devolve o conjunto completo', () => {
    expect(calculate(125000, DIVISOR, RATE)).toEqual({
      invoice: 125000,
      cif: 111408.19,
      freight: 2500,
      cfr: 113636.36,
      difference: 2228.17,
    });
  });

  it('a diferença é o frete já diluído pelo divisor', () => {
    const result = calculate(100000, DIVISOR, RATE);
    expect(result.difference).toBe(truncateTo(result.cfr - result.cif, 2));
    // Aproximado, não exacto: CIF e CFR são cortados de forma independente.
    expect(result.difference).toBeCloseTo(result.freight / DIVISOR, 1);
  });

  it('respeita o número de casas decimais configurado', () => {
    expect(calculate(100000, DIVISOR, RATE, 0).cif).toBe(89126);
    expect(calculate(100000, DIVISOR, RATE, 4).cif).toBe(89126.5597);
  });

  it('suporta valores grandes sem perder consistência', () => {
    const invoice = 999_999_999;
    const result = calculate(invoice, DIVISOR, RATE);
    expect(result.cfr).toBe(truncateTo((invoice + result.freight) / DIVISOR, 2));
  });
});

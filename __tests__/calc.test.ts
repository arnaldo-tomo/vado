import { DEFAULT_SETTINGS } from '@/constants/defaults';
import { calculate, calculateCfr, calculateCif, calculateFreight, roundTo } from '@/utils/calc';

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

describe('roundTo', () => {
  it('arredonda para o número de casas pedido', () => {
    expect(roundTo(89126.5597, 2)).toBe(89126.56);
    expect(roundTo(89126.5597, 0)).toBe(89127);
    expect(roundTo(89126.5597, 4)).toBe(89126.5597);
  });

  it('não propaga artefactos de vírgula flutuante', () => {
    expect(roundTo(0.1 + 0.2, 2)).toBe(0.3);
    expect(roundTo(1.005, 2)).toBe(1.01);
  });

  it('trata valores não finitos como zero', () => {
    expect(roundTo(Number.NaN, 2)).toBe(0);
    expect(roundTo(Number.POSITIVE_INFINITY, 2)).toBe(0);
  });
});

describe('calculate', () => {
  it('devolve o conjunto completo', () => {
    expect(calculate(125000, DIVISOR, RATE)).toEqual({
      invoice: 125000,
      cif: 111408.2,
      freight: 2500,
      cfr: 113636.36,
      difference: 2228.16,
    });
  });

  it('a diferença é o frete já diluído pelo divisor', () => {
    const result = calculate(100000, DIVISOR, RATE);
    expect(result.difference).toBe(roundTo(result.cfr - result.cif, 2));
    expect(result.difference).toBeCloseTo(result.freight / DIVISOR, 2);
  });

  it('respeita o número de casas decimais configurado', () => {
    expect(calculate(100000, DIVISOR, RATE, 0).cif).toBe(89127);
    expect(calculate(100000, DIVISOR, RATE, 4).cif).toBe(89126.5597);
  });

  it('suporta valores grandes sem perder consistência', () => {
    const invoice = 999_999_999;
    const result = calculate(invoice, DIVISOR, RATE);
    expect(result.cfr).toBe(roundTo((invoice + result.freight) / DIVISOR, 2));
  });
});

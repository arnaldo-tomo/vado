import { calculate, calculateCfr, calculateCif, calculateFreight } from '@/utils/calc';

/**
 * Fixa a fórmula tal como está no apontamento manuscrito do Rivaldo:
 *
 *   CIF = valor da factura ÷ 1,122
 *   CFR = (valor da factura + valor da factura × 2%) ÷ 1,122
 *
 * O passo que se engana com facilidade: o frete entra **antes** da divisão.
 * `CIF + frete` dá outro número e está errado.
 */
describe('fórmula CIF / CFR', () => {
  const divisor = 1.122;
  const RATE = 2;

  it('o CIF é só a factura dividida — confirmado, não mexer', () => {
    expect(calculateCif(7000, divisor)).toBeCloseTo(6238.86, 2);
    expect(calculateCif(125000, divisor)).toBeCloseTo(111408.2, 2);
    expect(calculate(7000, divisor, RATE).cif).toBe(6238.86);
  });

  it('reproduz o exemplo escrito à mão: 7.000 USD', () => {
    const invoice = 7000;

    expect(calculateFreight(invoice, RATE)).toBe(140);
    expect(invoice + calculateFreight(invoice, RATE)).toBe(7140);
    expect(calculateCfr(invoice, divisor, RATE)).toBeCloseTo(6363.636364, 5);
    expect(calculate(invoice, divisor, RATE).cfr).toBe(6363.64);
  });

  it('CFR é a soma dividida, não o CIF mais o frete', () => {
    const invoice = 7000;
    const errado = calculateCif(invoice, divisor) + calculateFreight(invoice, RATE);

    expect(errado).toBeCloseTo(6378.86, 2);
    expect(calculateCfr(invoice, divisor, RATE)).not.toBeCloseTo(errado, 2);
  });

  it.each([7000, 100000, 125000, 372450.75])(
    'CFR de %p bate certo com a fórmula escrita à mão',
    (invoice) => {
      const byHand = (invoice + invoice * 0.02) / divisor;
      expect(calculateCfr(invoice, divisor, RATE)).toBeCloseTo(byHand, 6);
    }
  );

  it('a taxa é percentagem: 2 significa 2%, não 0,02%', () => {
    expect(calculateFreight(125000, 2)).toBe(2500);
    // Escrever "0,02" no campo da taxa seria lido como 0,02% — cem vezes menos.
    expect(calculateFreight(125000, 0.02)).toBe(25);
  });

  it('equivale a multiplicar a factura por (1 + taxa) e dividir', () => {
    const invoice = 250000;
    expect(calculateCfr(invoice, divisor, RATE)).toBeCloseTo((invoice * 1.02) / divisor, 6);
  });

  it('taxa de 0% torna o CFR igual ao CIF', () => {
    const result = calculate(100000, divisor, 0);
    expect(result.freight).toBe(0);
    expect(result.cfr).toBe(result.cif);
    expect(result.difference).toBe(0);
  });
});

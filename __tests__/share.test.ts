import type { Calculation } from '@/types';
import { buildShareMessage } from '@/utils/share';

const calculation: Calculation = {
  id: 'test',
  invoice: 125000,
  cif: 111408.2,
  freight: 2500,
  cfr: 113908.2,
  difference: 2500,
  freightRate: 2,
  cifDivisor: 1.122,
  currency: 'MZN',
  createdAt: 0,
  favorite: false,
};

describe('buildShareMessage', () => {
  it('produz a mensagem de partilha completa', () => {
    expect(buildShareMessage(calculation)).toBe(
      [
        'Vado',
        '',
        'Valor da factura: 125 000,00 MZN',
        'CIF: 111 408,20 MZN',
        'CFR: 113 908,20 MZN',
        'Frete (2%): 2 500,00 MZN',
        '',
        'Calculado com Vado.',
      ].join('\n')
    );
  });

  it('usa a moeda e as casas decimais do cálculo', () => {
    const message = buildShareMessage({ ...calculation, currency: 'USD' }, 0);
    expect(message).toContain('Valor da factura: 125 000 USD');
    expect(message).toContain('CIF: 111 408 USD');
  });
});

import {
  formatAmount,
  formatAmountInput,
  formatDivisor,
  formatMoney,
  formatRate,
  formatSignedMoney,
  formatTimestamp,
  parseAmount,
  parseDecimalInput,
  sanitizeAmountInput,
} from '@/utils/format';

describe('formatAmount', () => {
  it('agrupa milhares e usa vírgula decimal', () => {
    expect(formatAmount(125000)).toBe('125 000,00');
    expect(formatAmount(1234567.891)).toBe('1 234 567,89');
    expect(formatAmount(999)).toBe('999,00');
  });

  it('respeita o número de casas decimais', () => {
    expect(formatAmount(125000, 0)).toBe('125 000');
    expect(formatAmount(111408.1996, 4)).toBe('111 408,1996');
  });

  it('trata zero e valores negativos', () => {
    expect(formatAmount(0)).toBe('0,00');
    expect(formatAmount(-2500)).toBe('-2 500,00');
  });

  it('devolve o marcador quando o valor não é um número', () => {
    expect(formatAmount(Number.NaN)).toBe('—');
  });
});

describe('formatMoney', () => {
  it('acrescenta a moeda ao valor formatado', () => {
    expect(formatMoney(125000, 'MZN')).toBe('125 000,00 MZN');
    expect(formatMoney(111408.2, 'USD')).toBe('111 408,20 USD');
  });

  it('acompanha a alteração de moeda', () => {
    expect(formatMoney(1000, 'ZAR')).toBe('1 000,00 ZAR');
    expect(formatMoney(1000, 'EUR')).toBe('1 000,00 EUR');
  });
});

describe('formatSignedMoney', () => {
  it('marca o sinal da diferença', () => {
    expect(formatSignedMoney(2500, 'MZN')).toBe('+ 2 500,00 MZN');
    expect(formatSignedMoney(0, 'MZN')).toBe('0,00 MZN');
  });
});

describe('formatRate e formatDivisor', () => {
  it('apresenta a taxa em português', () => {
    expect(formatRate(2)).toBe('2%');
    expect(formatRate(2.5)).toBe('2,5%');
  });

  it('apresenta o divisor com vírgula', () => {
    expect(formatDivisor(1.122)).toBe('1,122');
  });
});

describe('sanitizeAmountInput', () => {
  it('remove tudo o que não é número ou separador', () => {
    expect(sanitizeAmountInput('12a3b')).toBe('123');
    expect(sanitizeAmountInput('-500')).toBe('500');
  });

  it('aceita ponto ou vírgula como separador decimal', () => {
    expect(sanitizeAmountInput('125.50')).toBe('125,50');
    expect(sanitizeAmountInput('125,50')).toBe('125,50');
  });

  it('limita as casas decimais', () => {
    expect(sanitizeAmountInput('125,5678', 2)).toBe('125,56');
    expect(sanitizeAmountInput('125,5678', 0)).toBe('125');
    expect(sanitizeAmountInput('125,5678', 4)).toBe('125,5678');
  });

  it('ignora separadores repetidos', () => {
    expect(sanitizeAmountInput('1,2,3')).toBe('1,23');
  });

  it('remove zeros à esquerda', () => {
    expect(sanitizeAmountInput('000125')).toBe('125');
  });
});

describe('formatAmountInput', () => {
  it('agrupa enquanto o utilizador escreve', () => {
    expect(formatAmountInput('125000')).toBe('125 000');
    expect(formatAmountInput('125000,')).toBe('125 000,');
    expect(formatAmountInput('125000,5')).toBe('125 000,5');
    expect(formatAmountInput('')).toBe('');
  });
});

describe('parseAmount', () => {
  it('converte o texto apresentado num número', () => {
    expect(parseAmount('125 000,00')).toBe(125000);
    expect(parseAmount('125 000,50')).toBe(125000.5);
    expect(parseAmount('0')).toBe(0);
  });

  it('devolve null para entradas incompletas ou vazias', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount(',')).toBeNull();
  });

  it('nunca devolve um número negativo', () => {
    expect(parseAmount('-500')).toBeNull();
  });
});

describe('parseDecimalInput', () => {
  it('aceita vírgula e ponto', () => {
    expect(parseDecimalInput('2,5')).toBe(2.5);
    expect(parseDecimalInput('1.122')).toBe(1.122);
  });

  it('rejeita texto inválido', () => {
    expect(parseDecimalInput('abc')).toBeNull();
    expect(parseDecimalInput('')).toBeNull();
    expect(parseDecimalInput('-2')).toBeNull();
  });
});

describe('formatTimestamp', () => {
  const now = new Date(2025, 2, 12, 10, 0);

  it('usa "Hoje" para o próprio dia', () => {
    expect(formatTimestamp(new Date(2025, 2, 12, 8, 42).getTime(), now)).toBe('Hoje • 08:42');
  });

  it('usa "Ontem" para o dia anterior', () => {
    expect(formatTimestamp(new Date(2025, 2, 11, 17, 3).getTime(), now)).toBe('Ontem • 17:03');
  });

  it('mostra a data para dias anteriores', () => {
    expect(formatTimestamp(new Date(2025, 2, 4, 9, 15).getTime(), now)).toBe('4 mar • 09:15');
    expect(formatTimestamp(new Date(2024, 11, 31, 23, 5).getTime(), now)).toBe(
      '31 dez 2024 • 23:05'
    );
  });
});

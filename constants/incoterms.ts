export interface Incoterm {
  code: 'CIF' | 'CFR';
  fullName: string;
  description: string;
  /** Resumo do que o preço cobre — mostrado como lista visual. */
  coverage: { label: string; included: boolean }[];
  /** Nota curta apresentada junto ao valor calculado. */
  shortNote: string;
}

export const INCOTERMS: Incoterm[] = [
  {
    code: 'CIF',
    fullName: 'Cost, Insurance and Freight',
    description:
      'O vendedor paga o custo da mercadoria, o frete e o seguro até ao porto de destino.',
    coverage: [
      { label: 'Mercadoria', included: true },
      { label: 'Frete', included: true },
      { label: 'Seguro', included: true },
    ],
    shortNote: 'Frete + seguro incluídos',
  },
  {
    code: 'CFR',
    fullName: 'Cost and Freight',
    description:
      'O vendedor paga o custo da mercadoria e o frete marítimo até ao porto de destino, mas o seguro não está incluído.',
    coverage: [
      { label: 'Mercadoria', included: true },
      { label: 'Frete', included: true },
      { label: 'Seguro', included: false },
    ],
    shortNote: 'Frete incluído, seguro não incluído',
  },
];

export const INCOTERMS_NOTE =
  'Os Incoterms são regras internacionais publicadas pela International Chamber of Commerce para definir responsabilidades entre vendedor e comprador no comércio internacional.';

export function getIncoterm(code: Incoterm['code']): Incoterm {
  const found = INCOTERMS.find((item) => item.code === code);
  if (!found) throw new Error(`Incoterm desconhecido: ${code}`);
  return found;
}

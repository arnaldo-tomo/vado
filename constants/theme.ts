export const palette = {
  navy: '#0B1F33',
  teal: '#14B8A6',
  accent: '#22C7B8',
} as const;

export interface ColorScheme {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  warning: string;
  error: string;
  errorSoft: string;
  overlay: string;
}

const light: ColorScheme = {
  background: '#F7F9FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F4F8',
  text: '#101828',
  textSecondary: '#667085',
  border: '#E4E7EC',
  primary: palette.navy,
  onPrimary: '#FFFFFF',
  accent: palette.teal,
  accentSoft: '#E6F7F4',
  onAccent: '#04322D',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  errorSoft: '#FEF2F2',
  overlay: 'rgba(11, 31, 51, 0.45)',
};

const dark: ColorScheme = {
  background: '#08131F',
  surface: '#102231',
  surfaceMuted: '#162C3E',
  text: '#F5F7FA',
  textSecondary: '#93A4B5',
  border: '#1E3547',
  primary: '#173A55',
  onPrimary: '#F5F7FA',
  accent: palette.accent,
  accentSoft: '#123A3A',
  onAccent: '#02201D',
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  errorSoft: '#2A1618',
  overlay: 'rgba(2, 8, 14, 0.6)',
};

export const colors = { light, dark };

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40 },
  h1: { fontFamily: fonts.semibold, fontSize: 26, lineHeight: 34 },
  h2: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  smallMedium: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  amountLarge: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 42 },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Alinha os dígitos em colunas — essencial para comparar valores monetários. */
export const tabularNumbers = { fontVariant: ['tabular-nums' as const] };

export const shadows = {
  card: {
    shadowColor: '#0B1F33',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: '#0B1F33',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

export const durations = {
  fast: 150,
  base: 200,
  slow: 250,
} as const;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

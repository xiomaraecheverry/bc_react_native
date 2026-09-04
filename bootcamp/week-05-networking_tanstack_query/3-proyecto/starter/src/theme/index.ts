// src/theme/index.ts
// Tokens de diseño basados en la identidad visual de la Cooperativa de Vivienda

export const COLORS = {
  primary: '#0055aa',
  primaryDark: '#003f7f',
  primaryLight: '#e0edff',

  background: '#f4f6f8',
  surface: '#ffffff',
  card: '#ffffff',
  cardSecondary: '#f8fafc',

  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#6b7280',

  accent: '#0055aa',
  price: '#15803d',
  success: '#16a34a',
  warning: '#d97706',
  error: '#dc2626',

  border: '#e5e7eb',
  borderLight: '#f3f4f6',
} as const;

export const TYPOGRAPHY = {
  h1: { fontSize: 24, fontWeight: '700' as const, color: COLORS.textPrimary },
  h2: { fontSize: 19, fontWeight: '700' as const, color: COLORS.textPrimary },
  h3: { fontSize: 16, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 14, fontWeight: '400' as const, color: COLORS.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: COLORS.textSecondary },
  label: { fontSize: 12, fontWeight: '600' as const, color: COLORS.textMuted },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 36,
} as const;

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

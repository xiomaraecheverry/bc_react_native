// src/theme/index.ts
// Paleta de colores, tipografía, radios y espaciado para Cooperativa de Vivienda

import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#0B0F19',
  surface: '#111827',
  card: '#1F2937',
  cardHover: '#283548',
  border: '#374151',
  borderFocus: '#10B981',
  
  // Acentos de marca: Verde esmeralda cooperativo + Azul cielo
  primary: '#10B981',       // Verde cooperativo
  primaryDark: '#059669',
  primaryLight: '#34D399',
  accent: '#3B82F6',        // Azul institucional
  accentLight: '#93C5FD',

  text: '#F9FAFB',
  textSecondary: '#E5E7EB',
  textMuted: '#9CA3AF',
  textSubtle: '#6B7280',

  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  success: '#22C55E',
  successLight: '#86EFAC',
  warning: '#F59E0B',
  badgeVis: '#8B5CF6',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const TYPOGRAPHY = StyleSheet.create({
  h1: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  h3: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 14, fontWeight: '500', color: COLORS.textMuted },
  body: { fontSize: 14, fontWeight: '400', color: COLORS.text },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  caption: { fontSize: 12, fontWeight: '400', color: COLORS.textMuted },
  error: { fontSize: 12, fontWeight: '500', color: COLORS.errorLight },
  badge: { fontSize: 11, fontWeight: '700' },
});

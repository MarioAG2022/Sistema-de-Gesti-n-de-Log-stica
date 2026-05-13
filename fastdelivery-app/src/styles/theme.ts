// ─────────────────────────────────────────────
// Design tokens centralizados de FastDelivery
// ─────────────────────────────────────────────

export const Colors = {
  // Fondos
  background: '#F4F6F8',
  surface: '#FFFFFF',
  surfaceAlt: '#F9FAFB',

  // Texto
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Marca
  primary: '#2563EB',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',

  // Estados de pedido
  pending: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  onRoute: { bg: '#DBEAFE', text: '#1E40AF', dot: '#2563EB' },
  delivered: { bg: '#DCFCE7', text: '#14532D', dot: '#16A34A' },
  cancelled: { bg: '#FEE2E2', text: '#7F1D1D', dot: '#DC2626' },

  // UI
  border: '#E5E7EB',
  borderFocus: '#2563EB',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  shadow: '#000000',
  overlay: 'rgba(0,0,0,0.4)',
  inputBg: '#F9FAFB',
  disabled: '#D1D5DB',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  h1: { fontSize: 26, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodySmall: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
} as const;

export const Shadow = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

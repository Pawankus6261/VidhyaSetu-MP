// VidyaSetu MP — Design System Tokens
// Matches Stitch project: stitch.withgoogle.com/projects/13816351680170292712
// Luminous Slate + Saffron Amber (#F59E0B / #D97706), Civic Tech Premium Glassmorphism

export const LIGHT = {
  // App Chrome (Header/Dock)
  chromeBackground: '#0B132B',
  chromeGradientTop: '#070D1F',
  chromeGradientBottom: '#101C3D',
  chromeBorder: '#1E293B',
  chromeBorderGlow: 'rgba(245, 158, 11, 0.3)',
  chromeText: '#F8FAFC',
  chromeTextMuted: '#94A3B8',

  // Canvas & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  surfaceHighlight: '#FFFFFF',
  surfaceBorder: '#E2E8F0',
  surfaceBorderAlt: '#CBD5E1',
  surfaceGlow: 'rgba(217, 119, 6, 0.08)',

  // Glassmorphism tokens
  glassBg: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(226, 232, 240, 0.8)',
  glassCardBg: '#FFFFFF',
  glassCardBorder: 'rgba(217, 119, 6, 0.18)',

  // Primary Saffron / Royal Amber
  primary: '#D97706',
  primaryLight: '#F59E0B',
  primaryBright: '#FBBF24',
  primarySoft: '#FEF3C7',
  primaryBorder: '#FCD34D',
  primaryGlow: 'rgba(245, 158, 11, 0.25)',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textXMuted: '#94A3B8',

  // Semantic Status
  success: '#10B981',
  successSoft: '#D1FAE5',
  successText: '#065F46',
  successBorder: '#A7F3D0',
  successGlow: 'rgba(16, 185, 129, 0.2)',

  error: '#EF4444',
  errorSoft: '#FEE2E2',
  errorText: '#B91C1C',
  errorBorder: '#FECACA',

  info: '#2563EB',
  infoSoft: '#EFF6FF',
  infoText: '#1E40AF',
  infoBorder: '#BFDBFE',

  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  warningText: '#92400E',
  warningBorder: '#FDE68A',

  // Network status
  offline: '#F59E0B',
  online: '#10B981',

  // Shadows
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  cardShadowElevated: 'rgba(15, 23, 42, 0.16)',
};

export const DARK = {
  // App Chrome
  chromeBackground: '#070D1B',
  chromeGradientTop: '#040813',
  chromeGradientBottom: '#0D172E',
  chromeBorder: 'rgba(255, 255, 255, 0.08)',
  chromeBorderGlow: 'rgba(245, 158, 11, 0.35)',
  chromeText: '#F8FAFC',
  chromeTextMuted: '#94A3B8',

  // Canvas & Surfaces
  background: '#090E1A',
  surface: '#111A2E',
  surfaceAlt: '#16223B',
  surfaceHighlight: '#1D2D4E',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceBorderAlt: 'rgba(255, 255, 255, 0.14)',
  surfaceGlow: 'rgba(245, 158, 11, 0.15)',

  // Glassmorphism tokens
  glassBg: 'rgba(17, 26, 46, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 0.09)',
  glassCardBg: 'rgba(19, 29, 51, 0.95)',
  glassCardBorder: 'rgba(245, 158, 11, 0.22)',

  // Primary Saffron / Royal Amber
  primary: '#D97706',
  primaryLight: '#F59E0B',
  primaryBright: '#FBBF24',
  primarySoft: 'rgba(245, 158, 11, 0.14)',
  primaryBorder: 'rgba(245, 158, 11, 0.35)',
  primaryGlow: 'rgba(245, 158, 11, 0.35)',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textXMuted: '#64748B',

  // Semantic Status
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.16)',
  successText: '#34D399',
  successBorder: 'rgba(16, 185, 129, 0.3)',
  successGlow: 'rgba(16, 185, 129, 0.25)',

  error: '#EF4444',
  errorSoft: 'rgba(239, 68, 68, 0.16)',
  errorText: '#F87171',
  errorBorder: 'rgba(239, 68, 68, 0.3)',

  info: '#38BDF8',
  infoSoft: 'rgba(56, 189, 248, 0.16)',
  infoText: '#7DD3FC',
  infoBorder: 'rgba(56, 189, 248, 0.3)',

  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.16)',
  warningText: '#FCD34D',
  warningBorder: 'rgba(245, 158, 11, 0.35)',

  // Network
  offline: '#F59E0B',
  online: '#10B981',

  // Shadows
  cardShadow: 'rgba(0, 0, 0, 0.45)',
  cardShadowElevated: 'rgba(0, 0, 0, 0.7)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const FONT = {
  sizes: {
    xs: 11,
    sm: 12,
    md: 14,
    base: 15,
    lg: 17,
    xl: 19,
    xxl: 23,
    display: 28,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const getTheme = (colorScheme) => (colorScheme === 'dark' ? DARK : LIGHT);
export const COLORS = LIGHT;

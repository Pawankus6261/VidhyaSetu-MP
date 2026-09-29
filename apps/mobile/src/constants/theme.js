// VidyaSetu MP — Design System Tokens
// Civic Tech Ultra-Premium Glassmorphism & High-Contrast Visual Architecture
// Luminous Slate + Saffron Amber (#F59E0B / #D97706) + Emerald Verification (#10B981)

export const LIGHT = {
  // App Chrome (Header/Dock)
  chromeBackground: '#0B132B',
  chromeGradientTop: '#070D1F',
  chromeGradientBottom: '#101C3D',
  chromeBorder: 'rgba(255, 255, 255, 0.08)',
  chromeBorderGlow: 'rgba(245, 158, 11, 0.25)',
  chromeText: '#F8FAFC',
  chromeTextMuted: '#94A3B8',

  // Canvas & Surfaces
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  surfaceHighlight: '#F8FAFC',
  surfaceBorder: '#E2E8F0',
  surfaceBorderAlt: '#CBD5E1',
  surfaceGlow: 'rgba(217, 119, 6, 0.06)',

  // Glassmorphism & Cards
  glassBg: 'rgba(255, 255, 255, 0.95)',
  glassBorder: 'rgba(226, 232, 240, 0.9)',
  glassCardBg: '#FFFFFF',
  glassCardBorder: 'rgba(217, 119, 6, 0.16)',

  // Primary Saffron / Royal Amber
  primary: '#D97706',
  primaryLight: '#F59E0B',
  primaryBright: '#FBBF24',
  primarySoft: 'rgba(245, 158, 11, 0.12)',
  primaryBorder: '#FCD34D',
  primaryGlow: 'rgba(245, 158, 11, 0.22)',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textXMuted: '#94A3B8',

  // Semantic Status
  success: '#10B981',
  successSoft: '#ECFDF5',
  successText: '#065F46',
  successBorder: '#A7F3D0',
  successGlow: 'rgba(16, 185, 129, 0.18)',

  error: '#EF4444',
  errorSoft: '#FEF2F2',
  errorText: '#B91C1C',
  errorBorder: '#FECACA',

  info: '#0284C7',
  infoSoft: '#F0F9FF',
  infoText: '#0369A1',
  infoBorder: '#BAE6FD',

  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  warningText: '#92400E',
  warningBorder: '#FDE68A',

  // Network status
  offline: '#F59E0B',
  online: '#10B981',

  // Shadows
  cardShadow: 'rgba(15, 23, 42, 0.06)',
  cardShadowElevated: 'rgba(15, 23, 42, 0.12)',
};

export const DARK = {
  // App Chrome
  chromeBackground: '#080E1C',
  chromeGradientTop: '#040812',
  chromeGradientBottom: '#0D162C',
  chromeBorder: 'rgba(255, 255, 255, 0.08)',
  chromeBorderGlow: 'rgba(245, 158, 11, 0.3)',
  chromeText: '#F8FAFC',
  chromeTextMuted: '#94A3B8',

  // Canvas & Surfaces
  background: '#070C18',
  surface: '#0F182E',
  surfaceAlt: '#14213D',
  surfaceHighlight: '#1A2A4E',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceBorderAlt: 'rgba(255, 255, 255, 0.12)',
  surfaceGlow: 'rgba(245, 158, 11, 0.15)',

  // Glassmorphism & Cards
  glassBg: 'rgba(15, 24, 46, 0.88)',
  glassBorder: 'rgba(255, 255, 255, 0.09)',
  glassCardBg: 'rgba(16, 26, 50, 0.96)',
  glassCardBorder: 'rgba(245, 158, 11, 0.25)',

  // Primary Saffron / Royal Amber
  primary: '#D97706',
  primaryLight: '#F59E0B',
  primaryBright: '#FBBF24',
  primarySoft: 'rgba(245, 158, 11, 0.15)',
  primaryBorder: 'rgba(245, 158, 11, 0.35)',
  primaryGlow: 'rgba(245, 158, 11, 0.35)',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textXMuted: '#64748B',

  // Semantic Status
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.14)',
  successText: '#34D399',
  successBorder: 'rgba(16, 185, 129, 0.28)',
  successGlow: 'rgba(16, 185, 129, 0.22)',

  error: '#EF4444',
  errorSoft: 'rgba(239, 68, 68, 0.14)',
  errorText: '#F87171',
  errorBorder: 'rgba(239, 68, 68, 0.28)',

  info: '#38BDF8',
  infoSoft: 'rgba(56, 189, 248, 0.14)',
  infoText: '#7DD3FC',
  infoBorder: 'rgba(56, 189, 248, 0.28)',

  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.14)',
  warningText: '#FCD34D',
  warningBorder: 'rgba(245, 158, 11, 0.32)',

  // Network
  offline: '#F59E0B',
  online: '#10B981',

  // Shadows
  cardShadow: 'rgba(0, 0, 0, 0.35)',
  cardShadowElevated: 'rgba(0, 0, 0, 0.65)',
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
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  pill: 999,
};

export const FONT = {
  sizes: {
    xxs: 10,
    xs: 11,
    sm: 12.5,
    md: 14,
    base: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const getTheme = (colorScheme) => (colorScheme === 'dark' ? DARK : LIGHT);
export const COLORS = LIGHT;

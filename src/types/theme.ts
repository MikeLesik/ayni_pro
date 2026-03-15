export type ThemeMode = 'light' | 'dark' | 'system';

export interface ColorTokens {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  gold: string;
  goldLight: string;
  goldDark: string;
  bgPrimary: string;
  bgSecondary: string;
  surfaceCard: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
}

export interface ShadowTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  gold: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export type SpacingScale = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type TypographyToken =
  | 'display-hero'
  | 'display-lg'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'label-sm'
  | 'number-lg'
  | 'number-md'
  | 'mono-sm';

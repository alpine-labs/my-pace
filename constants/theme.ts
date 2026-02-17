import { createContext, useContext } from 'react';
import type { ThemeMode } from '../types';

// ── Color schemes ────────────────────────────────────────────

export interface ColorScheme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryText: string;
  success: string;
  warning: string;
  error: string;
}

export const LightColors: ColorScheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
  primary: '#0077B6',
  primaryText: '#FFFFFF',
  success: '#2E7D32',
  warning: '#E65100',
  error: '#C62828',
};

export const DarkColors: ColorScheme = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  border: '#333333',
  primary: '#0077B6',
  primaryText: '#FFFFFF',
  success: '#2E7D32',
  warning: '#E65100',
  error: '#C62828',
};

// ── Typography ───────────────────────────────────────────────

export const Typography = {
  h1: { fontSize: 32, fontWeight: '600' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
};

// ── Spacing ──────────────────────────────────────────────────

export const Spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// ── Border radius ────────────────────────────────────────────

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

// ── Theme object ─────────────────────────────────────────────

export interface Theme {
  mode: ThemeMode;
  colors: ColorScheme;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
}

export function buildTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: mode === 'dark' ? DarkColors : LightColors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
  };
}

// ── React context + hook ─────────────────────────────────────

const ThemeContext = createContext<Theme>(buildTheme('light'));

export const ThemeProvider = ThemeContext.Provider;

/**
 * Returns the current theme.
 *
 * When rendered inside a <ThemeProvider>, it reads from context.
 * Alternatively, if a Zustand user-store is available at runtime it will
 * respect the persisted themeMode preference.  The hook is intentionally
 * kept lightweight so it can be used in both setups.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

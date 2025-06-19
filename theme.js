import { Platform } from 'react-native';

const brandColors = {
  primary: '#40E0D0',    // Turquoise
  accent: '#FFA07A',     // Coral
  background: '#1B2B3B', // Dark Navy
};

const lightColors = {
  ...brandColors,
  surface: '#FFFFFF',
  card: '#F8F8F8',
  text: {
    primary: '#1B2B3B',
    secondary: '#4A5568',
    disabled: '#A0AEC0',
  },
  border: '#E2E8F0',
  error: '#DC2626',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  divider: '#E2E8F0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  ripple: Platform.select({ ios: 'rgba(0, 0, 0, 0.1)', android: '?android:attr/selectableItemBackground' }),
};

const darkColors = {
  ...brandColors,
  surface: '#1B2B3B',
  card: '#2D3748',
  text: {
    primary: '#FFFFFF',
    secondary: '#E2E8F0',
    disabled: '#718096',
  },
  border: '#4A5568',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
  divider: '#4A5568',
  overlay: 'rgba(0, 0, 0, 0.75)',
  ripple: Platform.select({ ios: 'rgba(255, 255, 255, 0.1)', android: '?android:attr/selectableItemBackground' }),
};

const typography = {
  heading: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  body: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    caption: 14,
    small: 12,
  },
  weights: {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

const shadows = Platform.select({
  ios: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
  },
  android: {
    sm: { elevation: 1 },
    md: { elevation: 3 },
    lg: { elevation: 5 },
  },
});

export default {
  light: {
    colors: lightColors,
    typography,
    spacing,
    borderRadius,
    shadows,
  },
  dark: {
    colors: darkColors,
    typography,
    spacing,
    borderRadius,
    shadows,
  },
}; 
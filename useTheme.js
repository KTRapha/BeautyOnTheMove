import { useColorScheme } from 'react-native';
import theme from './theme';

export function useTheme() {
  const colorScheme = useColorScheme();
  return theme[colorScheme ?? 'light'];
}

export function useColors() {
  const { colors } = useTheme();
  return colors;
}

export function useTypography() {
  const { typography } = useTheme();
  return typography;
}

export function useSpacing() {
  const { spacing } = useTheme();
  return spacing;
}

export function useBorderRadius() {
  const { borderRadius } = useTheme();
  return borderRadius;
}

export function useShadows() {
  const { shadows } = useTheme();
  return shadows;
} 
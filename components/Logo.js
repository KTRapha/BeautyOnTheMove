import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, useTypography } from '../useTheme';

export default function Logo() {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();

  return (
    <View style={styles.logoContainer}>
      <Text style={[
        styles.logoText,
        {
          fontSize: sizes.h1,
          fontWeight: weights.bold,
          color: colors.primary,
          letterSpacing: 2,
        }
      ]}>
        BeautyOnTheMove
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    textAlign: 'center',
  },
}); 
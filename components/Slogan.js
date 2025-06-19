import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useColors, useTypography } from '../useTheme';

export default function Slogan({ style }) {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();

  return (
    <View style={styles.container}>
      <Text style={[
        styles.slogan,
        {
          fontSize: sizes.h3,
          fontWeight: weights.semibold,
          color: colors.primary,
          letterSpacing: 1,
        },
        style
      ]}>
        Your Price. <Text style={[styles.accent, { color: colors.accent, fontWeight: weights.bold }]}>Your Place.</Text> Your Style.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    marginVertical: 10 
  },
  slogan: {
    fontStyle: 'italic',
    textAlign: 'center',
  },
  accent: {
    fontWeight: '700',
  },
}); 
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, useTypography } from '../useTheme';

export default function CommissionCalculator({ bookingAmount, showBreakdown = true }) {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  
  const commissionRate = 0.10; // 10%
  const commissionAmount = bookingAmount * commissionRate;
  const technicianEarnings = bookingAmount - commissionAmount;

  if (!showBreakdown) {
    return (
      <View style={styles.simpleContainer}>
        <Text style={[styles.commissionText, { color: colors.text.secondary }]}>
          Platform fee: <Text style={{ color: colors.primary, fontWeight: weights.semibold }}>${commissionAmount.toFixed(2)}</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Payment Breakdown
      </Text>
      
      <View style={styles.breakdownContainer}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Service Amount
          </Text>
          <Text style={[styles.amount, { color: colors.text.primary }]}>
            ${bookingAmount.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.secondary }]}>
            Platform Commission (10%)
          </Text>
          <Text style={[styles.amount, { color: colors.error }]}>
            -${commissionAmount.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.primary, fontWeight: weights.semibold }]}>
            Technician Earnings
          </Text>
          <Text style={[styles.amount, { color: colors.success, fontWeight: weights.bold }]}>
            ${technicianEarnings.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoText, { color: colors.text.secondary }]}>
          💡 Platform commission helps us maintain the service and provide support to both customers and technicians.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginVertical: 8,
  },
  simpleContainer: {
    marginVertical: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  breakdownContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  infoContainer: {
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
  commissionText: {
    fontSize: 14,
  },
}); 
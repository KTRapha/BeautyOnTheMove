import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors, useTypography, useBorderRadius } from '../useTheme';

export default function RevenueAnalyticsScreen({ navigation, route }) {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  const borderRadius = useBorderRadius();
  
  const { userType } = route.params || { userType: 'technician' };
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data - replace with real data from your backend
  const analyticsData = {
    technician: {
      totalEarnings: 2847.50,
      commissionPaid: 316.39,
      netEarnings: 2531.11,
      bookingsCompleted: 45,
      averageBookingValue: 63.28,
      subscriptionRevenue: 0, // Technicians don't pay subscription
      subscriptionCost: 7.50,
      periodData: {
        week: { earnings: 647.20, bookings: 12 },
        month: { earnings: 2847.50, bookings: 45 },
        year: { earnings: 32450.80, bookings: 512 }
      }
    },
    customer: {
      totalSpent: 2847.50,
      commissionPaid: 284.75,
      bookingsMade: 45,
      averageBookingValue: 63.28,
      subscriptionRevenue: 2.50,
      subscriptionCost: 2.50,
      periodData: {
        week: { spent: 647.20, bookings: 12 },
        month: { spent: 2847.50, bookings: 45 },
        year: { spent: 32450.80, bookings: 512 }
      }
    }
  };

  const currentData = analyticsData[userType];
  const periodData = currentData.periodData[selectedPeriod];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRevenueCard = (title, amount, subtitle, icon, color) => (
    <View style={[styles.revenueCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>{title}</Text>
      </View>
      <Text style={[styles.cardAmount, { color: color }]}>{formatCurrency(amount)}</Text>
      <Text style={[styles.cardSubtitle, { color: colors.text.secondary }]}>{subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Revenue Analytics
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                { 
                  backgroundColor: selectedPeriod === period ? colors.primary : colors.surface,
                  borderColor: colors.border
                }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                { color: selectedPeriod === period ? colors.surface : colors.text.primary }
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Revenue Cards */}
        <View style={styles.revenueGrid}>
          {userType === 'technician' ? (
            <>
              {getRevenueCard(
                'Total Earnings',
                periodData.earnings,
                `${periodData.bookings} bookings completed`,
                'cash-multiple',
                colors.success
              )}
              {getRevenueCard(
                'Platform Commission',
                periodData.earnings * 0.10,
                '10% of total bookings',
                'handshake',
                colors.error
              )}
              {getRevenueCard(
                'Net Earnings',
                periodData.earnings * 0.90,
                'After commission deduction',
                'bank',
                colors.primary
              )}
            </>
          ) : (
            <>
              {getRevenueCard(
                'Total Spent',
                periodData.spent,
                `${periodData.bookings} bookings made`,
                'cash-multiple',
                colors.error
              )}
              {getRevenueCard(
                'Platform Fees',
                periodData.spent * 0.10,
                '10% commission paid',
                'handshake',
                colors.warning
              )}
              {getRevenueCard(
                'Subscription Cost',
                currentData.subscriptionCost,
                'Monthly subscription',
                'star',
                colors.info
              )}
            </>
          )}
        </View>

        {/* Detailed Breakdown */}
        <View style={[styles.breakdownSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Detailed Breakdown
          </Text>
          
          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
                Average {userType === 'technician' ? 'Booking Value' : 'Spending per Booking'}
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
                {formatCurrency(currentData.averageBookingValue)}
              </Text>
            </View>
          </View>

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
                Total {userType === 'technician' ? 'Bookings' : 'Bookings Made'}
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.text.primary }]}>
                {periodData.bookings}
              </Text>
            </View>
          </View>

          {userType === 'technician' && (
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: colors.text.secondary }]}>
                  Subscription Cost
                </Text>
                <Text style={[styles.breakdownValue, { color: colors.error }]}>
                  -{formatCurrency(currentData.subscriptionCost)}
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.breakdownItem}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.text.primary, fontWeight: weights.semibold }]}>
                Net {userType === 'technician' ? 'Earnings' : 'Spending'}
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.success, fontWeight: weights.bold }]}>
                {userType === 'technician' 
                  ? formatCurrency(periodData.earnings * 0.90 - currentData.subscriptionCost)
                  : formatCurrency(periodData.spent + currentData.subscriptionCost)
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={[styles.insightsSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Insights
          </Text>
          
          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="trending-up" size={20} color={colors.success} />
            <Text style={[styles.insightText, { color: colors.text.secondary }]}>
              {userType === 'technician' 
                ? `You're earning ${formatCurrency(currentData.averageBookingValue * 0.90)} per booking on average`
                : `You're spending ${formatCurrency(currentData.averageBookingValue)} per booking on average`
              }
            </Text>
          </View>

          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="calendar" size={20} color={colors.info} />
            <Text style={[styles.insightText, { color: colors.text.secondary }]}>
              {periodData.bookings} bookings this {selectedPeriod}
            </Text>
          </View>

          <View style={styles.insightItem}>
            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} />
            <Text style={[styles.insightText, { color: colors.text.secondary }]}>
              {userType === 'technician' 
                ? 'Your earnings are growing steadily'
                : 'Your spending is within normal range'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  periodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  revenueGrid: {
    gap: 15,
    marginBottom: 20,
  },
  revenueCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  cardAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  breakdownSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  breakdownItem: {
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  insightsSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  insightText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
}); 
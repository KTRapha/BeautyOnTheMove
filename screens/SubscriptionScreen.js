import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors, useTypography, useBorderRadius, useSpacing } from '../useTheme';

export default function SubscriptionScreen({ navigation, route }) {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  const borderRadius = useBorderRadius();
  const spacing = useSpacing();
  
  const { userType } = route.params || { userType: 'customer' }; // 'customer' or 'technician'
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const subscriptionPlans = {
    customer: {
      title: 'Customer Subscription',
      description: 'Unlock premium features and get exclusive benefits',
      plans: [
        {
          id: 'monthly',
          name: 'Monthly Plan',
          price: '$2.50',
          originalPrice: '$5.00',
          period: 'per month',
          features: [
            'Unlimited service requests',
            'Priority booking',
            'Exclusive discounts',
            'Premium customer support',
            'No booking fees',
            'Cancel anytime'
          ],
          popular: false
        },
        {
          id: 'yearly',
          name: 'Yearly Plan',
          price: '$25.00',
          originalPrice: '$60.00',
          period: 'per year',
          features: [
            'All monthly features',
            '2 months free',
            'Early access to new features',
            'VIP customer status',
            'Free cancellation insurance'
          ],
          popular: true
        }
      ]
    },
    technician: {
      title: 'Technician Subscription',
      description: 'Grow your business with premium tools and features',
      plans: [
        {
          id: 'monthly',
          name: 'Monthly Plan',
          price: '$7.50',
          originalPrice: '$15.00',
          period: 'per month',
          features: [
            'Unlimited bookings',
            'Advanced analytics',
            'Priority customer matching',
            'Professional profile tools',
            'Marketing support',
            'Cancel anytime'
          ],
          popular: false
        },
        {
          id: 'yearly',
          name: 'Yearly Plan',
          price: '$75.00',
          originalPrice: '$180.00',
          period: 'per year',
          features: [
            'All monthly features',
            '2 months free',
            'Premium customer leads',
            'Business growth tools',
            'Free insurance coverage',
            'Dedicated support'
          ],
          popular: true
        }
      ]
    }
  };

  const currentPlan = subscriptionPlans[userType];

  const handleSubscribe = (plan) => {
    Alert.alert(
      'Start Free Trial',
      `Start your free 1-month trial of the ${plan.name}? You can cancel anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Trial', 
          onPress: () => {
            // TODO: Implement subscription logic
            Alert.alert('Success', 'Your free trial has started!');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleRestore = () => {
    Alert.alert('Restore Purchases', 'Restoring your previous purchases...');
    // TODO: Implement restore purchases logic
  };

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
            {currentPlan.title}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Description */}
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          {currentPlan.description}
        </Text>

        {/* Free Trial Banner */}
        <View style={[styles.trialBanner, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="gift" size={24} color={colors.surface} />
          <Text style={[styles.trialText, { color: colors.surface }]}>
            Start with 1 month FREE trial
          </Text>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {currentPlan.plans.map((plan) => (
            <View 
              key={plan.id}
              style={[
                styles.planCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: selectedPlan === plan.id ? colors.primary : colors.border,
                  borderWidth: selectedPlan === plan.id ? 2 : 1,
                }
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.popularText, { color: colors.surface }]}>
                    Most Popular
                  </Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <Text style={[styles.planName, { color: colors.text.primary }]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.originalPrice, { color: colors.text.disabled }]}>
                    {plan.originalPrice}
                  </Text>
                </View>
                <Text style={[styles.period, { color: colors.text.secondary }]}>
                  {plan.period}
                </Text>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={20} 
                      color={colors.success} 
                    />
                    <Text style={[styles.featureText, { color: colors.text.primary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  { backgroundColor: colors.primary }
                ]}
                onPress={() => handleSubscribe(plan)}
              >
                <Text style={[styles.subscribeButtonText, { color: colors.surface }]}>
                  Start Free Trial
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Restore Purchases */}
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={[styles.restoreText, { color: colors.primary }]}>
            Restore Purchases
          </Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.termsText, { color: colors.text.disabled }]}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.
        </Text>
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    gap: 10,
  },
  trialText: {
    fontSize: 16,
    fontWeight: '600',
  },
  plansContainer: {
    gap: 20,
    marginBottom: 30,
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  period: {
    fontSize: 14,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  subscribeButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
}); 
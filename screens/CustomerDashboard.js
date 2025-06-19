import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColors, useTypography, useBorderRadius } from '../useTheme';

const CustomerDashboard = ({ navigation }) => {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  const borderRadius = useBorderRadius();
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeRequests, setActiveRequests] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const createServiceRequest = () => {
    navigation.navigate('CreateServiceRequest');
  };

  const viewRequestDetails = (requestId) => {
    navigation.navigate('RequestDetails', { requestId });
  };

  const viewBookingDetails = (bookingId) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  const openSubscription = () => {
    navigation.navigate('Subscription', { userType: 'customer' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Welcome back!</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Find beauty services near you</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={createServiceRequest}
          >
            <Text style={[styles.primaryButtonText, { color: colors.surface }]}>➕ Create Service Request</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => navigation.navigate('BrowseTechnicians')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>🔍 Browse Technicians</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription & Analytics */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Premium Features</Text>
          <TouchableOpacity
            style={[styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={openSubscription}
          >
            <MaterialCommunityIcons name="star" size={24} color={colors.accent} />
            <Text style={[styles.premiumTitle, { color: colors.text.primary }]}>Subscription</Text>
            <Text style={[styles.premiumSubtitle, { color: colors.text.secondary }]}>$2.50/month</Text>
            <Text style={[styles.premiumDescription, { color: colors.text.secondary }]}>
              Unlock premium features and exclusive benefits
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Requests */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Active Requests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyRequests')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {activeRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>No active requests</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.text.disabled }]}>
                Create a service request to find beauty technicians near you
              </Text>
            </View>
          ) : (
            activeRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={[styles.requestCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}
                onPress={() => viewRequestDetails(request.id)}
              >
                <View style={styles.requestHeader}>
                  <Text style={[styles.requestTitle, { color: colors.text.primary }]}>{request.service}</Text>
                  <Text style={[styles.requestStatus, { color: colors.primary, backgroundColor: colors.card }]}>{request.status}</Text>
                </View>
                <Text style={[styles.requestLocation, { color: colors.text.secondary }]}>📍 {request.location}</Text>
                <Text style={[styles.requestBudget, { color: colors.text.secondary }]}>💰 ${request.budget}</Text>
                <Text style={[styles.requestTime, { color: colors.text.disabled }]}>{request.createdAt}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Upcoming Bookings */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Upcoming Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyBookings')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>No upcoming bookings</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.text.disabled }]}>
                Your confirmed appointments will appear here
              </Text>
            </View>
          ) : (
            upcomingBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={[styles.bookingCard, { backgroundColor: colors.card, borderLeftColor: colors.success }]}
                onPress={() => viewBookingDetails(booking.id)}
              >
                <View style={styles.bookingHeader}>
                  <Text style={[styles.bookingTitle, { color: colors.text.primary }]}>{booking.service}</Text>
                  <Text style={[styles.bookingStatus, { color: colors.success, backgroundColor: colors.card }]}>{booking.status}</Text>
                </View>
                <Text style={[styles.bookingTechnician, { color: colors.text.secondary }]}>👩‍💼 {booking.technician}</Text>
                <Text style={[styles.bookingLocation, { color: colors.text.secondary }]}>📍 {booking.location}</Text>
                <Text style={[styles.bookingTime, { color: colors.text.disabled }]}>🕒 {booking.dateTime}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
          <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.activityText, { color: colors.text.secondary }]}>📱 App opened</Text>
            <Text style={[styles.activityTime, { color: colors.text.disabled }]}>2 minutes ago</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  quickActions: {
    padding: 20,
    gap: 15,
  },
  primaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
  },
  premiumCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  requestCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  requestLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  requestBudget: {
    fontSize: 14,
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
  },
  bookingCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookingStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bookingTechnician: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingTime: {
    fontSize: 14,
  },
  activityCard: {
    padding: 15,
    borderRadius: 10,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 12,
  },
});

export default CustomerDashboard; 
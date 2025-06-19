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

const TechnicianDashboard = ({ navigation }) => {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  const borderRadius = useBorderRadius();
  
  const [refreshing, setRefreshing] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [serviceRadius, setServiceRadius] = useState(10); // km

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    Alert.alert(
      isOnline ? 'Going Offline' : 'Going Online',
      isOnline 
        ? 'You will no longer receive new requests' 
        : 'You are now available for new requests'
    );
  };

  const viewRequestDetails = (requestId) => {
    navigation.navigate('RequestDetails', { requestId });
  };

  const acceptRequest = (requestId) => {
    Alert.alert(
      'Accept Request',
      'Are you sure you want to accept this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            // Handle accept logic
            Alert.alert('Success', 'Request accepted! Customer will be notified.');
          }
        }
      ]
    );
  };

  const declineRequest = (requestId) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Decline', 
          onPress: () => {
            // Handle decline logic
            Alert.alert('Request Declined', 'The customer will be notified.');
          }
        }
      ]
    );
  };

  const viewBookingDetails = (bookingId) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  const openSubscription = () => {
    navigation.navigate('Subscription', { userType: 'technician' });
  };

  const openAnalytics = () => {
    navigation.navigate('RevenueAnalytics', { userType: 'technician' });
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
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Technician Dashboard</Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('TechnicianProfile')}
          >
            <Text style={styles.profileButtonText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Online Status */}
        <View style={[styles.statusSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.statusTitle, { color: colors.text.primary }]}>Availability Status</Text>
            <TouchableOpacity
              style={[
                styles.statusToggle,
                { 
                  backgroundColor: isOnline ? colors.success : colors.error,
                  opacity: 0.8
                }
              ]}
              onPress={toggleOnlineStatus}
            >
              <Text style={[styles.statusToggleText, { color: colors.surface }]}>
                {isOnline ? '🟢 Online' : '🔴 Offline'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.statusSubtext, { color: colors.text.secondary }]}>
            Service radius: {serviceRadius}km from your location
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('MySchedule')}
          >
            <Text style={[styles.primaryButtonText, { color: colors.surface }]}>📅 My Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}
            onPress={() => navigation.navigate('ServiceSettings')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>⚙️ Service Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription & Analytics */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Business Tools</Text>
          <View style={styles.premiumGrid}>
            <TouchableOpacity
              style={[styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={openSubscription}
            >
              <MaterialCommunityIcons name="star" size={24} color={colors.accent} />
              <Text style={[styles.premiumTitle, { color: colors.text.primary }]}>Subscription</Text>
              <Text style={[styles.premiumSubtitle, { color: colors.text.secondary }]}>$7.50/month</Text>
              <Text style={[styles.premiumDescription, { color: colors.text.secondary }]}>
                Premium tools to grow your business
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={openAnalytics}
            >
              <MaterialCommunityIcons name="chart-line" size={24} color={colors.info} />
              <Text style={[styles.premiumTitle, { color: colors.text.primary }]}>Analytics</Text>
              <Text style={[styles.premiumSubtitle, { color: colors.text.secondary }]}>Track earnings</Text>
              <Text style={[styles.premiumDescription, { color: colors.text.secondary }]}>
                View your earnings and performance
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Incoming Requests */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Incoming Requests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllRequests')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {incomingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>No incoming requests</Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.text.disabled }]}>
                {isOnline 
                  ? 'New requests in your area will appear here' 
                  : 'Go online to receive new requests'
                }
              </Text>
            </View>
          ) : (
            incomingRequests.map((request) => (
              <View key={request.id} style={[styles.requestCard, { backgroundColor: colors.card, borderLeftColor: colors.warning }]}>
                <View style={styles.requestHeader}>
                  <Text style={[styles.requestTitle, { color: colors.text.primary }]}>{request.service}</Text>
                  <Text style={[styles.requestDistance, { color: colors.warning, backgroundColor: colors.card }]}>📍 {request.distance}km away</Text>
                </View>
                <Text style={[styles.requestCustomer, { color: colors.text.secondary }]}>👤 {request.customerName}</Text>
                <Text style={[styles.requestLocation, { color: colors.text.secondary }]}>📍 {request.location}</Text>
                <Text style={[styles.requestBudget, { color: colors.text.secondary }]}>💰 ${request.budget}</Text>
                <Text style={[styles.requestTime, { color: colors.text.secondary }]}>🕒 {request.requestedTime}</Text>
                <Text style={[styles.requestDescription, { color: colors.text.secondary }]}>{request.description}</Text>
                
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.acceptButton, { backgroundColor: colors.success }]}
                    onPress={() => acceptRequest(request.id)}
                  >
                    <Text style={[styles.acceptButtonText, { color: colors.surface }]}>✅ Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.declineButton, { backgroundColor: colors.error }]}
                    onPress={() => declineRequest(request.id)}
                  >
                    <Text style={[styles.declineButtonText, { color: colors.surface }]}>❌ Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
                <Text style={[styles.bookingCustomer, { color: colors.text.secondary }]}>👤 {booking.customerName}</Text>
                <Text style={[styles.bookingLocation, { color: colors.text.secondary }]}>📍 {booking.location}</Text>
                <Text style={[styles.bookingTime, { color: colors.text.secondary }]}>🕒 {booking.dateTime}</Text>
                <Text style={[styles.bookingEarnings, { color: colors.success }]}>💰 ${booking.earnings}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Earnings Summary */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>This Month's Earnings</Text>
          <View style={[styles.earningsCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.earningsAmount, { color: colors.success }]}>$2,847.50</Text>
            <Text style={[styles.earningsLabel, { color: colors.text.secondary }]}>Total Earnings</Text>
            <Text style={[styles.earningsDetails, { color: colors.text.disabled }]}>
              45 bookings completed • $63.28 average per booking
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 10,
    borderRadius: 20,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusToggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusSubtext: {
    fontSize: 14,
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
  premiumGrid: {
    flexDirection: 'row',
    gap: 15,
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
    marginBottom: 15,
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
  requestDistance: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  requestCustomer: {
    fontSize: 14,
    marginBottom: 4,
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
    fontSize: 14,
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  declineButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
  bookingCustomer: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingTime: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookingEarnings: {
    fontSize: 14,
    fontWeight: '600',
  },
  earningsCard: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  earningsLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  earningsDetails: {
    fontSize: 14,
  },
});

export default TechnicianDashboard; 
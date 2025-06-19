import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateServiceRequest = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    description: '',
    budget: '',
    location: '',
    radius: '10', // km - maximum allowed
    preferredDate: '',
    preferredTime: '',
  });

  const [selectedService, setSelectedService] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const beautyServices = [
    { id: 1, name: 'Hair Styling', icon: 'hair-dryer', price: '50-150' },
    { id: 2, name: 'Makeup', icon: 'face-woman', price: '80-200' },
    { id: 3, name: 'Nail Art', icon: 'hand-front', price: '30-100' },
    { id: 4, name: 'Facial', icon: 'face-woman-shimmer', price: '60-150' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Simulate getting current location
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY'
      });
      setFormData(prev => ({ ...prev, location: 'New York, NY' }));
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  };

  const selectService = (service) => {
    setSelectedService(service);
    setFormData(prev => ({ 
      ...prev, 
      service: service.name,
      budget: service.price.split('-')[1] // Set max price as default
    }));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.service) {
      Alert.alert('Error', 'Please select a service');
      return false;
    }
    if (!formData.description) {
      Alert.alert('Error', 'Please add a description');
      return false;
    }
    if (!formData.budget) {
      Alert.alert('Error', 'Please set your budget');
      return false;
    }
    if (!formData.location) {
      Alert.alert('Error', 'Please set your location');
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Request Submitted!',
        'Your service request has been sent to technicians in your area. You will be notified when someone accepts.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerDashboard')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Service Request</Text>
        </View>

        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <View style={styles.serviceGrid}>
            {beautyServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  formData.service === service.name && styles.serviceCardSelected,
                ]}
                onPress={() => updateFormData('service', service.name)}
              >
                <MaterialCommunityIcons 
                  name={service.icon} 
                  size={24} 
                  color={formData.service === service.name ? '#007AFF' : '#666'} 
                />
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you need (e.g., 'I need a professional makeup artist for my wedding')"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Budget (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your budget"
            value={formData.budget}
            onChangeText={(text) => updateFormData('budget', text)}
            keyboardType="numeric"
          />
        </View>

        {/* Location & Radius */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Radius</Text>
          
          <Text style={styles.label}>Your Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address or use current location"
            value={formData.location}
            onChangeText={(text) => updateFormData('location', text)}
          />
          
          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <Text style={styles.locationButtonText}>📍 Use Current Location</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Search Radius (km)</Text>
          <View style={styles.radiusSelector}>
            {['5', '10'].map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.radiusButton,
                  formData.radius === radius && styles.radiusButtonSelected
                ]}
                onPress={() => updateFormData('radius', radius)}
              >
                <Text style={[
                  styles.radiusButtonText,
                  formData.radius === radius && styles.radiusButtonTextSelected
                ]}>
                  {radius}km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferred Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time</Text>
          
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            value={formData.preferredDate}
            onChangeText={(text) => updateFormData('preferredDate', text)}
          />

          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2:00 PM"
            value={formData.preferredTime}
            onChangeText={(text) => updateFormData('preferredTime', text)}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={submitRequest}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.submitInfo}>
            Your request will be sent to technicians within {formData.radius}km of your location
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 12,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  locationButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  radiusSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radiusButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e3f2fd',
  },
  radiusButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  radiusButtonTextSelected: {
    color: '#007AFF',
  },
  submitSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CreateServiceRequest; 
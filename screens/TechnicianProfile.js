import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TechnicianProfile = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    bio: 'Professional makeup artist with 5+ years of experience specializing in bridal and event makeup. Certified in advanced techniques and passionate about making every client feel beautiful.',
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    experience: '5 years',
    rating: '4.8',
    totalBookings: '127',
  });

  const [services, setServices] = useState([
    { id: 1, name: 'Hair Styling', enabled: true, price: '80-120' },
    { id: 2, name: 'Makeup', enabled: true, price: '100-180' },
    { id: 3, name: 'Nail Art', enabled: false, price: '40-80' },
    { id: 4, name: 'Facial', enabled: true, price: '70-120' },
  ]);

  const [photos, setPhotos] = useState([
    { id: 1, uri: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Work+1', uploaded: true },
    { id: 2, uri: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Work+2', uploaded: true },
    { id: 3, uri: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Work+3', uploaded: true },
    { id: 4, uri: null, uploaded: false },
    { id: 5, uri: null, uploaded: false },
  ]);

  const [serviceRadius, setServiceRadius] = useState(10); // km - maximum allowed

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId) => {
    setServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, enabled: !service.enabled }
          : service
      )
    );
  };

  const addPhoto = () => {
    const availableSlot = photos.find(photo => !photo.uploaded);
    if (availableSlot) {
      // Simulate photo upload
      Alert.alert(
        'Add Photo',
        'Select photo from gallery or take a new photo',
        [
          { text: 'Gallery', onPress: () => simulatePhotoUpload(availableSlot.id) },
          { text: 'Camera', onPress: () => simulatePhotoUpload(availableSlot.id) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert('Photo Limit', 'You can upload up to 5 photos maximum.');
    }
  };

  const simulatePhotoUpload = (photoId) => {
    setLoading(true);
    setTimeout(() => {
      setPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId 
            ? { 
                ...photo, 
                uri: `https://via.placeholder.com/300x200/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=Work+${photoId}`, 
                uploaded: true 
              }
            : photo
        )
      );
      setLoading(false);
      Alert.alert('Success', 'Photo uploaded successfully!');
    }, 2000);
  };

  const removePhoto = (photoId) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => 
              prev.map(photo => 
                photo.id === photoId 
                  ? { ...photo, uri: null, uploaded: false }
                  : photo
              )
            );
          }
        }
      ]
    );
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={saveProfile} disabled={loading}>
            <Text style={styles.saveButton}>{loading ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.name}
            onChangeText={(text) => updateProfileData('name', text)}
            placeholder="Enter your full name"
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.textArea}
            value={profileData.bio}
            onChangeText={(text) => updateProfileData('bio', text)}
            placeholder="Tell customers about your experience, specialties, and what makes you unique..."
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profileData.phone}
            onChangeText={(text) => updateProfileData('phone', text)}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(text) => updateProfileData('email', text)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Portfolio Photos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio Photos</Text>
            <Text style={styles.photoCount}>{photos.filter(p => p.uploaded).length}/5</Text>
          </View>
          
          <Text style={styles.sectionSubtext}>
            Upload up to 5 photos of your work to showcase your skills
          </Text>

          <View style={styles.photoGrid}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoContainer}>
                {photo.uploaded ? (
                  <View style={styles.photoWrapper}>
                    <Image source={{ uri: photo.uri }} style={styles.photo} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => removePhoto(photo.id)}
                    >
                      <Text style={styles.removePhotoText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addPhotoButton}
                    onPress={addPhoto}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#007AFF" />
                    ) : (
                      <>
                        <Text style={styles.addPhotoIcon}>+</Text>
                        <Text style={styles.addPhotoText}>Add Photo</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Services</Text>
          <Text style={styles.sectionSubtext}>
            Select which services you offer and set your pricing
          </Text>

          {services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>${service.price}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.serviceToggle,
                  service.enabled && styles.serviceToggleActive
                ]}
                onPress={() => toggleService(service.id)}
              >
                <Text style={styles.serviceToggleText}>
                  {service.enabled ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Service Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Settings</Text>
          
          <Text style={styles.label}>Service Radius (km)</Text>
          <Text style={styles.radiusInfo}>Maximum: 10km</Text>
          <View style={styles.radiusSelector}>
            {['5', '10'].map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.radiusButton,
                  serviceRadius === parseInt(radius) && styles.radiusButtonSelected
                ]}
                onPress={() => setServiceRadius(parseInt(radius))}
              >
                <Text style={[
                  styles.radiusButtonText,
                  serviceRadius === parseInt(radius) && styles.radiusButtonTextSelected
                ]}>
                  {radius}km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profileData.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profileData.rating}★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profileData.totalBookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
          </View>
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
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  photoCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: '48%',
    marginBottom: 10,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: {
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 5,
  },
  addPhotoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: '#666',
  },
  serviceToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceToggleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  serviceToggleText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  radiusInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default TechnicianProfile; 
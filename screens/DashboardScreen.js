import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slogan from '../components/Slogan';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Slogan style={{ fontSize: 18, marginBottom: 10 }} />
      <Text style={styles.title}>Welcome to BeautyOnTheMove!</Text>
      <Text style={styles.subtitle}>Your Beauty On The Move Dashboard</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#888' },
}); 
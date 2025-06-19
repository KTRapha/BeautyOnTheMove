import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import api from '../api';
import Logo from '../components/Logo';
import Slogan from '../components/Slogan';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useColors, useTypography, useBorderRadius } from '../useTheme';

export default function LoginScreen({ navigation }) {
  const { colors } = useColors();
  const { sizes, weights } = useTypography();
  const borderRadius = useBorderRadius();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('customer'); // 'customer' or 'technician'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setError('');
      setLoading(false);
      if (userRole === 'customer') {
        navigation.replace('CustomerDashboard');
      } else {
        navigation.replace('TechnicianDashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register', { userRole });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Logo />
          <Slogan />
        </View>

        <View style={styles.roleSelector}>
          <Text style={[styles.roleTitle, { color: colors.text.primary }]}>I am a:</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: userRole === 'customer' ? colors.primary : colors.border 
                },
                userRole === 'customer' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setUserRole('customer')}
            >
              <Text style={[
                styles.roleButtonText,
                { color: userRole === 'customer' ? colors.surface : colors.text.primary }
              ]}>
                👤 Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: userRole === 'technician' ? colors.primary : colors.border 
                },
                userRole === 'technician' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setUserRole('technician')}
            >
              <Text style={[
                styles.roleButtonText,
                { color: userRole === 'technician' ? colors.surface : colors.text.primary }
              ]}>
                💄 Beauty Technician
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text.primary,
              }
            ]}
            placeholder="Email"
            placeholderTextColor={colors.text.disabled}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[
                styles.input,
                { 
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text.primary,
                }
              ]}
              placeholder="Password"
              placeholderTextColor={colors.text.disabled}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.showBtn}>
              <Text style={{ color: colors.primary }}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: colors.primary },
              loading && { opacity: 0.7 }
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={[styles.loginButtonText, { color: colors.surface }]}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={[styles.registerButtonText, { color: colors.primary }]}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  roleSelector: {
    marginBottom: 30,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 15,
  },
  input: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  showBtn: {
    padding: 10,
  },
  error: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loginButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    alignItems: 'center',
    marginTop: 5,
  },
  registerButtonText: {
    fontSize: 16,
  },
}); 
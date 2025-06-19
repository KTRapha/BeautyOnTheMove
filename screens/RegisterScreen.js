import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../api';
import Logo from '../components/Logo';
import Slogan from '../components/Slogan';
import theme from '../theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      setError('');
      setLoading(false);
      navigation.navigate('Login');
    } catch (err) {
      setError('Registration failed');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Logo />
        <Slogan />
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.showBtn}>
            <Text style={{ color: theme.colors.primary }}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginBottom: 10 }} />
        ) : (
          <Button title="Register" color={theme.colors.primary} onPress={handleRegister} />
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: theme.colors.primary },
  input: { borderWidth: 1, borderColor: theme.colors.border, marginBottom: 10, padding: 10, borderRadius: 5, backgroundColor: '#fff' },
  error: { color: theme.colors.error, marginBottom: 10, textAlign: 'center' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  showBtn: { marginLeft: 10 },
  linkBtn: { marginTop: 15, alignItems: 'center' },
  linkText: { color: theme.colors.secondary },
}); 
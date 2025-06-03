import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.0.104:5000';

const base64Decode = (str) => {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return '';
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!email || !password) {
      setMessage('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      await AsyncStorage.setItem('token', data.token);
      const tokenParts = data.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(base64Decode(tokenParts[1]));
        if (payload.exp) {
          await AsyncStorage.setItem('tokenExpiration', payload.exp.toString());
        }
      }

      setMessage('');
      router.replace('/(tabs)');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.glass}>
          <Text style={styles.title}>Welcome Back!</Text>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#555"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#555"
          />

          <TouchableOpacity
            style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
            onPress={login}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#d0ff2f" />
            ) : (
              <Text style={styles.buttonTextPrimary}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New here?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}> Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#d0ff2f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)', // frosted glass look
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderColor: '#0d4d3a',
    borderWidth: 1.2,
    shadowColor: '#0d4d3a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0d4d3a',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    color: '#0d4d3a',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0d4d3a',
  },
  message: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  buttonPrimary: {
    backgroundColor: '#0d4d3a',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#356b4a',
  },
  buttonTextPrimary: {
    color: '#d0ff2f',
    fontWeight: '700',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#0d4d3a',
    fontSize: 15,
  },
  registerLink: {
    color: '#00eaff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default Login;

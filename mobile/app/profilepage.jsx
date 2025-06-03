import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import bg from './../assets/images/bg1.jpg';

const API_BASE_URL = 'http://192.168.0.104:5000';
const { width, height } = Dimensions.get('window');

export default function ProfilePage() {
  const [discordName, setDiscordName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return setMessage('No user token found');

        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
        const userId = payload._id;

        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setDiscordName(data.discordName || '');
          setAvatarUrl(data.avatarUrl || '');
        } else {
          setMessage(data.message || 'Profile fetch failed');
        }
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!discordName) return setMessage('Discord name is required');

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
      const userId = payload._id;

      const response = await fetch(`${API_BASE_URL}/profile/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, discordName, avatarUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage('Profile saved successfully');
      setTimeout(() => router.replace('/'), 1000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={bg} style={styles.background} resizeMode="cover" blurRadius={5}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.glass}>
          <Text style={styles.title}>Edit Profile</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Discord Name"
            placeholderTextColor="#aaa"
            value={discordName}
            onChangeText={setDiscordName}
          />
          <TextInput
            style={styles.input}
            placeholder="Avatar URL (optional)"
            placeholderTextColor="#aaa"
            value={avatarUrl}
            onChangeText={setAvatarUrl}
          />

          <TouchableOpacity
            style={[styles.buttonPrimary, loading && styles.buttonDisabled]}
            onPress={saveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonTextPrimary}>Save Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#116a5a',
    padding: 10,
    borderRadius: 30,
    zIndex: 99,
  },
  glass: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 25,
    borderRadius: 20,
    borderColor: '#116a5a',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#116a5a',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  message: {
    color: '#ff6666',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonPrimary: {
    backgroundColor: '#116a5a',
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
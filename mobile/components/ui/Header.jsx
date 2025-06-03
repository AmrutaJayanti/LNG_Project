import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import logo from './../../assets/images/Logo.png';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const API_BASE_URL = 'http://192.168.0.104:5000';
const DEFAULT_AVATAR = 'https://api.dicebear.com/9.x/pixel-art/svg?seed=AMRUTA';

const Header = () => {
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return;

        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf-8'));
        const userId = payload._id;

        const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
        const data = await response.json();

        if (response.ok && data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity
        style={styles.avatarContainer}
        onPress={() => router.push('/profilepage')}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#116a5a',
    borderBottomWidth: 1,
    borderBottomColor: '#116a5a',
    elevation: 4,
  },
  logo: {
    width: 130,
    height: 65,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#116a5a',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});

export default Header;
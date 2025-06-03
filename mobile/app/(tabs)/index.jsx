// app/(tabs)/index.jsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import Header from '../../components/ui/Header';
import chatimg from '../../assets/images/chat.jpg';
import funimg from '../../assets/images/fun.png';

const { width } = Dimensions.get('window');

const carouselItems = [
  { id: 1, image: chatimg, key: 'chat', title: 'Chat with Friends' },
  { id: 2, image: funimg, key: 'games', title: 'Play Games' },
  { id: 3, image: funimg, key: 'fun', title: 'Have Fun' },
];

const DashboardHome = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');
        if (!token || !tokenExpiration || Date.now() / 1000 >= parseInt(tokenExpiration)) {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('tokenExpiration');
          router.replace('/login');
        }
      } catch {
        router.replace('/login');
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const inviteFriend = () => {
    console.log('Invite Friends');
  };

  const navigateToSlide = (key) => {
    if (key === 'chat') {
      router.push('/chat');
    } else {
      router.push('/games');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header navigation={router} />
      </View>

      <View style={styles.content}>
        {carouselItems.length > 0 ? (
          <View style={styles.carouselContainer}>
            <TouchableOpacity
              style={styles.carouselTouchable}
              onPress={() => navigateToSlide(carouselItems[currentIndex].key)}
              activeOpacity={0.85}
            >
              <Animated.View style={[styles.carouselItem, { transform: [{ scale: scaleAnim }] }]}>
                <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
                  <Image
                    source={carouselItems[currentIndex].image}
                    style={styles.carouselImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.carouselTitle}>{carouselItems[currentIndex].title}</Text>
                </BlurView>
              </Animated.View>
            </TouchableOpacity>

            <View style={styles.pagination}>
              {carouselItems.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive,
                  ]}
                  onPress={() => setCurrentIndex(index)}
                />
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>No carousel items available</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={inviteFriend}
        activeOpacity={0.8}
      >
        <Ionicons name="person-add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0ff2f', // Light gray background similar to login/register
  },
  header: {
    height: 60,
    backgroundColor: '#116a5a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#0f5c4a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  carouselContainer: {
    alignItems: 'center',
    width: '90%',
  },
  carouselTouchable: {
    width: '100%',
    alignItems: 'center',
  },
  carouselItem: {
    height: 240,
    width: width * 0.85,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 106, 85, 0.1)', // #116a5a with transparency
    paddingVertical: 20,
    width: '100%',
  },
  carouselImage: {
    width: '70%',
    height: 130,
    marginBottom: 15,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#116a5a',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c7c7cc',
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: '#116a5a',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70,
    alignSelf: 'center',
    backgroundColor: '#116a5a',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DashboardHome;

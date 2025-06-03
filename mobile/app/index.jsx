import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import logo from '../assets/images/Logo.png';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.heading}>Live Networks & Games</Text>
            <Text style={styles.para}>Games & Socializing</Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/register')}
              accessibilityLabel="Register for an account"
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
              accessibilityLabel="Log in to your account"
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width,
    height,
  },
  background: {
    flex: 1,
    backgroundColor: '#d0ff2f',
    width,
    height,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.3,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 36,
    color: '#0d4d3a',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  para: {
    color: '#0d4d3a',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: 'white',
    width: 250,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0d4d3a',
  },
  loginButton: {
    backgroundColor: '#0d4d3a',
    width: 250,
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'white'
  },
  registerText: {
    fontSize: 18,
    color: '#145a45',
    fontWeight: '600',
  },
  loginText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});

export default Home;

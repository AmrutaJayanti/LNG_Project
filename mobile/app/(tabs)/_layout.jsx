// app/(tabs)/_layout.jsx
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ffffff', // Changed to white for better contrast
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white
        tabBarStyle: {
          backgroundColor: '#116a5a', // Solid color instead of rgba
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          borderTopWidth: 0, // Remove default border
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(games)"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gamers"
        options={{
          title: 'Gamers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
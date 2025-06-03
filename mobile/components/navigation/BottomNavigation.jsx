import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons'
import Dashboard from './../../app/Dashboard'
import Chat from './../../app/Chat'

// Placeholder components for Games and Gamers tabs
const Games = () => (
  <></> // Replace with your actual Games component
);
const Gamers = () => (
  <></> // Replace with your actual Gamers component
);

const Tab = createBottomTabNavigator();

const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#116a5a',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Chat':
              iconName = 'chatbubble-outline';
              break;
            case 'Games':
              iconName = 'game-controller-outline';
              break;
            case 'Gamers':
              iconName = 'people-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Games" component={Games} />
      <Tab.Screen name="Gamers" component={Gamers} />
    </Tab.Navigator>
  );
};

export default DashboardTabs;

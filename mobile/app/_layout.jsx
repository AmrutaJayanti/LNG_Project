// app/_layout.jsx
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '../hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        

        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        
        <Stack.Screen name="profilepage" />
      </Stack>
    </ThemeProvider>
  );
}
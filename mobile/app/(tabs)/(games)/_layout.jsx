import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Ludo Game' }} />
        <Stack.Screen name="game/[roomId]" options={{ title: 'Game Room' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
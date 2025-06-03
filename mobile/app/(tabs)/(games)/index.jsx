import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import io from 'socket.io-client';

const BACKEND_URL = 'http://192.168.0.104:5000';
const socket = io(BACKEND_URL, { autoConnect: false });

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Socket event listeners
    socket.on('room-created', ({ roomId, player }) => {
      router.push(`/game/${roomId}?playerColor=${player.color}&playerName=${playerName}`);
    });

    socket.on('error', ({ message }) => {
      Alert.alert('Error', message);
    });

    socket.on('joined-successfully', ({ player, roomId }) => {
      router.push(`/game/${roomId}?playerColor=${player.color}&playerName=${playerName}`);
    });

    return () => {
      // Cleanup listeners on component unmount
      socket.off('room-created');
      socket.off('error');
      socket.off('joined-successfully');
    };
  }, [playerName, router]);

  const createRoom = () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    socket.connect();
    socket.emit('create-room', { playerName });
  };

  const joinRoom = () => {
    if (!roomId.trim() || !playerName.trim()) {
      Alert.alert('Error', 'Please enter room ID and your name');
      return;
    }
    socket.connect();
    socket.emit('join-room', { roomId: roomId.toUpperCase(), playerName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ludo Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Room Code"
        value={roomId}
        onChangeText={setRoomId}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create Room" onPress={createRoom} />
        <Button title="Join Room" onPress={joinRoom} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
});
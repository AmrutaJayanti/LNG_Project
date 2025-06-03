//app/(tabs)/(games)/game/[roomId]
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import io from 'socket.io-client';
import Board from '@components/ui/Board';
import Dice from '@components/ui/Dice';
import Chat from '@components/ui/Chat';
const BACKEND_URL = 'http://192.168.0.104:5000'


const socket = io(BACKEND_URL);

export default function Game() {
  const { roomId, playerColor, playerName } = useLocalSearchParams();
  const router = useRouter();
  const [gameState, setGameState] = useState({
    players: [],
    positions: {},
    currentTurn: '',
    diceValue: null,
  });

  useEffect(() => {
    socket.on('game-start', ({ players, startingPlayer }) => {
      setGameState((prev) => ({ ...prev, players, currentTurn: startingPlayer }));
    });
    socket.on('dice-rolled', ({ player, diceValue }) => {
      setGameState((prev) => ({ ...prev, diceValue }));
      Alert.alert('Dice Roll', `${player} rolled a ${diceValue}`);
    });
    socket.on('token-moved', ({ player, tokenIndex, newPosition }) => {
      setGameState((prev) => ({
        ...prev,
        positions: {
          ...prev.positions,
          [player]: prev.positions[player].map((pos, i) =>
            i === tokenIndex ? newPosition : pos
          ),
        },
      }));
    });
    socket.on('turn-changed', ({ nextPlayer }) => {
      setGameState((prev) => ({ ...prev, currentTurn: nextPlayer, diceValue: null }));
    });
    socket.on('player-joined', ({ players }) => {
      setGameState((prev) => ({ ...prev, players }));
    });
    socket.on('player-left', ({ color }) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.filter((p) => p.color !== color),
      }));
    });
    socket.on('game-over', ({ winner }) => {
      Alert.alert('Game Over', `${winner} wins!`);
      socket.disconnect();
      router.push('/');
    });
    socket.on('error', ({ message }) => {
      Alert.alert('Error', message);
    });

    return () => {
      socket.off('game-start');
      socket.off('dice-rolled');
      socket.off('token-moved');
      socket.off('turn-changed');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-over');
      socket.off('error');
    };
  }, [roomId]);

  const rollDice = () => {
    socket.emit('roll-dice', { roomId });
  };

  const moveToken = (tokenIndex) => {
    if (gameState.diceValue) {
      socket.emit('move-token', { roomId, tokenIndex, steps: gameState.diceValue });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room: {roomId}</Text>
      <Text style={styles.info}>Your Color: {playerColor}</Text>
      <Text style={styles.info}>Current Turn: {gameState.currentTurn}</Text>
      {gameState.diceValue && (
        <Text style={styles.info}>Last Roll: {gameState.diceValue}</Text>
      )}
      <Board positions={gameState.positions} playerColor={playerColor} onTokenPress={moveToken} />
      <Dice
        onRoll={rollDice}
        disabled={gameState.currentTurn !== playerColor || gameState.diceValue !== null}
      />
      <Chat roomId={roomId} socket={socket} playerName={playerName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 5 },
});
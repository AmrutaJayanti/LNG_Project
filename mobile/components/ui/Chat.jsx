import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function Chat({ roomId, socket, playerName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat-message', ({ playerName: sender, message }) => {
      setMessages((prev) => [...prev, `${sender}: ${message}`]);
    });
    return () => socket.off('chat-message');
  }, [socket]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chat-message', { roomId, message });
      setMessage('');
    }
  };

  return (
    <View style={styles.chatContainer}>
      <ScrollView style={styles.messageArea}>
        {messages.map((msg, i) => (
          <Text key={i} style={styles.message}>
            {msg}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatContainer: { flex: 1, marginTop: 20 },
  messageArea: { flex: 1, maxHeight: 200, borderWidth: 1, borderColor: '#ccc', padding: 10 },
  message: { marginBottom: 5 },
  inputContainer: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, marginRight: 10 },
});
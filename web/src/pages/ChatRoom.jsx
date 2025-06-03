import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust for your server

const ChatRoom = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    socket.emit('joinRoom', { chatId });

    socket.on('receiveMessage', msg => {
      setMessages(prev => [...prev, msg]);
    });

    fetch(`/api/chats/${chatId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data));

    return () => socket.disconnect();
  }, [chatId]);

  const sendMessage = () => {
    const msg = { chatId, message: { sender: user.id, text: input } };
    socket.emit('sendMessage', msg);
    setMessages(prev => [...prev, msg.message]);
    setInput('');
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}><strong>{m.sender === user.id ? 'You' : 'Friend'}:</strong> {m.text}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;

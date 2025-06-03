import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Input from '../components/Input';
import './../styles/Chat.css';

const Chat = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  useEffect(() => {
    setSocket(io('https://lng-project.onrender.com'));
  }, []);

  useEffect(() => {
    socket?.emit('addUser', user?.id);
    socket?.on('getUsers', users => {
      console.log('activeUsers :>> ', users);
    });
    socket?.on('getMessage', data => {
      setMessages(prev => ({
        ...prev,
        messages: [...prev.messages, { user: data.user, message: data.message }]
      }));
    });
  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.messages]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
    const fetchConversations = async () => {
      const res = await fetch(`https://lng-project.onrender.com/api/conversations/${loggedInUser?.id}`);
      const resData = await res.json();
      setConversations(resData);
    };
    fetchConversations();
  }, []);

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(`https://lng-project.onrender.com/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`);
    const resData = await res.json();
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async () => {
    setMessage('');
    socket?.emit('sendMessage', {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      conversationId: messages?.conversationId
    });

    await fetch(`https://lng-project.onrender.com/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiver?.receiverId
      })
    });
  };

  return (
    <div className='dashboard-container'>
      <div className='sidebar'>
        <div className='profile'>
          <h3>{user?.fullName}</h3>
          <p>My Account</p>
        </div>
        <hr />
        <div className='conversations'>
          <h4>Messages</h4>
          {conversations.length > 0 ? conversations.map(({ conversationId, user }) => (
            <div className='conversation-item' onClick={() => fetchMessages(conversationId, user)} key={conversationId}>
              <div>
                <h3>{user?.fullName}</h3>
                <p>{user?.email}</p>
              </div>
            </div>
          )) : <p>No Conversations</p>}
        </div>
      </div>

      <div className='chat-area'>
        {messages?.receiver?.fullName && (
          <div className='chat-header'>
            <div>
              <h3>{messages?.receiver?.fullName}</h3>
              <p>{messages?.receiver?.email}</p>
            </div>
          </div>
        )}
        <div className='chat-messages'>
          {messages?.messages?.length > 0 ? messages.messages.map(({ message, user: { id } = {} }, index) => (
            <div key={index} className={`chat-message ${id === user?.id ? 'self' : 'other'}`}>
              {message}
              <div ref={messageRef}></div>
            </div>
          )) : <p className='no-message'>No Messages or No Conversation Selected</p>}
        </div>
        {messages?.receiver?.fullName && (
          <div className='chat-input'>
            <Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage} disabled={!message}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

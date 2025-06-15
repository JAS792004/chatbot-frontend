// pages/chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const ChatPage = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef<any>(null);

  useEffect(() => {
    if (!session?.user?.email) {
      console.log('User not logged in, skipping socket connection.');
      return;
    }

    console.log('Attempting to connect to socket...');

    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: '/api/socket_io',
      addTrailingSlash: false,
    });

    socket.current.on('connect', () => {
      console.log('Socket connected from chat.tsx');
    });

    socket.current.on('receive-message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.current.on('load-history', (history) => {
      console.log('Loading message history:', history);
      setMessages(history);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected from chat.tsx');
    });

    socket.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      console.log('Disconnecting socket from chat.tsx');
      socket.current.disconnect();
    };
  }, [session?.user?.email]);

  const sendMessage = () => {
    if (newMessage.trim() && session?.user?.email) {
      console.log('sendMessage called with message:', newMessage);
      console.log('Socket status:', socket.current?.connected ? 'connected' : 'disconnected');

      if (socket.current?.connected) {
        socket.current.emit('send-message', {
          message: newMessage,
          sender: session.user.email,
        });
        setNewMessage('');
      } else {
        console.log('Socket not connected, message not sent.');
      }
    } else {
      console.log('Message is empty or user is not logged in.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Chat Page</h1>

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <strong style={{ fontWeight: 'bold' }}>{message.sender}:</strong> {message.message}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          style={{ flex: 1, padding: '8px', marginRight: '10px' }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 12px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

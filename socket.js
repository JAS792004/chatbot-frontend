// socket.js
import { Server } from 'socket.io';
import { getSession } from 'next-auth/react'; // Import getSession
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/api/socket_io',
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('New socket connected');

    socket.on('send-message', async (message) => {
      try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);

        // Save the message to the database
        const collection = db.collection('Chat');
        await collection.insertOne({
          userId: message.sender, // Assuming message.sender is the userId
          message: message.message,
          timestamp: new Date(),
        });

        // After saving, emit the message to all connected clients
        io.emit('receive-message', message); // Broadcast to all clients

        await client.close();
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
  });

  console.log('Socket is initializing');
  res.end();
};

export default SocketHandler;

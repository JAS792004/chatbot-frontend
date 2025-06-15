// pages/api/socket_io.js
import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socket_io',
      addTrailingSlash: false,
      cors: {
        origin: '*', //  <---------------------  VERY IMPORTANT: ADJUST FOR PRODUCTION!
        methods: ['GET', 'POST'],
      },
    });
    res.socket.server.io = io;

    // ...
  }
  res.end();
};

export default SocketHandler;

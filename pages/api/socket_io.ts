// pages/api/socket_io.ts
import { Server as IOServer } from 'socket.io';
import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'net';
import type { NextApiResponseWithSocket } from '@/types/NextApiResponseWithSocket';

// Extend the res.socket.server to include `io`
export type NextApiResponseWithIO = NextApiResponseWithSocket & {
  socket: Socket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithIO) => {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server as any, {
      path: '/api/socket_io',
      addTrailingSlash: false,
    });

    io.on('connection', socket => {
      console.log('Socket connected:', socket.id);

      socket.on('message', msg => {
        console.log('Message received:', msg);
        socket.broadcast.emit('message', msg); // Broadcast to others
      });
    });

    res.socket.server.io = io;
    console.log('Socket.io server initialized');
  } else {
    console.log('Socket.io server already running');
  }

  res.end();
};

export default SocketHandler;

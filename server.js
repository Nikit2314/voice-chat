const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Хранилище для активных пользователей
const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('find_partner', () => {
    // Логика поиска партнера
    const availableUsers = Array.from(users.entries())
      .filter(([id, user]) => id !== socket.id && !user.partnerId);

    if (availableUsers.length > 0) {
      const [partnerId, partner] = availableUsers[0];
      users.set(socket.id, { ...users.get(socket.id), partnerId });
      users.set(partnerId, { ...partner, partnerId: socket.id });

      socket.emit('partner_found', { partnerId });
      io.to(partnerId).emit('partner_found', { partnerId: socket.id });
    } else {
      users.set(socket.id, { partnerId: null });
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user && user.partnerId) {
      io.to(user.partnerId).emit('partner_disconnected');
      const partner = users.get(user.partnerId);
      if (partner) {
        users.set(user.partnerId, { ...partner, partnerId: null });
      }
    }
    users.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });

  // Обработка ошибок
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

const PORT = process.env.PORT || 10000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
}); 
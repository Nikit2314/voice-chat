const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// Настройка CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Обслуживание статических файлов из папки build
app.use(express.static(path.join(__dirname, 'build')));

const httpServer = createServer(app);

// Настройка Socket.IO
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

// API маршруты
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    users: users.size,
    timestamp: new Date().toISOString()
  });
});

// Обработка сокетов
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('connected', { id: socket.id });

  socket.on('find_partner', () => {
    console.log('User searching for partner:', socket.id);
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
      socket.emit('waiting_for_partner');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = users.get(socket.id);
    if (user && user.partnerId) {
      io.to(user.partnerId).emit('partner_disconnected');
      const partner = users.get(user.partnerId);
      if (partner) {
        users.set(user.partnerId, { ...partner, partnerId: null });
      }
    }
    users.delete(socket.id);
  });

  // Обработка ошибок
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Все остальные GET-запросы отправляют index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Получаем порт из переменных окружения или используем 10000
const PORT = process.env.PORT || 10000;

// Запускаем сервер
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`API status available at: http://localhost:${PORT}/api/status`);
}); 
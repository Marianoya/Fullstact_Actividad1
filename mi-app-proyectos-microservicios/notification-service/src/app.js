const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.connect().catch(console.error);

subscriber.subscribe('task.created', (message) => {
  io.emit('task.created', JSON.parse(message));
});

subscriber.subscribe('project.created', (message) => {
  io.emit('project.created', JSON.parse(message));
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('chat:message', (data) => {
    io.emit('chat:message', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({ service: 'notification-service', status: 'ok' });
});

server.listen(process.env.PORT || 3005, () => {
  console.log(`notification-service corriendo en puerto ${process.env.PORT || 3005}`);
});
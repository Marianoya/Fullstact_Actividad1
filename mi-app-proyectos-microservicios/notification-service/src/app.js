const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createClient } = require('redis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

subscriber.on('error', (err) => {
  console.error('Error en Redis subscriber:', err);
});

(async () => {
  try {
    await subscriber.connect();
    console.log('notification-service conectado a Redis');

    await subscriber.subscribe('project.created', (message) => {
      try {
        const data = JSON.parse(message);
        io.emit('project.created', data);
        console.log('Evento project.created enviado al frontend:', data);
      } catch (error) {
        console.error('Error procesando project.created:', error);
      }
    });

    await subscriber.subscribe('task.created', (message) => {
      try {
        const data = JSON.parse(message);
        io.emit('task.created', data);
        console.log('Evento task.created enviado al frontend:', data);
      } catch (error) {
        console.error('Error procesando task.created:', error);
      }
    });
  } catch (error) {
    console.error('Error conectando notification-service con Redis:', error);
  }
})();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('chat:message', (data) => {
    console.log('Mensaje de chat recibido:', data);
    io.emit('chat:message', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({
    service: 'notification-service',
    status: 'ok'
  });
});

server.listen(process.env.PORT || 3005, () => {
  console.log(`notification-service corriendo en puerto ${process.env.PORT || 3005}`);
});


const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const taskRoutes = require('./routes/tasks.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api/tasks', authMiddleware, taskRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'task-service', status: 'ok' });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`task-service corriendo en puerto ${PORT}`);
});
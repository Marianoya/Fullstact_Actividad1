const express = require('express');
const cors = require('cors');
require('dotenv').config();
const compression = require('compression');

const userRoutes = require('./routes/users.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api/users', authMiddleware, userRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'ok' });
});

app.listen(process.env.PORT || 3002, () => {
  console.log(`user-service corriendo en puerto ${process.env.PORT || 3002}`);
});
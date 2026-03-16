const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'auth-service', status: 'ok' });
});

const PORT = process.env.PORT || 3001;

app.listen(process.env.PORT || 3001, () => {
  console.log(`auth-service corriendo en puerto ${process.env.PORT || 3001}`);
});


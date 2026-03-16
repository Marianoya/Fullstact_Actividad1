const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const projectRoutes = require('./routes/projects.routes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

app.use('/api/projects', authMiddleware, projectRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'project-service', status: 'ok' });
});

app.listen(process.env.PORT || 3003, () => {
  console.log(`project-service corriendo en puerto ${process.env.PORT || 3003}`);
});


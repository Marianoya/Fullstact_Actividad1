const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
const proyectosRoutes = require('./routes/proyectos');
const gestionUsuariosRoutes = require('./routes/gestion_usuarios');
const asignacionTareasRoutes = require('./routes/asignacion_tareas');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.use('/api/proyectos', proyectosRoutes);
app.use('/api/usuarios', gestionUsuariosRoutes);
app.use('/api/tareas', asignacionTareasRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


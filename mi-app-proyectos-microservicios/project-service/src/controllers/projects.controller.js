const pool = require('../config/db');
const { createClient } = require('redis');
require('dotenv').config();

const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

publisher.connect().catch(console.error);

const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM creacion_proyectos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
};

const createProject = async (req, res) => {
  try {
    const { nombre_proyecto, descripcion_proyecto, status_proyecto } = req.body;

    const [result] = await pool.query(
      'INSERT INTO creacion_proyectos (nombre_proyecto, descripcion_proyecto, status_proyecto) VALUES (?, ?, ?)',
      [nombre_proyecto, descripcion_proyecto, status_proyecto]
    );

    await publisher.publish('project.created', JSON.stringify({
      id_proyecto: result.insertId,
      nombre_proyecto,
      status_proyecto
    }));

    res.status(201).json({ message: 'Proyecto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_proyecto, descripcion_proyecto, status_proyecto } = req.body;

    await pool.query(
      'UPDATE creacion_proyectos SET nombre_proyecto = ?, descripcion_proyecto = ?, status_proyecto = ? WHERE id_proyecto = ?',
      [nombre_proyecto, descripcion_proyecto, status_proyecto, id]
    );

    res.json({ message: 'Proyecto actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM creacion_proyectos WHERE id_proyecto = ?', [id]);

    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
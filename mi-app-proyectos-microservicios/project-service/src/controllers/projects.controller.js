const pool = require('../config/db');
const { createClient } = require('redis');
const { clearProjectsCache, saveProjectsCache } = require('../middleware/cacheProjects');
require('dotenv').config();

const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

publisher.connect().catch(console.error);

const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_proyecto, nombre_proyecto, descripcion_proyecto, status_proyecto FROM creacion_proyectos'
    );

    await saveProjectsCache(rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
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

    await clearProjectsCache();

    await publisher.publish('project.created', JSON.stringify({
      id_proyecto: result.insertId,
      nombre_proyecto,
      status_proyecto
    }));

    res.status(201).json({ message: 'Proyecto creado', id: result.insertId });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
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

    await clearProjectsCache();

    res.json({ message: 'Proyecto actualizado' });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM creacion_proyectos WHERE id_proyecto = ?', [id]);

    await clearProjectsCache();

    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
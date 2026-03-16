const pool = require('../config/db');
const { createClient } = require('redis');
require('dotenv').config();

const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

publisher.connect().catch(console.error);

const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM asignacion_tareas');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      nombre_tarea,
      contenido_tarea,
      desarrollador_id,
      proyecto_id,
      status_tarea
    } = req.body;

    const [result] = await pool.query(
      'INSERT INTO asignacion_tareas (nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea) VALUES (?, ?, ?, ?, ?)',
      [nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea]
    );

    const [nuevaTarea] = await pool.query(
      'SELECT * FROM asignacion_tareas WHERE id_tarea = ?',
      [result.insertId]
    );

    await publisher.publish(
      'task.created',
      JSON.stringify(nuevaTarea[0])
    );

    res.status(201).json(nuevaTarea[0]);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_tarea,
      contenido_tarea,
      desarrollador_id,
      proyecto_id,
      status_tarea
    } = req.body;

    await pool.query(
      'UPDATE asignacion_tareas SET nombre_tarea = ?, contenido_tarea = ?, desarrollador_id = ?, proyecto_id = ?, status_tarea = ? WHERE id_tarea = ?',
      [nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea, id]
    );

    const [tareaActualizada] = await pool.query(
      'SELECT * FROM asignacion_tareas WHERE id_tarea = ?',
      [id]
    );

    res.json(tareaActualizada[0]);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM asignacion_tareas WHERE id_tarea = ?',
      [id]
    );

    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};


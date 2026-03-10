const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - ver todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM asignacion_tareas ORDER BY id ASC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaciones', detalle: error.message });
  }
});

// GET - ver uno por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM asignacion_tareas WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignación', detalle: error.message });
  }
});

// POST - crear
router.post('/', async (req, res) => {
  try {
    const { nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea } = req.body;

    if (!nombre_tarea || !status_tarea) {
      return res.status(400).json({
        error: 'nombre_tarea y status_tarea son obligatorios'
      });
    }

    const [result] = await db.query(
      `INSERT INTO asignacion_tareas
      (nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea)
      VALUES (?, ?, ?, ?, ?)`,
      [nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea]
    );

    res.status(201).json({
      mensaje: 'Asignación creada correctamente',
      id_asignacion: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear asignación', detalle: error.message });
  }
});

// PUT - actualizar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea } = req.body;

    const [result] = await db.query(
      `UPDATE asignacion_tareas
       SET nombre_tarea = ?, contenido_tarea = ?, desarrollador_id = ?, proyecto_id = ?, status_tarea = ?
       WHERE id = ?`,
      [nombre_tarea, contenido_tarea, desarrollador_id, proyecto_id, status_tarea, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json({ mensaje: 'Asignación actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar asignación', detalle: error.message });
  }
});

// DELETE - eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM asignacion_tareas WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }

    res.json({ mensaje: 'Asignación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto', detalle: error.message });
  }
});

module.exports = router;


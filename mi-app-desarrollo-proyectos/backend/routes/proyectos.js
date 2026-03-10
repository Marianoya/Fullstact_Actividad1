const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - ver todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM creacion_proyectos ORDER BY id_proyecto ASC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos', detalle: error.message });
  }
});

// GET - ver uno por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM creacion_proyectos WHERE id_proyecto = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyecto', detalle: error.message });
  }
});

// POST - crear
router.post('/', async (req, res) => {
  try {
    const { nombre_proyecto, descripcion_proyecto, status_proyecto } = req.body;

    if (!nombre_proyecto || !status_proyecto) {
      return res.status(400).json({
        error: 'nombre_proyecto y status_proyecto son obligatorios'
      });
    }

    const [result] = await db.query(
      `INSERT INTO creacion_proyectos
      (nombre_proyecto, descripcion_proyecto, status_proyecto)
      VALUES (?, ?, ?)`,
      [nombre_proyecto, descripcion_proyecto, status_proyecto]
    );

    res.status(201).json({
      mensaje: 'Proyecto creado correctamente',
      id_proyecto: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto', detalle: error.message });
  }
});

// PUT - actualizar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_proyecto, descripcion_proyecto, status_proyecto } = req.body;

    const [result] = await db.query(
      `UPDATE creacion_proyectos
       SET nombre_proyecto = ?, descripcion_proyecto = ?, status_proyecto = ?
       WHERE id_proyecto = ?`,
      [nombre_proyecto, descripcion_proyecto, status_proyecto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ mensaje: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar proyecto', detalle: error.message });
  }
});

// DELETE - eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM creacion_proyectos WHERE id_proyecto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    res.json({ mensaje: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto', detalle: error.message });
  }
});

module.exports = router;


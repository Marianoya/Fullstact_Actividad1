const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - ver todos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM gestion_usuarios ORDER BY id_user ASC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
});

// GET - ver uno por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM gestion_usuarios WHERE id_user = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario', detalle: error.message });
  }
});

// POST - crear
router.post('/', async (req, res) => {
  try {
    const { nombre_programador, correo_electronico, especialidad} = req.body;

    if (!nombre_programador || !correo_electronico || !especialidad) {
      return res.status(400).json({
        error: 'nombre_programador, correo electronico y especialidad son obligatorios'
      });
    }

    const [result] = await db.query(
      `INSERT INTO gestion_usuarios
      (nombre_programador, correo_electronico, especialidad)
      VALUES (?, ?, ?)`,
      [nombre_programador, correo_electronico, especialidad]
    );

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      id_usuario: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
});

// PUT - actualizar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_programador, correo_electronico, especialidad } = req.body;

    const [result] = await db.query(
      `UPDATE gestion_usuarios
       SET nombre_programador = ?, correo_electronico = ?, especialidad = ?
       WHERE id_user = ?`,
      [nombre_programador, correo_electronico, especialidad, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
});

// DELETE - eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM gestion_usuarios WHERE id_user = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
});

module.exports = router;


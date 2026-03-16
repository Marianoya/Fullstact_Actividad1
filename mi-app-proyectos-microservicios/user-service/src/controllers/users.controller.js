const pool = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gestion_usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const createUser = async (req, res) => {
  try {
    const { nombre_programador, correo_electronico, especialidad } = req.body;

    const [result] = await pool.query(
      'INSERT INTO gestion_usuarios (nombre_programador, correo_electronico, especialidad) VALUES (?, ?, ?)',
      [nombre_programador, correo_electronico, especialidad]
    );

    const [nuevoUsuario] = await pool.query(
      'SELECT * FROM gestion_usuarios WHERE id_user = ?',
      [result.insertId]
    );

    res.status(201).json(nuevoUsuario[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_programador, correo_electronico, especialidad } = req.body;

    await pool.query(
      'UPDATE gestion_usuarios SET nombre_programador = ?, correo_electronico = ?, especialidad = ? WHERE id_user = ?',
      [nombre_programador, correo_electronico, especialidad, id]
    );

    const [usuarioActualizado] = await pool.query(
      'SELECT * FROM gestion_usuarios WHERE id_user = ?',
      [id]
    );

    res.json(usuarioActualizado[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM gestion_usuarios WHERE id_user = ?', [id]);

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };


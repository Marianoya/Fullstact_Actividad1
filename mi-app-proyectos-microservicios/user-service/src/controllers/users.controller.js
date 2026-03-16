const pool = require('../config/db');
const { clearUsersCache, saveUsersCache } = require('../middleware/cacheUsers');

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_user, nombre_programador, correo_electronico, especialidad FROM gestion_usuarios'
    );

    await saveUsersCache(rows);
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

    await clearUsersCache();

    res.status(201).json({ message: 'Usuario creado', id: result.insertId });
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

    await clearUsersCache();

    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM gestion_usuarios WHERE id_user = ?', [id]);

    await clearUsersCache();

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };



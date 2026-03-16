import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3002/api/users';

function CRUDUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nombre_programador: '',
    correo_electronico: '',
    especialidad: '',
  });

  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      setError('');
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar usuarios');
      }

      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(error.message);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre_programador: '',
      correo_electronico: '',
      especialidad: '',
    });
    setEditandoId(null);
    setMensaje('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = editandoId
        ? await fetch(`${API_URL}/${editandoId}`, { ...options, method: 'PUT' })
        : await fetch(API_URL, { ...options, method: 'POST' });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar usuario');
      }

      setMensaje(editandoId ? 'Usuario actualizado correctamente' : 'Usuario guardado correctamente');
      await cargarUsuarios();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      setError(error.message);
    }
  };

  const handleEditar = (usuario) => {
    setFormData({
      nombre_programador: usuario.nombre_programador || '',
      correo_electronico: usuario.correo_electronico || '',
      especialidad: usuario.especialidad || '',
    });
    setEditandoId(usuario.id_user);
    setMensaje('');
    setError('');
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Deseas eliminar este usuario?');
    if (!confirmar) return;

    try {
      setMensaje('');
      setError('');

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      setMensaje('Usuario eliminado correctamente');
      await cargarUsuarios();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestor de Usuarios</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre del programador</label>
          <input
            type="text"
            className="form-control"
            name="nombre_programador"
            value={formData.nombre_programador}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="correo_electronico"
            value={formData.correo_electronico}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Especialidad</label>
          <input
            type="text"
            className="form-control"
            name="especialidad"
            value={formData.especialidad}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
            Limpiar
          </button>
          <button type="button" className="btn btn-info text-white" onClick={cargarUsuarios}>
            Recargar
          </button>
        </div>
      </form>

      <div className="row">
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          usuarios.map((usuario) => (
            <div className="col-md-6 mb-3" key={usuario.id_user}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{usuario.nombre_programador}</h5>
                  <p className="card-text">{usuario.correo_electronico || 'Sin correo electrónico'}</p>
                  <p><strong>Especialidad:</strong> {usuario.especialidad || 'Sin especialidad'}</p>

                  <div className="d-flex gap-2">
                    <button className="btn btn-warning" onClick={() => handleEditar(usuario)}>
                      Editar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleEliminar(usuario.id_user)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CRUDUsuarios;


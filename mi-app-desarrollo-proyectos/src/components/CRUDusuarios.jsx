import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/usuarios';

function CRUDUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre_programador: '',
    correo_electronico: '',
    especialidad: '',
  });

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      await cargarUsuarios();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const handleEditar = (usuario) => {
    setFormData({
      nombre_programador: usuario.nombre_programador,
      correo_electronico: usuario.correo_electronico || '',
      especialidad: usuario.especialidad || '',
    });
    setEditandoId(usuario.id_user);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Deseas eliminar este usuario?');
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      await cargarUsuarios();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestor de Usuarios</h2>

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
            rows="3"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={limpiarFormulario}
          >
            Limpiar
          </button>

          <button
            type="button"
            className="btn btn-info text-white"
            onClick={cargarUsuarios}
          >
            Recargar
          </button>
        </div>
      </form>

      <div className="row">
        {usuarios.map((usuario) => (
          <div className="col-md-6 mb-3" key={usuario.id_usuario}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{usuario.nombre_programador}</h5>
                <p className="card-text">
                  {usuario.correo_electronico || 'Sin correo electrónico'}
                </p>
                <p>
                  <strong>Especialidad:</strong> {usuario.especialidad || 'Sin especialidad'}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditar(usuario)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminar(usuario.id_user)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CRUDUsuarios;


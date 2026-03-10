import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/proyectos';

function CRUDProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre_proyecto: '',
    descripcion_proyecto: '',
    status_proyecto: 'activo',
  });

  const cargarProyectos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  useEffect(() => {
    cargarProyectos();
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
      nombre_proyecto: '',
      descripcion_proyecto: '',
      status_proyecto: 'activo',
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

      await cargarProyectos();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    }
  };

  const handleEditar = (proyecto) => {
    setFormData({
      nombre_proyecto: proyecto.nombre_proyecto,
      descripcion_proyecto: proyecto.descripcion_proyecto || '',
      status_proyecto: proyecto.status_proyecto,
    });
    setEditandoId(proyecto.id_proyecto);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Deseas eliminar este proyecto?');
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      await cargarProyectos();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestor de Proyectos</h2>

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre del proyecto</label>
          <input
            type="text"
            className="form-control"
            name="nombre_proyecto"
            value={formData.nombre_proyecto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción del proyecto</label>
          <textarea
            className="form-control"
            name="descripcion_proyecto"
            value={formData.descripcion_proyecto}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status del proyecto</label>
          <select
            className="form-select"
            name="status_proyecto"
            value={formData.status_proyecto}
            onChange={handleChange}
          >
            <option value="activo">Activo</option>
            <option value="en progreso">En progreso</option>
            <option value="pausado">Pausado</option>
            <option value="completado">Completado</option>
          </select>
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
            onClick={cargarProyectos}
          >
            Recargar
          </button>
        </div>
      </form>

      <div className="row">
        {proyectos.map((proyecto) => (
          <div className="col-md-6 mb-3" key={proyecto.id_proyecto}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{proyecto.nombre_proyecto}</h5>
                <p className="card-text">
                  {proyecto.descripcion_proyecto || 'Sin descripción'}
                </p>
                <p>
                  <strong>Status:</strong> {proyecto.status_proyecto}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditar(proyecto)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminar(proyecto.id_proyecto)}
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

export default CRUDProyectos;


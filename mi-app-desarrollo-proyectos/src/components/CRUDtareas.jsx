import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/tareas';
const API_USUARIOS = 'http://localhost:3000/api/usuarios';
const API_PROYECTOS = 'http://localhost:3000/api/proyectos';

function CRUDTareas() {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [formData, setFormData] = useState({
    nombre_tarea: '',
    contenido_tarea: '',
    desarrollador_id: '',
    proyecto_id: '',
    status_tarea: 'activo',
  });

  const cargarTareas = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTareas(data);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(API_USUARIOS);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const cargarProyectos = async () => {
    try {
      const response = await fetch(API_PROYECTOS);
      const data = await response.json();
      setProyectos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  useEffect(() => {
    cargarTareas();
    cargarUsuarios();
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
      nombre_tarea: '',
      contenido_tarea: '',
      desarrollador_id: '',
      proyecto_id: '',
      status_tarea: 'activo',
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

      await cargarTareas();
      limpiarFormulario();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
    }
  };

  const handleEditar = (tarea) => {
    setFormData({
      nombre_tarea: tarea.nombre_tarea,
      contenido_tarea: tarea.contenido_tarea || '',
      desarrollador_id: tarea.desarrollador_id,
      proyecto_id: tarea.proyecto_id,
      status_tarea: tarea.status_tarea,
    });
    setEditandoId(tarea.id);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Deseas eliminar esta tarea?');
    if (!confirmar) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      await cargarTareas();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestor de Tareas</h2>

      <form onSubmit={handleSubmit} className="card p-3 mb-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nombre de la tarea</label>
          <input
            type="text"
            className="form-control"
            name="nombre_tarea"
            value={formData.nombre_tarea}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción de la tarea</label>
          <textarea
            className="form-control"
            name="contenido_tarea"
            value={formData.contenido_tarea}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ID del desarrollador</label>
          <input
            type="text"
            className="form-control"
            name="desarrollador_id"
            value={formData.desarrollador_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ID del proyecto</label>
          <input
            type="text"
            className="form-control"
            name="proyecto_id"
            value={formData.proyecto_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status de la tarea</label>
          <select
            className="form-select"
            name="status_tarea"
            value={formData.status_tarea}
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
            onClick={cargarTareas}
          >
            Recargar
          </button>
        </div>
      </form>

      <div className="row">
        {tareas.map((tarea) => {
          const usuarioNombre =
            usuarios.find(
              (u) => Number(u.id_user) === Number(tarea.desarrollador_id)
            )?.nombre_programador || 'Sin asignación';

          const proyectoNombre =
            proyectos.find(
              (p) => Number(p.id_proyecto) === Number(tarea.proyecto_id)
            )?.nombre_proyecto || 'Sin proyecto';

          return (
            <div className="col-md-6 mb-3" key={tarea.id_tarea}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{tarea.nombre_tarea}</h5>

                  <p className="card-text">
                    {tarea.contenido_tarea || 'Sin descripción'}
                  </p>

                  <p className="card-text">
                    <strong>Desarrollador:</strong> {usuarioNombre}
                  </p>

                  <p className="card-text">
                    <strong>Proyecto:</strong> {proyectoNombre}
                  </p>

                  <p>
                    <strong>Status:</strong> {tarea.status_tarea}
                  </p>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditar(tarea)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminar(tarea.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CRUDTareas;
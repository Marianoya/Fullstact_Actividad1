import { useEffect, useState } from "react";

const API_URL = "http://localhost:3003/api/projects";

function CRUDProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [formData, setFormData] = useState({
    nombre_proyecto: "",
    descripcion_proyecto: "",
    status_proyecto: "activo",
  });

  const token = localStorage.getItem("token");

  const cargarProyectos = async () => {
    try {
      setMensaje("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error al cargar proyectos:", data);
        setMensaje(data.message || "No se pudieron cargar los proyectos");
        setProyectos([]);
        return;
      }

      if (Array.isArray(data)) {
        setProyectos(data);
      } else if (Array.isArray(data.proyectos)) {
        setProyectos(data.proyectos);
      } else if (Array.isArray(data.data)) {
        setProyectos(data.data);
      } else {
        setProyectos([]);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      setMensaje("Error al cargar proyectos");
      setProyectos([]);
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
      nombre_proyecto: "",
      descripcion_proyecto: "",
      status_proyecto: "activo",
    });
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(
        editandoId ? `${API_URL}/${editandoId}` : API_URL,
        {
          ...options,
          method: editandoId ? "PUT" : "POST",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error al guardar proyecto:", data);
        setMensaje(data.message || "No se pudo guardar el proyecto");
        return;
      }

      await cargarProyectos();
      limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      setMensaje("Error al guardar proyecto");
    }
  };

  const handleEditar = (proyecto) => {
    setFormData({
      nombre_proyecto: proyecto.nombre_proyecto || "",
      descripcion_proyecto: proyecto.descripcion_proyecto || "",
      status_proyecto: proyecto.status_proyecto || "activo",
    });
    setEditandoId(proyecto.id_proyecto);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este proyecto?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error al eliminar proyecto:", data);
        setMensaje(data.message || "No se pudo eliminar el proyecto");
        return;
      }

      await cargarProyectos();

      if (editandoId === id) {
        limpiarFormulario();
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      setMensaje("Error al eliminar proyecto");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestor de Proyectos</h2>

      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

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
            {editandoId ? "Actualizar" : "Guardar"}
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

      {Array.isArray(proyectos) && proyectos.length === 0 && (
        <div className="alert alert-secondary">No hay proyectos para mostrar.</div>
      )}

      <div className="row">
        {Array.isArray(proyectos) &&
          proyectos.map((proyecto) => (
            <div className="col-md-6 mb-3" key={proyecto.id_proyecto}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{proyecto.nombre_proyecto}</h5>
                  <p className="card-text">
                    {proyecto.descripcion_proyecto || "Sin descripción"}
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


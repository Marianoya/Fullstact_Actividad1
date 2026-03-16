import React from "react";
import Button from "react-bootstrap/Button";

function Header({ onSelect, onLogout }) {
  return (
    <header className="mb-4">
      <div className="d-grid gap-2 mb-3">
        <Button variant="outline-info" size="lg">
          Gestión de Proyectos para desarrollo de software
        </Button>
      </div>

      <ul className="nav nav-tabs w-100 align-items-center">
        <li className="nav-item">
          <span className="nav-link active">
            Selecciona el tipo de gestión de desarrollo
          </span>
        </li>

        <li className="nav-item dropdown">
          <button
            className="nav-link dropdown-toggle link-warning btn btn-link text-decoration-none"
            data-bs-toggle="dropdown"
            type="button"
          >
            Gestor
          </button>

          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onSelect("creacion_proyectos")}
              >
                Creación de Proyectos
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onSelect("asignacion_tareas")}
              >
                Asignación de Tareas
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onSelect("gestion_usuarios")}
              >
                Gestión de Usuarios
              </button>
            </li>
          </ul>
        </li>

        <li className="nav-item ms-auto">
          <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Header;


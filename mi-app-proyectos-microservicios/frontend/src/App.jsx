import { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import CRUDProyectos from "./components/CRUDProyectos";
import CRUDTareas from "./components/CRUDTareas";
import CRUDUsuarios from "./components/CRUDUsuarios";
import socket from "./socket";
import "./App.css";

function App() {
  const [seccionActiva, setSeccionActiva] = useState("");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    socket.on("task.created", (data) => {
      console.log("Nueva tarea:", data);
    });

    socket.on("project.created", (data) => {
      console.log("Nuevo proyecto:", data);
    });

    socket.on("chat:message", (data) => {
      console.log("Chat:", data);
    });

    return () => {
      socket.off("task.created");
      socket.off("project.created");
      socket.off("chat:message");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSeccionActiva("");
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="container py-4">
      <Header onSelect={setSeccionActiva} onLogout={handleLogout} />

      {!seccionActiva && (
        <div className="alert alert-info mt-3">
          Selecciona una opción del menú para comenzar.
        </div>
      )}

      {seccionActiva === "creacion_proyectos" && <CRUDProyectos />}
      {seccionActiva === "asignacion_tareas" && <CRUDTareas />}
      {seccionActiva === "gestion_usuarios" && <CRUDUsuarios />}
    </div>
  );
}

export default App;


import { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import CRUDProyectos from "./components/CRUDProyectos";
import CRUDTareas from "./components/CRUDTareas";
import CRUDUsuarios from "./components/CRUDUsuarios";
import socket from "./socket";
import "./App.css";
import ChatBox from "./components/ChatBox";

function App() {
  const [seccionActiva, setSeccionActiva] = useState("");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    socket.on("project.created", (data) => {
      console.log("Nuevo proyecto:", data);
      setNotificaciones((prev) => [
        { tipo: "proyecto", mensaje: `Nuevo proyecto: ${data.nombre_proyecto}` },
        ...prev
      ]);
    });

    socket.on("task.created", (data) => {
      console.log("Nueva tarea:", data);
      setNotificaciones((prev) => [
        { tipo: "tarea", mensaje: `Nueva tarea: ${data.nombre_tarea}` },
        ...prev
      ]);
    });

    socket.on("chat:message", (data) => {
      console.log("Chat:", data);
      setNotificaciones((prev) => [
        { tipo: "chat", mensaje: `Chat: ${data.usuario || "Usuario"} - ${data.mensaje}` },
        ...prev
      ]);
    });

    return () => {
      socket.off("project.created");
      socket.off("task.created");
      socket.off("chat:message");
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="container py-4">
      <Header onSelect={setSeccionActiva} onLogout={handleLogout} />

      {notificaciones.length > 0 && (
        <div className="mb-4">
          <h5>Notificaciones en tiempo real</h5>
          {notificaciones.slice(0, 5).map((n, index) => (
            <div key={index} className="alert alert-info py-2 mb-2">
              {n.mensaje}
            </div>
          ))}
        </div>
      )}

      {seccionActiva === "creacion_proyectos" && <CRUDProyectos />}
      {seccionActiva === "asignacion_tareas" && <CRUDTareas />}
      {seccionActiva === "gestion_usuarios" && <CRUDUsuarios />}

      {!seccionActiva && (
        <div className="alert alert-secondary">
          Selecciona una opción del menú para comenzar.
        </div>
      )}
      <ChatBox />
    </div>
    
  );
}

export default App;
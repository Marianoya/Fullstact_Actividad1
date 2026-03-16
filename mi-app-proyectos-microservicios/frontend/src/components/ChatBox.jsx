import { useEffect, useState } from "react";
import socket from "../socket";



function ChatBox() {
  
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on("chat:message", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat:message");
    };
  }, []);

  const enviarMensaje = () => {
    if (!mensaje.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    
    socket.emit("chat:message", {
    usuario: user?.nombre || user?.email || "Usuario",
    mensaje
    });

    setMensaje("");
  };

  return (
    <div className="card p-3 mt-4">
      <h5>Chat en tiempo real</h5>

      <div
        className="border rounded p-2 mb-3"
        style={{ height: "200px", overflowY: "auto" }}
      >
        {mensajes.map((m, i) => (
          <div key={i}>
            <strong>{m.usuario}:</strong> {m.mensaje}
          </div>
        ))}
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje"
        />
        <button className="btn btn-primary" onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default ChatBox;


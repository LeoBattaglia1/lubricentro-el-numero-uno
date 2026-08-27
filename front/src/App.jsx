// App.js
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Clientes from "./components/Clientes";
import Mercaderia from "./components/Mercaderia";
import Servicios from "./components/Servicios";
import TrabajoRealizado from "./components/TrabajoRealizado";
import Turnos from "./components/Turnos";
import Presupuestos from "./components/Presupuestos";
import Caja from "./components/Caja";

function App() {
  const [vistaActual, setVistaActual] = useState("dashboard");
  const [paramsNavegacion, setParamsNavegacion] = useState({});
  const [fechaHoraActual, setFechaHoraActual] = useState(new Date());

  // Reloj y fecha actual en tiempo real para el header global
  useEffect(() => {
    const timer = setInterval(() => {
      setFechaHoraActual(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fechaFormateada = fechaHoraActual.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = fechaHoraActual.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleNavigate = (vista, params = {}) => {
    setVistaActual(vista);
    setParamsNavegacion(params);
  };

  const handleVolver = () => {
    setVistaActual("dashboard");
    setParamsNavegacion({});
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER DE LA APLICACIÓN (Con Título, Fecha y Hora global) */}
      <header
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div>
          <h1
            onClick={handleVolver}
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🛠️ Taller Mecánico / Lubricentro
          </h1>
          <span
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              textTransform: "capitalize",
            }}
          >
            {fechaFormateada}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#38bdf8",
            }}
          >
            {horaFormateada}
          </span>
          {vistaActual !== "dashboard" && (
            <button
              onClick={handleVolver}
              style={{
                padding: "6px 12px",
                background: "#334155",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Inicio
            </button>
          )}
        </div>
      </header>

      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      <main style={{ padding: "20px 0" }}>
        {vistaActual === "dashboard" && (
          <Dashboard onNavigate={handleNavigate} />
        )}
        {vistaActual === "clientes" && (
          <Clientes
            busquedaInicial={paramsNavegacion.busqueda}
            onVolver={handleVolver}
          />
        )}
        {vistaActual === "mercaderia" && <Mercaderia onVolver={handleVolver} />}
        {vistaActual === "servicios" && <Servicios onVolver={handleVolver} />}
        {vistaActual === "trabajo_realizado" && (
          <TrabajoRealizado onVolver={handleVolver} />
        )}
        {vistaActual === "turnos" && <Turnos onVolver={handleVolver} />}
        {vistaActual === "presupuestos" && (
          <Presupuestos onVolver={handleVolver} />
        )}
        {vistaActual === "caja" && <Caja onVolver={handleVolver} />}
      </main>
    </div>
  );
}

export default App;

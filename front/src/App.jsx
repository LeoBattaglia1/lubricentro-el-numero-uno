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
import logo from "./logo.jpg";

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

  // Nombres descriptivos para cada ventana en el centro del header
  const nombresVistas = {
    dashboard: "Inicio",
    clientes: "Clientes y Vehículos",
    mercaderia: "Mercadería y Proveedores",
    servicios: "Servicios",
    trabajo_realizado: "Trabajo Realizado o venta",
    turnos: "Turnos",
    presupuestos: "Presupuestos",
    caja: "Caja y Pagos",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER DE LA APLICACIÓN */}
      <header
        style={{
          background: "#000000",
          color: "white",
          padding: "8px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {/* Izquierda: Logo */}
        <img
          src={logo}
          alt="Logo Taller"
          onClick={handleVolver}
          style={{
            height: "85px",
            cursor: "pointer",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        {/* Centro: Nombre de la ventana seleccionada */}
        <div style={{ textAlign: "center", flex: 1, overflow: "hidden" }}>
          <span
            style={{
              color: "#e2e8f0",
              fontSize: "2.1rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            {nombresVistas[vistaActual] || ""}
          </span>
        </div>

        {/* Derecha: Hora y Fecha debajo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "2px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
                  padding: "5px 10px",
                  background: "#334155",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Inicio
              </button>
            )}
          </div>
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

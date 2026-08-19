import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Mercaderia from "./components/Mercaderia";

function App() {
  const [vistaActual, setVistaActual] = useState("inicio");
  const [paramsVista, setParamsVista] = useState({});
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navegarA = (vista, params = {}) => {
    setVistaActual(vista);
    setParamsVista(params);
  };

  const formatearFechaHora = (date) => {
    return date.toLocaleString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER SUPERIOR */}
      <header
        style={{
          background: "#0f172a",
          color: "white",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* LOGO Y MARCA (Izquierda) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
          onClick={() => navegarA("inicio")}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              background: "#22c55e",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            N1
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold" }}>
              Lubricentro "El Número Uno"
            </h1>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              Sistema Integral de Gestión
            </span>
          </div>
        </div>

        {/* NAVEGACIÓN Y FECHA (Alineado a la extrema derecha) */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {vistaActual !== "inicio" && (
            <button
              onClick={() => navegarA("inicio")}
              style={{
                background: "#334155",
                color: "white",
                border: "none",
                padding: "6px 14px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              🏠 Volver al Inicio
            </button>
          )}

          <div
            style={{
              fontSize: "0.8rem",
              color: "#cbd5e1",
              background: "#1e293b",
              padding: "5px 12px",
              borderRadius: "5px",
              border: "1px solid #334155",
              textTransform: "capitalize",
            }}
          >
            📅 {formatearFechaHora(fechaHora)}
          </div>
        </div>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <main style={{ padding: "10px 0" }}>
        {vistaActual === "inicio" && <Dashboard onNavigate={navegarA} />}
        {vistaActual === "mercaderia" && <Mercaderia />}
        {vistaActual === "servicios" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            🛠️ Módulo de Servicios - Próximamente
          </div>
        )}
        {vistaActual === "clientes" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            🚗 Módulo de Clientes{" "}
            {paramsVista.busqueda && `(Buscando: ${paramsVista.busqueda})`} -
            Próximamente
          </div>
        )}
        {vistaActual === "trabajo_realizado" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            📋 Módulo de Trabajo Realizado - Próximamente
          </div>
        )}
        {vistaActual === "turnos" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            📅 Módulo de Turnos - Próximamente
          </div>
        )}
        {vistaActual === "presupuestos" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            📄 Módulo de Presupuestos (Solo Productos) - Próximamente
          </div>
        )}
        {vistaActual === "caja" && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            💳 Módulo de Caja - Próximamente
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

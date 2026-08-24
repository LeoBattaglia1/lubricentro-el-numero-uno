import { useState } from "react";
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

  const handleNavigate = (vista, params = {}) => {
    setVistaActual(vista);
    setParamsNavegacion(params);
  };

  const handleVolver = () => {
    setVistaActual("dashboard");
    setParamsNavegacion({});
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* HEADER DE LA APLICACIÓN */}
      <header
        style={{
          backgroundColor: "#0f172a",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          onClick={handleVolver}
          style={{ margin: 0, fontSize: "1.4rem", cursor: "pointer" }}
        >
          🛠️ Taller Mecánico / Lubricentro
        </h1>
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
      </header>

      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      <main>
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

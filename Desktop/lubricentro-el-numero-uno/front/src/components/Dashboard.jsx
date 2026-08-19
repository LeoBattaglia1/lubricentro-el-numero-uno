import { useState } from "react";

const Dashboard = ({ onNavigate }) => {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModalTurnos, setMostrarModalTurnos] = useState(true);

  // Turnos de ejemplo para la ventana flotante del día
  const [turnosDelDia] = useState([
    {
      id: 1,
      hora: "09:00",
      cliente: "Juan Pérez",
      vehiculo: "Toyota Hilux (AB123CD)",
      servicio: "Cambio de Aceite y Filtro",
    },
    {
      id: 2,
      hora: "11:30",
      cliente: "Carlos Gómez",
      vehiculo: "VW Gol (AA456EF)",
      servicio: "Revisión General",
    },
    {
      id: 3,
      hora: "16:00",
      cliente: "María Rossi",
      vehiculo: "Ford EcoSport (AD789GH)",
      servicio: "Alineación y Balanza",
    },
  ]);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      onNavigate("clientes", { busqueda: busqueda.trim() });
    }
  };

  const modulos = [
    {
      id: "clientes",
      titulo: "Clientes y Vehículos",
      icono: "🚗",
      color: "#2e7d32",
      descripcion:
        "Fichas de clientes, historial de servicios por vehículo y patentes.",
    },
    {
      id: "mercaderia",
      titulo: "Mercadería",
      icono: "📦",
      color: "#1565c0",
      descripcion:
        "Control de inventario, aceites, filtros y precios de venta.",
    },
    {
      id: "servicios",
      titulo: "Servicios",
      icono: "🛠️",
      color: "#00838f",
      descripcion:
        "Listado de prestaciones ofrecidas y configuración de sus costos.",
    },
    {
      id: "trabajo_realizado",
      titulo: "Trabajo Realizado",
      icono: "📋",
      color: "#e65100",
      descripcion:
        "Registro de trabajos terminados, productos consumidos y cobro.",
    },
    {
      id: "turnos",
      titulo: "Turnos",
      icono: "📅",
      color: "#0284c7",
      descripcion: "Agenda e historial de turnos programados para el taller.",
    },
    {
      id: "presupuestos",
      titulo: "Presupuestos (PDF)",
      icono: "📄",
      color: "#37474f",
      descripcion: "Cotización rápida de productos para descargar o imprimir.",
    },
    {
      id: "caja",
      titulo: "Caja y Pagos",
      icono: "💳",
      color: "#6a1b9a",
      descripcion: "Flujo diario de caja, cobros y medios de pago recibidos.",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "15px 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* BUSCADOR RÁPIDO (MÁS COMPACTO) */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <span
          style={{
            fontSize: "0.95rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          🔍 Búsqueda rápida:
        </span>
        <form
          onSubmit={handleBuscar}
          style={{ display: "flex", gap: "8px", flex: "1", maxWidth: "600px" }}
        >
          <input
            type="text"
            placeholder="Ingrese patente o nombre del cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              flex: "1",
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: "none",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#22c55e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Buscar
          </button>
        </form>
      </div>

      {/* GRILLA DE MÓDULOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
        }}
      >
        {modulos.map((mod) => (
          <div
            key={mod.id}
            onClick={() => onNavigate(mod.id)}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "18px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.8rem",
                    background: "#f1f5f9",
                    padding: "6px",
                    borderRadius: "6px",
                  }}
                >
                  {mod.icono}
                </span>
                <h3 style={{ margin: 0, color: mod.color, fontSize: "1.1rem" }}>
                  {mod.titulo}
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  lineHeight: "1.35",
                }}
              >
                {mod.descripcion}
              </p>
            </div>
            <div
              style={{
                marginTop: "12px",
                textAlign: "right",
                color: mod.color,
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              Ingresar →
            </div>
          </div>
        ))}
      </div>

      {/* VENTANA FLOTANTE DE TURNOS DEL DÍA */}
      {mostrarModalTurnos && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "340px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            border: "2px solid #0284c7",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#0284c7",
              color: "white",
              padding: "10px 14px",
              display: "flex",
              justify: "space-between",
              alignItems: "center",
            }}
          >
            <strong style={{ fontSize: "0.9rem" }}>🔔 Turnos para Hoy</strong>
            <button
              onClick={() => setMostrarModalTurnos(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{ padding: "12px", maxHeight: "220px", overflowY: "auto" }}
          >
            {turnosDelDia.length === 0 ? (
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>
                No hay turnos agendados para hoy.
              </p>
            ) : (
              turnosDelDia.map((t) => (
                <div
                  key={t.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ color: "#0284c7" }}>⏰ {t.hora} hs</span>
                    <span>{t.vehiculo}</span>
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "#334155",
                      marginTop: "2px",
                    }}
                  >
                    {t.cliente} - <em>{t.servicio}</em>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            style={{
              background: "#f8fafc",
              padding: "8px",
              textAlign: "center",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <button
              onClick={() => onNavigate("turnos")}
              style={{
                background: "none",
                border: "none",
                color: "#0284c7",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Ver Agenda Completa →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

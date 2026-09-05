// components/Dashboard.jsx
import { useState, useEffect } from "react";

const ENDPOINT_TURNOS = "http://localhost:3000/api/turnos";
const ENDPOINT_ESCASES_STOCK = "http://localhost:3000/api/escasesdestock";

const Dashboard = ({ onNavigate }) => {
  const [mostrarModalTurnos, setMostrarModalTurnos] = useState(true);
  const [turnosDelDia, setTurnosDelDia] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);

  // Cargar turnos de hoy con fecha local correcta y escasez de stock
  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const [resTurnos, resEscasez] = await Promise.all([
          fetch(ENDPOINT_TURNOS),
          fetch(ENDPOINT_ESCASES_STOCK).catch(() => ({ ok: false })),
        ]);

        if (resTurnos.ok) {
          const todosLosTurnos = await resTurnos.json();

          // Obtener fecha actual local exacta (YYYY-MM-DD) para evitar desfase UTC
          const hoy = new Date();
          const anio = hoy.getFullYear();
          const mes = String(hoy.getMonth() + 1).padStart(2, "0");
          const dia = String(hoy.getDate()).padStart(2, "0");
          const hoyStr = `${anio}-${mes}-${dia}`;

          const filtrados = todosLosTurnos.filter((t) => {
            if (!t.fecha_hora) return false;
            return t.fecha_hora.startsWith(hoyStr);
          });

          setTurnosDelDia(filtrados);
        }

        if (resEscasez && resEscasez.ok) {
          const escasezData = await resEscasez.json();
          setProductosStockBajo(escasezData);
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    cargarDatosDashboard();
  }, []);

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
      titulo: "Mercadería y Proveedores",
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
      titulo: "Trabajo Realizado o venta",
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
        padding: "0 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* BANNER FIJO Y DISCRETO DE STOCK BAJO */}
      {productosStockBajo.length > 0 && (
        <div
          onClick={() => onNavigate("mercaderia")}
          style={{
            background: "#fff1f2",
            border: "1px solid #fecdd3",
            borderRadius: "6px",
            padding: "8px 14px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#ffe4e6")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff1f2")}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1rem" }}>⚠️</span>
            <span
              style={{
                fontSize: "0.84rem",
                fontWeight: "500",
                color: "#991b1b",
              }}
            >
              Atención: Hay <strong>{productosStockBajo.length}</strong>{" "}
              producto(s) con escasez de stock registrada.
            </span>
          </div>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: "bold",
              color: "#b91c1c",
            }}
          >
            Ver Mercadería y Proveedores →
          </span>
        </div>
      )}

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

      {/* BOTÓN FLOTANTE DE RESPALDO MANUAL (Inferior derecha) */}
      <div
        style={{
          position: "fixed",
          bottom: mostrarModalTurnos ? "10px" : "20px",
          right: "500px",
          zIndex: 999,
          transition: "bottom 0.3s ease",
        }}
      >
        <button
          onClick={async () => {
            try {
              const res = await fetch(
                "http://localhost:3000/api/backup/guardar-pendrive",
              );
              const data = await res.json();
              if (data.success) {
                alert("💾 ¡Respaldo guardado exitosamente en el pendrive!");
              } else {
                alert("⚠️ " + data.error);
              }
            } catch {
              alert(
                "❌ No se pudo conectar con el servidor para hacer el respaldo.",
              );
            }
          }}
          style={{
            background: "#0284c7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            fontWeight: "bold",
            fontSize: "0.85rem",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          title="Guardar copia de seguridad directamente en el pendrive"
        >
          💾 Guardar en Pendrive
        </button>
      </div>

      {/* VENTANA FLOTANTE DE TURNOS DE HOY */}
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
              justifyContent: "space-between",
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
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                No hay turnos agendados para hoy.
              </p>
            ) : (
              turnosDelDia.map((t) => {
                const horaTurno = t.fecha_hora.split(" ")[1]?.slice(0, 5) || "";
                return (
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
                      <span style={{ color: "#0284c7" }}>
                        ⏰ {horaTurno} hs
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#334155",
                        marginTop: "2px",
                      }}
                    >
                      {t.cliente_nombre ||
                        `Cliente ID: ${t.cliente_id || "Genérico"}`}{" "}
                      - <em>{t.observaciones || "Sin observaciones"}</em>
                    </div>
                  </div>
                );
              })
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

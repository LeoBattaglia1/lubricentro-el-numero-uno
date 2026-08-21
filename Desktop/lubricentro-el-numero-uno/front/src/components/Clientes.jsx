import { useState, useEffect } from "react";

// --- ESTILOS EN LÍNEA PARA UI MODERNA Y LIMPIA ---
const styles = {
  container: {
    padding: "24px",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#2c3e50",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  header: {
    margin: "0 0 20px 0",
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#1a252f",
  },
  searchBarContainer: {
    marginBottom: "20px",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ced4da",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "10px 18px",
    backgroundColor: "#0d6efd",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.95rem",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(13, 110, 253, 0.2)",
    transition: "background-color 0.2s",
  },
  btnSecondary: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "500",
    cursor: "pointer",
  },
  panelGrid: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
  },
  cardLeft: {
    flex: "1",
    width: "50%",
    maxHeight: "80vh",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e9ecef",
  },
  cardRight: {
    flex: "1",
    width: "50%",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid #e9ecef",
    minHeight: "320px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "14px 16px",
    backgroundColor: "#f1f3f5",
    borderBottom: "2px solid #dee2e6",
    fontWeight: "600",
    color: "#495057",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e9ecef",
    fontSize: "0.95rem",
  },
  linkBtn: {
    color: "#0d6efd",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "none",
  },
  autoBadge: {
    display: "inline-block",
    backgroundColor: "#e7f5ff",
    color: "#1864ab",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    fontWeight: "500",
    cursor: "pointer",
    marginLeft: "4px",
  },
  deudaBox: (tieneDeuda) => ({
    margin: "16px 0",
    padding: "12px 16px",
    backgroundColor: tieneDeuda ? "#fff5f5" : "#ebfbee",
    borderLeft: `4px solid ${tieneDeuda ? "#fa5252" : "#40c057"}`,
    borderRadius: "4px",
    fontWeight: "600",
    color: tieneDeuda ? "#c92a2a" : "#2b8a3e",
  }),
  kmBox: {
    margin: "10px 0",
    padding: "10px 14px",
    backgroundColor: "#f0f8ff",
    borderLeft: "4px solid #007bff",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
};

// Helper reutilizable para peticiones al servidor
const fetchDatosServidor = async () => {
  const [resClientes, resAutos, resClienteAuto] = await Promise.all([
    fetch("http://localhost:3000/api/clientes"),
    fetch("http://localhost:3000/api/autos"),
    fetch("http://localhost:3000/api/cliente-auto"),
  ]);

  if (!resClientes.ok || !resAutos.ok) {
    throw new Error("Error en las peticiones al servidor");
  }

  const dataClientes = await resClientes.json();
  const dataAutos = await resAutos.json();
  const dataCA = resClienteAuto.ok ? await resClienteAuto.json() : [];

  return { dataClientes, dataAutos, dataCA };
};

export default function Clientes() {
  // Estados Principales
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [clienteAuto, setClienteAuto] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Estado Panel Derecho
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });
  const [deudaCliente, setDeudaCliente] = useState(0);
  const [historialAuto, setHistorialAuto] = useState([]);
  const [loadingPanel, setLoadingPanel] = useState(false);

  // Estados Formularios
  const [formDataCliente, setFormDataCliente] = useState({
    nombre: "",
    telefono: "",
  });
  const [editClienteData, setEditClienteData] = useState({
    id: "",
    nombre: "",
    telefono: "",
  });

  // CARGA INICIAL DE DATOS (Sin errores de ESLint)
  useEffect(() => {
    let unmounted = false;

    fetchDatosServidor()
      .then(({ dataClientes, dataAutos, dataCA }) => {
        if (!unmounted) {
          setClientes(dataClientes);
          setAutos(dataAutos);
          setClienteAuto(dataCA);
        }
      })
      .catch((err) => console.error("Error al cargar datos:", err));

    return () => {
      unmounted = true;
    };
  }, []);

  // Función para sincronizar la lista luego de un POST/PUT
  const recargarDatos = async () => {
    try {
      const { dataClientes, dataAutos, dataCA } = await fetchDatosServidor();
      setClientes(dataClientes);
      setAutos(dataAutos);
      setClienteAuto(dataCA);
    } catch (error) {
      console.error("Error al recargar los datos:", error);
    }
  };

  // Obtener autos asociados a un cliente
  const getAutosDeCliente = (clienteId) => {
    const relaciones = clienteAuto.filter((ca) => ca.cliente_id === clienteId);
    const autosIds = relaciones.map((r) => r.auto_id);
    return autos.filter((a) => autosIds.includes(a.id));
  };

  // Filtro de búsqueda
  const clientesFiltrados = clientes.filter((c) => {
    const query = busqueda.toLowerCase().trim();
    if (!query) return true;

    const coincideCliente = c.nombre?.toLowerCase().includes(query);
    const autosDelCliente = getAutosDeCliente(c.id);
    const coincideAuto = autosDelCliente.some(
      (a) =>
        a.marca_modelo?.toLowerCase().includes(query) ||
        a.patente?.toLowerCase().includes(query),
    );

    return coincideCliente || coincideAuto;
  });

  // SELECCIONAR CLIENTE
  const handleSeleccionarCliente = async (cliente) => {
    setLoadingPanel(true);
    setVistaPanel({ tipo: "cliente", data: cliente });

    try {
      const resPagos = await fetch(
        `http://localhost:3000/api/pagos/cliente/${cliente.id}`,
      );
      if (resPagos.ok) {
        const pagos = await resPagos.json();
        const totalPendiente = pagos
          .filter((p) => p.estado === "Pendiente" || !p.metodo_pago)
          .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
        setDeudaCliente(totalPendiente);
      } else {
        setDeudaCliente(0);
      }
    } catch (error) {
      console.error("Error al obtener deudas:", error);
      setDeudaCliente(0);
    } finally {
      setLoadingPanel(false);
    }
  };

  // SELECCIONAR AUTO
  const handleSeleccionarAuto = async (auto) => {
    setLoadingPanel(true);
    setVistaPanel({ tipo: "auto", data: auto });

    try {
      const resHistorial = await fetch(
        `http://localhost:3000/api/historial-servicios/auto/${auto.id}`,
      );
      if (resHistorial.ok) {
        const dataHistorial = await resHistorial.json();
        setHistorialAuto(dataHistorial);
      } else {
        setHistorialAuto([]);
      }
    } catch (error) {
      console.error("Error al cargar historial del auto:", error);
      setHistorialAuto([]);
    } finally {
      setLoadingPanel(false);
    }
  };

  // GUARDAR EDICIÓN CLIENTE
  const handleGuardarEdicionCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3000/api/clientes/${editClienteData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: editClienteData.nombre,
            telefono: editClienteData.telefono,
          }),
        },
      );

      if (res.ok) {
        await recargarDatos();
        handleSeleccionarCliente(editClienteData);
      } else {
        alert("No se pudo actualizar la información del cliente.");
      }
    } catch (error) {
      console.error("Error al editar cliente:", error);
    }
  };

  // CREAR CLIENTE NUEVO
  const handleCrearCliente = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataCliente),
      });

      if (res.ok) {
        setFormDataCliente({ nombre: "", telefono: "" });
        setVistaPanel({ tipo: null, data: null });
        await recargarDatos();
      } else {
        alert("Error al registrar el nuevo cliente.");
      }
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Clientes y Vehículos</h1>

      {/* Buscador y Botón Crear */}
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar por cliente, auto o patente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.input, width: "380px" }}
        />
        <button
          onClick={() => setVistaPanel({ tipo: "nuevo_cliente", data: null })}
          style={styles.btnPrimary}
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Grid Principal */}
      <div style={styles.panelGrid}>
        {/* TABLA IZQUIERDA */}
        <div style={styles.cardLeft}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Clientes y Vehículos Registrados</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => {
                  const autosDelCliente = getAutosDeCliente(cliente.id);

                  return (
                    <tr key={cliente.id}>
                      <td style={styles.td}>
                        <span
                          style={styles.linkBtn}
                          onClick={() => handleSeleccionarCliente(cliente)}
                        >
                          👤 {cliente.nombre}
                        </span>
                        <span style={{ color: "#6c757d", marginLeft: "6px" }}>
                          ({cliente.telefono})
                        </span>

                        {autosDelCliente.length > 0 && (
                          <div style={{ marginTop: "6px" }}>
                            {autosDelCliente.map((auto) => (
                              <span
                                key={auto.id}
                                style={styles.autoBadge}
                                onClick={() => handleSeleccionarAuto(auto)}
                              >
                                🚗 {auto.marca_modelo} ({auto.patente})
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td style={{ ...styles.td, color: "#8c9bba" }}>
                    No se encontraron registros coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PANEL DERECHO DE INFORMACIÓN */}
        <div style={styles.cardRight}>
          {loadingPanel && (
            <p style={{ color: "#6c757d" }}>⏳ Cargando datos...</p>
          )}

          {!loadingPanel && vistaPanel.tipo === null && (
            <div
              style={{
                textAlign: "center",
                paddingTop: "40px",
                color: "#adb5bd",
              }}
            >
              <p style={{ fontSize: "1.1rem" }}>
                👈 Seleccioná un cliente o un vehículo para ver los detalles.
              </p>
            </div>
          )}

          {/* VISTA: Detalle de Cliente */}
          {!loadingPanel &&
            vistaPanel.tipo === "cliente" &&
            vistaPanel.data && (
              <div>
                <h2 style={{ margin: "0 0 10px 0", color: "#212529" }}>
                  {vistaPanel.data.nombre}
                </h2>
                <p style={{ margin: "5px 0", fontSize: "1rem" }}>
                  <strong>Teléfono:</strong> {vistaPanel.data.telefono}
                </p>

                <div style={styles.deudaBox(deudaCliente > 0)}>
                  {deudaCliente > 0
                    ? `⚠️ Deuda acumulada: $${deudaCliente}`
                    : "✓ El cliente no posee deudas pendientes"}
                </div>

                <button
                  onClick={() => {
                    setEditClienteData({
                      id: vistaPanel.data.id,
                      nombre: vistaPanel.data.nombre,
                      telefono: vistaPanel.data.telefono,
                    });
                    setVistaPanel({
                      tipo: "editar_cliente",
                      data: vistaPanel.data,
                    });
                  }}
                  style={styles.btnSecondary}
                >
                  ✏️ Editar Cliente
                </button>
              </div>
            )}

          {/* VISTA: Editar Cliente */}
          {!loadingPanel && vistaPanel.tipo === "editar_cliente" && (
            <div>
              <h3 style={{ marginTop: 0 }}>Editar Datos del Cliente</h3>
              <form onSubmit={handleGuardarEdicionCliente}>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    style={{ ...styles.input, width: "100%" }}
                    value={editClienteData.nombre}
                    onChange={(e) =>
                      setEditClienteData({
                        ...editClienteData,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    required
                    style={{ ...styles.input, width: "100%" }}
                    value={editClienteData.telefono}
                    onChange={(e) =>
                      setEditClienteData({
                        ...editClienteData,
                        telefono: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={styles.btnPrimary}>
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeleccionarCliente(vistaPanel.data)}
                    style={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VISTA: Detalle y Historial del Vehículo */}
          {!loadingPanel && vistaPanel.tipo === "auto" && vistaPanel.data && (
            <div>
              <h2 style={{ margin: "0 0 5px 0" }}>
                🚗 {vistaPanel.data.marca_modelo}
              </h2>
              <p style={{ color: "#6c757d", margin: "0 0 15px 0" }}>
                Patente: <strong>{vistaPanel.data.patente}</strong>
              </p>

              <h4
                style={{
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "6px",
                }}
              >
                Historial de Servicios
              </h4>

              {historialAuto.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {historialAuto.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "14px",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "0.9rem",
                          color: "#6c757d",
                        }}
                      >
                        <strong>Fecha:</strong> {item.fecha || "Sin fecha"}
                      </p>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "1rem",
                          fontWeight: "600",
                        }}
                      >
                        Servicio: {item.servicio}
                      </p>

                      {/* INFORMACIÓN DE KILOMETRAJE */}
                      <div style={styles.kmBox}>
                        <p style={{ margin: "0 0 4px 0" }}>
                          <strong>Km Actuales:</strong>{" "}
                          {item.kilometros_actuales
                            ? `${item.kilometros_actuales} km`
                            : "No especificado"}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#0056b3",
                            fontWeight: "bold",
                          }}
                        >
                          🛠️ Próximo Cambio:{" "}
                          {item.kilometros_proximo_cambio
                            ? `${item.kilometros_proximo_cambio} km`
                            : "No especificado"}
                        </p>
                      </div>

                      <p
                        style={{
                          margin: "8px 0 4px 0",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                        }}
                      >
                        Mercadería / Insumos:
                      </p>
                      {item.mercaderia && item.mercaderia.length > 0 ? (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.mercaderia.map((m, mIdx) => (
                            <li key={mIdx}>
                              {m.nombre_producto} (Cant: {m.cantidad})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em style={{ fontSize: "0.85rem", color: "#8c9bba" }}>
                          Sin insumos registrados para este servicio.
                        </em>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6c757d" }}>
                  No hay registros de servicio guardados para este vehículo.
                </p>
              )}
            </div>
          )}

          {/* VISTA: Nuevo Cliente */}
          {!loadingPanel && vistaPanel.tipo === "nuevo_cliente" && (
            <div>
              <h3 style={{ marginTop: 0 }}>Registrar Nuevo Cliente</h3>
              <form onSubmit={handleCrearCliente}>
                <div style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    style={{ ...styles.input, width: "100%" }}
                    value={formDataCliente.nombre}
                    onChange={(e) =>
                      setFormDataCliente({
                        ...formDataCliente,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 2494123456"
                    style={{ ...styles.input, width: "100%" }}
                    value={formDataCliente.telefono}
                    onChange={(e) =>
                      setFormDataCliente({
                        ...formDataCliente,
                        telefono: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={styles.btnPrimary}>
                    Guardar Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setVistaPanel({ tipo: null, data: null })}
                    style={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

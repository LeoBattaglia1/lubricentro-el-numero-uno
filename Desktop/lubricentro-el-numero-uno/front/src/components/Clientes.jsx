import { useState, useEffect } from "react";

// Estilos centralizados en JS
const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#1a202c",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  cardLeft: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardRight: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    minHeight: "400px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 8px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
  },
  td: {
    padding: "12px 8px",
    borderBottom: "1px solid #edf2f7",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnSecondary: {
    padding: "8px 16px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnSuccess: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  linkBtn: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "600",
  },
  autoBadge: {
    display: "inline-block",
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    marginRight: "6px",
    marginTop: "4px",
    cursor: "pointer",
  },
  autoCardEdit: {
    padding: "12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  unassignedBox: {
    border: "1px dashed #3b82f6",
    backgroundColor: "#eff6ff",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  deudaBox: (hasDeuda) => ({
    padding: "12px",
    borderRadius: "6px",
    margin: "16px 0",
    fontWeight: "bold",
    backgroundColor: hasDeuda ? "#fef2f2" : "#f0fdf4",
    color: hasDeuda ? "#991b1b" : "#166534",
    border: `1px solid ${hasDeuda ? "#fecaca" : "#bbf7d0"}`,
  }),
  kmBox: {
    backgroundColor: "#f1f5f9",
    padding: "10px",
    borderRadius: "6px",
    margin: "8px 0",
  },
};

// Petición reutilizable
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

  // Formulario Nuevo Cliente
  const [formDataCliente, setFormDataCliente] = useState({
    nombre: "",
    telefono: "",
  });
  const [autosNuevosParaCliente, setAutosNuevosParaCliente] = useState([]);
  const [idsAutosHuerfanosSeleccionados, setIdsAutosHuerfanosSeleccionados] =
    useState([]);

  // Formulario Nuevo Auto Huérfano
  const [formDataNuevoAuto, setFormDataNuevoAuto] = useState({
    marca_modelo: "",
    patente: "",
  });

  // Edición de Cliente
  const [editClienteData, setEditClienteData] = useState({
    id: "",
    nombre: "",
    telefono: "",
  });
  const [editAutosCliente, setEditAutosCliente] = useState([]);
  const [nuevoAutoData, setNuevoAutoData] = useState({
    marca_modelo: "",
    patente: "",
  });
  const [mostrarFormNuevoAuto, setMostrarFormNuevoAuto] = useState(false);
  const [autoAEliminar, setAutoAEliminar] = useState(null);

  // EFECTO DE CARGA: Definimos la lógica internamente para evitar warnings de dependencias y hoisted errors
  useEffect(() => {
    async function cargar() {
      try {
        const { dataClientes, dataAutos, dataCA } = await fetchDatosServidor();
        setClientes(dataClientes);
        setAutos(dataAutos);
        setClienteAuto(dataCA);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }
    cargar();
  }, []);

  // Función reutilizable para recargar datos cuando se envían formularios
  async function recargarDatos() {
    try {
      const { dataClientes, dataAutos, dataCA } = await fetchDatosServidor();
      setClientes(dataClientes);
      setAutos(dataAutos);
      setClienteAuto(dataCA);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  // Helper: Autos asignados a un cliente
  const getAutosDeCliente = (clienteId) => {
    const relaciones = clienteAuto.filter((ca) => ca.cliente_id === clienteId);
    const autosIds = relaciones.map((r) => r.auto_id);
    return autos.filter((a) => autosIds.includes(a.id));
  };

  // Helper: Autos sin ningún cliente asignado
  const getAutosSinCliente = () => {
    const autosAsignadosIds = clienteAuto.map((ca) => ca.auto_id);
    return autos.filter((a) => !autosAsignadosIds.includes(a.id));
  };

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
      console.error("Error al cargar historial:", error);
      setHistorialAuto([]);
    } finally {
      setLoadingPanel(false);
    }
  };

  // --- CREAR SOLO UN AUTO (SIN CLIENTE) ---
  const handleCrearAutoSolo = async (e) => {
    e.preventDefault();
    if (!formDataNuevoAuto.marca_modelo || !formDataNuevoAuto.patente) {
      alert("Completá todos los campos del vehículo.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/autos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataNuevoAuto),
      });

      if (res.ok) {
        setFormDataNuevoAuto({ marca_modelo: "", patente: "" });
        await recargarDatos();
        setVistaPanel({ tipo: null, data: null });
        alert("Vehículo creado exitosamente sin cliente asignado.");
      } else {
        alert("No se pudo registrar el vehículo.");
      }
    } catch (error) {
      console.error("Error al crear auto sin cliente:", error);
    }
  };

  // --- CREAR NUEVO CLIENTE (CON OPCIONES DE AUTOS NUEVOS Y HUÉRFANOS) ---
  const handleAbrirFormNuevoCliente = () => {
    setFormDataCliente({ nombre: "", telefono: "" });
    setAutosNuevosParaCliente([]);
    setIdsAutosHuerfanosSeleccionados([]);
    setVistaPanel({ tipo: "nuevo_cliente", data: null });
  };

  const handleAgregarFormAutoNuevoACrear = () => {
    setAutosNuevosParaCliente((prev) => [
      ...prev,
      { marca_modelo: "", patente: "" },
    ]);
  };

  const handleToggleAutoHuerfanoNuevoCliente = (autoId) => {
    setIdsAutosHuerfanosSeleccionados((prev) =>
      prev.includes(autoId)
        ? prev.filter((id) => id !== autoId)
        : [...prev, autoId],
    );
  };

  const handleCrearClienteCompleto = async (e) => {
    e.preventDefault();
    try {
      // 1. Crear el cliente
      const resCliente = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataCliente),
      });

      if (!resCliente.ok) {
        alert("Error al crear el cliente.");
        return;
      }

      const clienteCreado = await resCliente.json();
      const clienteId = clienteCreado.id || clienteCreado.insertId;

      // 2. Crear y asociar los autos nuevos que se agregaron
      for (const auto of autosNuevosParaCliente) {
        if (auto.marca_modelo && auto.patente) {
          const resAuto = await fetch("http://localhost:3000/api/autos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(auto),
          });

          if (resAuto.ok) {
            const autoCreado = await resAuto.json();
            const autoId = autoCreado.id || autoCreado.insertId;

            await fetch("http://localhost:3000/api/cliente-auto", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cliente_id: clienteId, auto_id: autoId }),
            });
          }
        }
      }

      // 3. Asociar los autos huérfanos previamente seleccionados
      for (const autoId of idsAutosHuerfanosSeleccionados) {
        await fetch("http://localhost:3000/api/cliente-auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente_id: clienteId, auto_id: autoId }),
        });
      }

      await recargarDatos();
      setVistaPanel({ tipo: null, data: null });
    } catch (error) {
      console.error("Error al registrar cliente con vehículos:", error);
    }
  };

  // --- EDITAR CLIENTE Y VINCULAR HUÉRFANOS ---
  const handleAbrirEdicionCliente = (cliente) => {
    setEditClienteData({
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
    });
    setEditAutosCliente(getAutosDeCliente(cliente.id));
    setMostrarFormNuevoAuto(false);
    setNuevoAutoData({ marca_modelo: "", patente: "" });
    setVistaPanel({ tipo: "editar_cliente", data: cliente });
  };

  const handleVincularAutoHuerfanoAEdit = async (autoId) => {
    try {
      const res = await fetch("http://localhost:3000/api/cliente-auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: editClienteData.id,
          auto_id: autoId,
        }),
      });

      if (res.ok) {
        await recargarDatos();
        const autoVinculado = autos.find((a) => a.id === autoId);
        if (autoVinculado) {
          setEditAutosCliente((prev) => [...prev, autoVinculado]);
        }
      }
    } catch (error) {
      console.error("Error al vincular auto huérfano:", error);
    }
  };

  const handleGuardarEdicionCliente = async (e) => {
    e.preventDefault();
    try {
      const resCliente = await fetch(
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

      const promesasAutos = editAutosCliente.map((auto) =>
        fetch(`http://localhost:3000/api/autos/${auto.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            marca_modelo: auto.marca_modelo,
            patente: auto.patente,
          }),
        }),
      );

      await Promise.all(promesasAutos);

      if (resCliente.ok) {
        await recargarDatos();
        handleSeleccionarCliente(editClienteData);
      } else {
        alert("No se pudo actualizar completamente la información.");
      }
    } catch (error) {
      console.error("Error al editar cliente y autos:", error);
    }
  };

  const handleAgregarAutoACliente = async () => {
    if (!nuevoAutoData.marca_modelo || !nuevoAutoData.patente) {
      alert("Completá los datos del vehículo.");
      return;
    }

    try {
      const resAuto = await fetch("http://localhost:3000/api/autos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoAutoData),
      });

      if (resAuto.ok) {
        const autoCreado = await resAuto.json();
        const autoId = autoCreado.id || autoCreado.insertId;

        await fetch("http://localhost:3000/api/cliente-auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: editClienteData.id,
            auto_id: autoId,
          }),
        });

        await recargarDatos();
        setEditAutosCliente((prev) => [
          ...prev,
          { id: autoId, ...nuevoAutoData },
        ]);
        setNuevoAutoData({ marca_modelo: "", patente: "" });
        setMostrarFormNuevoAuto(false);
      } else {
        alert("Error al registrar el nuevo vehículo.");
      }
    } catch (error) {
      console.error("Error al agregar auto:", error);
    }
  };

  const handleConfirmarEliminarAuto = async () => {
    if (!autoAEliminar) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/autos/${autoAEliminar.id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setEditAutosCliente((prev) =>
          prev.filter((a) => a.id !== autoAEliminar.id),
        );
        await recargarDatos();
      } else {
        alert("No se pudo eliminar el vehículo.");
      }
    } catch (error) {
      console.error("Error al eliminar auto:", error);
    } finally {
      setAutoAEliminar(null);
    }
  };

  const autosHuerfanos = getAutosSinCliente();

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Clientes y Vehículos</h1>

      {/* Buscador y Botones Principales */}
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar por cliente, auto o patente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.input, width: "360px" }}
        />

        <div style={styles.actionButtons}>
          <button
            onClick={() =>
              setVistaPanel({ tipo: "nuevo_auto_solo", data: null })
            }
            style={styles.btnSecondary}
          >
            + Nuevo Auto
          </button>
          <button
            onClick={handleAbrirFormNuevoCliente}
            style={styles.btnPrimary}
          >
            + Nuevo Cliente
          </button>
        </div>
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

        {/* PANEL DERECHO */}
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
                  onClick={() => handleAbrirEdicionCliente(vistaPanel.data)}
                  style={styles.btnSecondary}
                >
                  ✏️ Editar Cliente / Autos
                </button>
              </div>
            )}

          {/* VISTA: Formulario Nuevo Auto Sin Cliente */}
          {!loadingPanel && vistaPanel.tipo === "nuevo_auto_solo" && (
            <div>
              <h3 style={{ marginTop: 0 }}>
                Registrar Nuevo Auto (Sin Cliente)
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                Cargá un vehículo cuando aún no se conocen los datos del dueño.
                Podrás asignarlo a un cliente más adelante.
              </p>
              <form onSubmit={handleCrearAutoSolo}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Marca y Modelo:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ford Focus"
                    style={{ ...styles.input, width: "100%" }}
                    value={formDataNuevoAuto.marca_modelo}
                    onChange={(e) =>
                      setFormDataNuevoAuto({
                        ...formDataNuevoAuto,
                        marca_modelo: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Patente / Dominio:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: AB123CD"
                    style={{ ...styles.input, width: "100%" }}
                    value={formDataNuevoAuto.patente}
                    onChange={(e) =>
                      setFormDataNuevoAuto({
                        ...formDataNuevoAuto,
                        patente: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={styles.btnSuccess}>
                    Guardar Vehículo
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

          {/* VISTA: Registrar Nuevo Cliente (Con Opción de Autos Nuevos y Sin Cliente) */}
          {!loadingPanel && vistaPanel.tipo === "nuevo_cliente" && (
            <div>
              <h3 style={{ marginTop: 0 }}>Registrar Nuevo Cliente</h3>
              <form onSubmit={handleCrearClienteCompleto}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
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
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono de Contacto:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 11 1234-5678"
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

                {/* OPCION 1: AUTOS HUÉRFANOS DISPONIBLES */}
                {autosHuerfanos.length > 0 && (
                  <div style={styles.unassignedBox}>
                    <strong
                      style={{
                        color: "#1e40af",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      💡 Autos sin cliente registrados previamente:
                    </strong>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {autosHuerfanos.map((auto) => {
                        const isChecked =
                          idsAutosHuerfanosSeleccionados.includes(auto.id);
                        return (
                          <label
                            key={auto.id}
                            style={{ fontSize: "0.9rem", cursor: "pointer" }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handleToggleAutoHuerfanoNuevoCliente(auto.id)
                              }
                              style={{ marginRight: "8px" }}
                            />
                            {auto.marca_modelo} ({auto.patente})
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* OPCION 2: CARGAR AUTOS NUEVOS JUNTO AL CLIENTE */}
                <h4 style={{ margin: "16px 0 8px 0" }}>🚗 Vehículos Nuevos</h4>
                {autosNuevosParaCliente.map((auto, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
                  >
                    <input
                      type="text"
                      placeholder="Marca y Modelo"
                      value={auto.marca_modelo}
                      onChange={(e) => {
                        const copia = [...autosNuevosParaCliente];
                        copia[idx].marca_modelo = e.target.value;
                        setAutosNuevosParaCliente(copia);
                      }}
                      style={{ ...styles.input, flex: "2" }}
                    />
                    <input
                      type="text"
                      placeholder="Patente"
                      value={auto.patente}
                      onChange={(e) => {
                        const copia = [...autosNuevosParaCliente];
                        copia[idx].patente = e.target.value;
                        setAutosNuevosParaCliente(copia);
                      }}
                      style={{ ...styles.input, flex: "1" }}
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAgregarFormAutoNuevoACrear}
                  style={{
                    ...styles.btnSecondary,
                    marginBottom: "20px",
                    display: "block",
                  }}
                >
                  + Formulario de Otro Auto
                </button>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" style={styles.btnPrimary}>
                    Guardar Cliente y Vehículos
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

          {/* VISTA: Editar Cliente y Autos (Incluye Vincular Huérfanos) */}
          {!loadingPanel && vistaPanel.tipo === "editar_cliente" && (
            <div>
              <h3 style={{ marginTop: 0 }}>Editar Cliente y Vehículos</h3>
              <form onSubmit={handleGuardarEdicionCliente}>
                <div style={{ marginBottom: "12px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "4px",
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
                      marginBottom: "4px",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono:
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

                {/* SUGERENCIA: AUTOS SIN CLIENTE PARA VINCULAR AHORA */}
                {autosHuerfanos.length > 0 && (
                  <div style={styles.unassignedBox}>
                    <strong
                      style={{
                        color: "#1e40af",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      🔗 Vincular autos existentes sin cliente:
                    </strong>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {autosHuerfanos.map((auto) => (
                        <div
                          key={auto.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "0.9rem" }}>
                            {auto.marca_modelo} ({auto.patente})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleVincularAutoHuerfanoAEdit(auto.id)
                            }
                            style={{
                              ...styles.btnSuccess,
                              padding: "4px 8px",
                              fontSize: "0.8rem",
                            }}
                          >
                            + Asignar a este cliente
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h4 style={{ marginBottom: "10px", marginTop: "16px" }}>
                  🚗 Vehículos Asignados
                </h4>

                {editAutosCliente.length > 0 ? (
                  editAutosCliente.map((auto, idx) => (
                    <div key={auto.id} style={styles.autoCardEdit}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={auto.marca_modelo}
                          onChange={(e) => {
                            const copia = [...editAutosCliente];
                            copia[idx].marca_modelo = e.target.value;
                            setEditAutosCliente(copia);
                          }}
                          style={{ ...styles.input, flex: "2" }}
                        />
                        <input
                          type="text"
                          value={auto.patente}
                          onChange={(e) => {
                            const copia = [...editAutosCliente];
                            copia[idx].patente = e.target.value;
                            setEditAutosCliente(copia);
                          }}
                          style={{ ...styles.input, flex: "1" }}
                        />
                        <button
                          type="button"
                          onClick={() => setAutoAEliminar(auto)}
                          style={styles.btnDanger}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                    Este cliente no tiene vehículos asignados.
                  </p>
                )}

                {/* Confirmación para eliminar auto */}
                {autoAEliminar && (
                  <div
                    style={{
                      ...styles.autoCardEdit,
                      backgroundColor: "#fef2f2",
                      borderColor: "#fecaca",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#991b1b",
                        fontSize: "0.9rem",
                      }}
                    >
                      ¿Confirmas eliminar el vehículo{" "}
                      <strong>{autoAEliminar.marca_modelo}</strong> (
                      {autoAEliminar.patente})?
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={handleConfirmarEliminarAuto}
                        style={styles.btnDanger}
                      >
                        Sí, eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => setAutoAEliminar(null)}
                        style={styles.btnSecondary}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {!mostrarFormNuevoAuto ? (
                  <button
                    type="button"
                    onClick={() => setMostrarFormNuevoAuto(true)}
                    style={{
                      ...styles.btnSuccess,
                      marginTop: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    + Agregar Nuevo Auto
                  </button>
                ) : (
                  <div
                    style={{
                      ...styles.autoCardEdit,
                      backgroundColor: "#eef9f1",
                      borderColor: "#c3e6cb",
                      margin: "12px 0 20px 0",
                    }}
                  >
                    <h5 style={{ margin: "0 0 8px 0" }}>
                      Nuevo Vehículo para el Cliente
                    </h5>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Marca y Modelo"
                        value={nuevoAutoData.marca_modelo}
                        onChange={(e) =>
                          setNuevoAutoData({
                            ...nuevoAutoData,
                            marca_modelo: e.target.value,
                          })
                        }
                        style={{ ...styles.input, flex: "2" }}
                      />
                      <input
                        type="text"
                        placeholder="Patente"
                        value={nuevoAutoData.patente}
                        onChange={(e) =>
                          setNuevoAutoData({
                            ...nuevoAutoData,
                            patente: e.target.value,
                          })
                        }
                        style={{ ...styles.input, flex: "1" }}
                      />
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                    >
                      <button
                        type="button"
                        onClick={handleAgregarAutoACliente}
                        style={styles.btnSuccess}
                      >
                        Confirmar y Asignar
                      </button>
                      <button
                        type="button"
                        onClick={() => setMostrarFormNuevoAuto(false)}
                        style={styles.btnSecondary}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

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

          {/* VISTA: Detalle de Vehículo e Historial */}
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
        </div>
      </div>
    </div>
  );
}

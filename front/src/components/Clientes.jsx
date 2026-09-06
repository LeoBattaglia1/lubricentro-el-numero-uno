import { useState, useEffect } from "react";

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
    alignItems: "start",
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
    position: "sticky",
    top: "24px",
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
  toastSuccess: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    border: "1px solid #86efac",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  toastError: {
    backgroundColor: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  const fechaLimpia = fechaStr.split("T")[0].split(" ")[0];
  const partes = fechaLimpia.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return fechaStr;
};

const fetchDatosServidor = async () => {
  const [
    resClientes,
    resAutos,
    resClienteAuto,
    resServicios,
    resMercaderiaCatalogo,
  ] = await Promise.all([
    fetch("http://localhost:3000/api/clientes"),
    fetch("http://localhost:3000/api/autos"),
    fetch("http://localhost:3000/api/cliente-auto"),
    fetch("http://localhost:3000/api/servicios").catch(() => ({ ok: false })),
    fetch("http://localhost:3000/api/mercaderia").catch(() => ({ ok: false })),
  ]);

  if (!resClientes.ok || !resAutos.ok) {
    throw new Error("Error en las peticiones al servidor");
  }

  const dataClientes = await resClientes.json();
  const dataAutos = await resAutos.json();
  const dataCA = resClienteAuto.ok ? await resClienteAuto.json() : [];
  const dataServicios = resServicios.ok ? await resServicios.json() : [];
  const dataMercaderia = resMercaderiaCatalogo.ok
    ? await resMercaderiaCatalogo.json()
    : [];

  return { dataClientes, dataAutos, dataCA, dataServicios, dataMercaderia };
};

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [clienteAuto, setClienteAuto] = useState([]);
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  const [mercaderiaCatalogo, setMercaderiaCatalogo] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });
  const [deudaCliente, setDeudaCliente] = useState(0);
  const [pagosPendientesCliente, setPagosPendientesCliente] = useState([]);
  const [historialAuto, setHistorialAuto] = useState([]);
  const [loadingPanel, setLoadingPanel] = useState(false);

  const [formDataCliente, setFormDataCliente] = useState({
    nombre: "",
    telefono: "",
  });
  const [autosNuevosParaCliente, setAutosNuevosParaCliente] = useState([]);
  const [idsAutosHuerfanosSeleccionados, setIdsAutosHuerfanosSeleccionados] =
    useState([]);

  const [formDataNuevoAuto, setFormDataNuevoAuto] = useState({
    marca_modelo: "",
    patente: "",
  });

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
  const [autoADesvincular, setAutoADesvincular] = useState(null);

  // Estado para controlar el modal de bloqueo por deuda
  const [mostrarModalDeuda, setMostrarModalDeuda] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const {
          dataClientes,
          dataAutos,
          dataCA,
          dataServicios,
          dataMercaderia,
        } = await fetchDatosServidor();
        setClientes(dataClientes);
        setAutos(dataAutos);
        setClienteAuto(dataCA);
        setServiciosCatalogo(dataServicios);
        setMercaderiaCatalogo(dataMercaderia);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    }
    cargar();
  }, []);

  async function recargarDatos() {
    try {
      const { dataClientes, dataAutos, dataCA, dataServicios, dataMercaderia } =
        await fetchDatosServidor();
      setClientes(dataClientes);
      setAutos(dataAutos);
      setClienteAuto(dataCA);
      setServiciosCatalogo(dataServicios);
      setMercaderiaCatalogo(dataMercaderia);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  const mostrarExito = (mensaje) => {
    setMensajeError("");
    setMensajeNotificacion(mensaje);
    setTimeout(() => {
      setMensajeNotificacion("");
    }, 4000);
  };

  const getAutosDeCliente = (clienteId) => {
    const relaciones = clienteAuto.filter((ca) => ca.cliente_id === clienteId);
    const autosIds = relaciones.map((r) => r.auto_id);
    return autos.filter((a) => autosIds.includes(a.id));
  };

  const getAutosSinCliente = () => {
    const autosAsignadosIds = clienteAuto.map((ca) => ca.auto_id);
    return autos.filter((a) => !autosAsignadosIds.includes(a.id));
  };

  const autosHuerfanos = getAutosSinCliente();

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

  const autosHuerfanosFiltrados = autosHuerfanos.filter((a) => {
    const query = busqueda.toLowerCase().trim();
    if (!query) return true;
    return (
      a.marca_modelo?.toLowerCase().includes(query) ||
      a.patente?.toLowerCase().includes(query)
    );
  });

  const handleSeleccionarCliente = async (cliente) => {
    setLoadingPanel(true);
    setVistaPanel({ tipo: "cliente", data: cliente });

    try {
      const res = await fetch(
        `http://localhost:3000/api/clientes/${cliente.id}/deuda-detalle`,
      );
      if (res.ok) {
        const data = await res.json();
        setPagosPendientesCliente(data.pagosPendientes);
        setDeudaCliente(data.deudaTotal);
      } else {
        setPagosPendientesCliente([]);
        setDeudaCliente(0);
      }
    } catch (error) {
      console.error("Error al obtener la deuda del cliente:", error);
      setPagosPendientesCliente([]);
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
      const resHistorialMercaderia = await fetch(
        `http://localhost:3000/api/historial-mercaderia/auto/${auto.id}`,
      ).catch(() => ({ ok: false }));

      const dataHistorialServicios = resHistorial.ok
        ? await resHistorial.json()
        : [];
      const dataHistorialMercaderia = resHistorialMercaderia.ok
        ? await resHistorialMercaderia.json()
        : [];

      const combinadoMap = {};

      dataHistorialServicios.forEach((s) => {
        const fecha = formatearFecha(s.fecha);
        if (!combinadoMap[fecha]) {
          combinadoMap[fecha] = {
            fecha,
            servicios: [],
            mercaderia: [],
            kilometros_actuales: s.kilometros_actuales,
            kilometros_proximo_cambio: s.kilometros_proximo_cambio,
          };
        }
        const servicioCatalogo = serviciosCatalogo.find(
          (cat) => cat.id === s.servicio_id,
        );
        const nombreServicio =
          servicioCatalogo?.nombre ||
          s.nombre_servicio ||
          `Servicio #${s.servicio_id}`;
        if (!combinadoMap[fecha].servicios.includes(nombreServicio)) {
          combinadoMap[fecha].servicios.push(nombreServicio);
        }
      });

      dataHistorialMercaderia.forEach((m) => {
        const fecha = formatearFecha(m.fecha);
        if (!combinadoMap[fecha]) {
          combinadoMap[fecha] = {
            fecha,
            servicios: [],
            mercaderia: [],
            kilometros_actuales: m.kilometros_actuales || null,
            kilometros_proximo_cambio: m.kilometros_proximo_cambio || null,
          };
        }
        const productoCatalogo = mercaderiaCatalogo.find(
          (cat) => cat.id === m.mercaderia_id,
        );
        const nombreProducto =
          productoCatalogo?.nombre ||
          m.nombre_producto ||
          `Producto #${m.mercaderia_id}`;

        const existente = combinadoMap[fecha].mercaderia.find(
          (item) => item.nombre_producto === nombreProducto,
        );
        if (existente) {
          existente.cantidad = Number(existente.cantidad) + Number(m.cantidad);
        } else {
          combinadoMap[fecha].mercaderia.push({
            nombre_producto: nombreProducto,
            cantidad: m.cantidad,
          });
        }
      });

      setHistorialAuto(Object.values(combinadoMap));
    } catch (error) {
      console.error("Error al cargar historial del auto:", error);
      setHistorialAuto([]);
    } finally {
      setLoadingPanel(false);
    }
  };

  const handleCrearAutoSolo = async (e) => {
    e.preventDefault();
    if (!formDataNuevoAuto.marca_modelo || !formDataNuevoAuto.patente) return;

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
        mostrarExito("✅ Vehículo registrado correctamente en el sistema.");
      }
    } catch (error) {
      console.error("Error al crear auto sin cliente:", error);
    }
  };

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
      const resCliente = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataCliente),
      });

      if (!resCliente.ok) return;

      const clienteCreado = await resCliente.json();
      const clienteId = clienteCreado.id || clienteCreado.insertId;

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

      for (const autoId of idsAutosHuerfanosSeleccionados) {
        await fetch("http://localhost:3000/api/cliente-auto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente_id: clienteId, auto_id: autoId }),
        });
      }

      await recargarDatos();
      setVistaPanel({ tipo: null, data: null });
      mostrarExito("✅ Cliente y vehículos vinculados exitosamente.");
    } catch (error) {
      console.error("Error al registrar cliente con vehículos:", error);
    }
  };

  const handleAbrirEdicionCliente = async (cliente) => {
    setEditClienteData({
      id: cliente.id,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
    });
    setEditAutosCliente(getAutosDeCliente(cliente.id));
    setMostrarFormNuevoAuto(false);
    setNuevoAutoData({ marca_modelo: "", patente: "" });
    setVistaPanel({ tipo: "editar_cliente", data: cliente });

    // Consultamos la deuda actualizada del cliente para asegurar el bloqueo correcto en el modal
    try {
      const res = await fetch(
        `http://localhost:3000/api/clientes/${cliente.id}/deuda-detalle`,
      );
      if (res.ok) {
        const data = await res.json();
        setDeudaCliente(data.deudaTotal);
      } else {
        setDeudaCliente(0);
      }
    } catch {
      setDeudaCliente(0);
    }
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
        mostrarExito("✅ Información de cliente actualizada.");
      }
    } catch (error) {
      console.error("Error al editar cliente y autos:", error);
    }
  };

  const handleAgregarAutoACliente = async () => {
    if (!nuevoAutoData.marca_modelo || !nuevoAutoData.patente) return;

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
      }
    } catch (error) {
      console.error("Error al agregar auto:", error);
    }
  };

  // Manejador que evalúa si el cliente tiene deuda antes de permitir la desvinculación
  const handleIntentarDesvincular = (auto) => {
    if (deudaCliente > 0) {
      setMostrarModalDeuda(true); // Muestra el modal de alerta si hay deuda
    } else {
      setAutoADesvincular(auto); // Si no hay deuda, abre el flujo normal de confirmación
    }
  };

  const handleConfirmarDesvincularAuto = async () => {
    if (!autoADesvincular) return;

    try {
      const relacion = clienteAuto.find(
        (ca) =>
          ca.cliente_id === editClienteData.id &&
          ca.auto_id === autoADesvincular.id,
      );

      if (relacion) {
        const res = await fetch(
          `http://localhost:3000/api/cliente-auto/${relacion.id}`,
          {
            method: "DELETE",
          },
        );

        if (res.ok) {
          setEditAutosCliente((prev) =>
            prev.filter((a) => a.id !== autoADesvincular.id),
          );
          await recargarDatos();
          mostrarExito("✅ Vehículo desvinculado correctamente del cliente.");
        } else {
          setMostrarModalDeuda(true);
        }
      }
    } catch (error) {
      console.error("Error al desvincular auto:", error);
    } finally {
      setAutoADesvincular(null);
    }
  };

  return (
    <div style={styles.container}>
      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}
      {mensajeError && <div style={styles.toastError}>{mensajeError}</div>}

      {/* Modal de Alerta por Deuda Pendiente */}
      {mostrarModalDeuda && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ color: "#991b1b", marginTop: 0 }}>
              ⚠️ Acción Bloqueada
            </h3>
            <p
              style={{
                color: "#4a5568",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              No se puede desvincular un vehículo de su dueño hasta que no abone
              su deuda pendiente.
            </p>
            <button
              onClick={() => {
                setMostrarModalDeuda(false);
                setAutoADesvincular(null);
              }}
              style={{
                marginTop: "16px",
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

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

      <div style={styles.panelGrid}>
        <div style={styles.cardLeft}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Clientes y Vehículos Registrados</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length > 0 &&
                clientesFiltrados.map((cliente) => {
                  const autosDelCliente = getAutosDeCliente(cliente.id);

                  return (
                    <tr key={`cli-${cliente.id}`}>
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
                })}

              {autosHuerfanosFiltrados.length > 0 && (
                <>
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        backgroundColor: "#f8fafc",
                        fontWeight: "bold",
                        color: "#0369a1",
                        fontSize: "0.85rem",
                        paddingTop: "16px",
                      }}
                    >
                      ⚠️ VEHÍCULOS SIN CLIENTE ASIGNADO
                    </td>
                  </tr>
                  {autosHuerfanosFiltrados.map((auto) => (
                    <tr key={`huerfano-${auto.id}`}>
                      <td style={{ ...styles.td, backgroundColor: "#f0f9ff" }}>
                        <span
                          style={{
                            ...styles.autoBadge,
                            backgroundColor: "#bae6fd",
                          }}
                          onClick={() => handleSeleccionarAuto(auto)}
                        >
                          🚗 {auto.marca_modelo} ({auto.patente})
                        </span>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#0284c7",
                            fontStyle: "italic",
                            marginLeft: "8px",
                          }}
                        >
                          (Sin dueño asignado)
                        </span>
                      </td>
                    </tr>
                  ))}
                </>
              )}

              {clientesFiltrados.length === 0 &&
                autosHuerfanosFiltrados.length === 0 && (
                  <tr>
                    <td style={{ ...styles.td, color: "#8c9bba" }}>
                      No se encontraron registros coincidentes.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

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
                    ? `⚠️ Deuda acumulada total: $${deudaCliente.toLocaleString()}`
                    : "✓ El cliente no posee deudas pendientes"}
                </div>

                {deudaCliente > 0 && pagosPendientesCliente.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#991b1b" }}>
                      📋 Detalle de pagos, servicios y mercadería pendientes:
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {pagosPendientesCliente.map((pago, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            padding: "12px",
                            backgroundColor: "#fff",
                            border: "1px solid #fecaca",
                            borderRadius: "6px",
                            fontSize: "0.9rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
                            }}
                          >
                            <span>
                              <strong>Fecha:</strong>{" "}
                              {formatearFecha(pago.fecha)}
                            </span>
                            <span
                              style={{ color: "#991b1b", fontWeight: "bold" }}
                            >
                              Total Pendiente: $
                              {pago.precioTotalCalculado.toLocaleString()}
                            </span>
                          </div>

                          {pago.montoExtra > 0 && (
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#d97706",
                                marginBottom: "6px",
                              }}
                            >
                              ➕ Monto Extra Aplicado: $
                              {pago.montoExtra.toLocaleString()}
                            </div>
                          )}

                          <div style={{ marginTop: "6px" }}>
                            <strong
                              style={{ fontSize: "0.85rem", color: "#4a5568" }}
                            >
                              Servicios:
                            </strong>
                            {pago.serviciosNombres.length > 0 ? (
                              <ul
                                style={{
                                  margin: "2px 0 6px 0",
                                  paddingLeft: "18px",
                                }}
                              >
                                {pago.serviciosNombres.map((s, sIdx) => (
                                  <li key={sIdx}>{s}</li>
                                ))}
                              </ul>
                            ) : (
                              <p
                                style={{
                                  margin: "2px 0 6px 0",
                                  fontStyle: "italic",
                                  color: "#8c9bba",
                                }}
                              >
                                Sin servicio específico asociado a esta fecha
                              </p>
                            )}
                          </div>

                          <div>
                            <strong
                              style={{ fontSize: "0.85rem", color: "#4a5568" }}
                            >
                              Mercadería / Insumos:
                            </strong>
                            {pago.mercaderiaDetalle.length > 0 ? (
                              <ul
                                style={{
                                  margin: "2px 0 0 0",
                                  paddingLeft: "18px",
                                }}
                              >
                                {pago.mercaderiaDetalle.map((m, mIdx) => (
                                  <li key={mIdx}>
                                    {m.nombre_producto} (Cant: {m.cantidad}) - $
                                    {m.subtotal.toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p
                                style={{
                                  margin: "2px 0 0 0",
                                  fontStyle: "italic",
                                  color: "#8c9bba",
                                }}
                              >
                                Sin insumos registrados para esta fecha
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => handleAbrirEdicionCliente(vistaPanel.data)}
                    style={styles.btnSecondary}
                  >
                    ✏️ Editar Cliente / Autos
                  </button>
                </div>
              </div>
            )}

          {!loadingPanel && vistaPanel.tipo === "nuevo_auto_solo" && (
            <div>
              <h3 style={{ marginTop: 0 }}>
                Registrar Nuevo Auto (Sin Cliente)
              </h3>
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
                          onClick={() => handleIntentarDesvincular(auto)}
                          style={{
                            ...styles.btnSecondary,
                            backgroundColor: "#d97706",
                            padding: "8px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          🔗 Desvincular
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                    Este cliente no tiene vehículos asignados.
                  </p>
                )}

                {autoADesvincular && !mostrarModalDeuda && (
                  <div
                    style={{
                      ...styles.autoCardEdit,
                      backgroundColor: "#fffbeb",
                      borderColor: "#fde68a",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        color: "#b45309",
                        fontSize: "0.9rem",
                      }}
                    >
                      ¿Confirmas desvincular el vehículo{" "}
                      <strong>{autoADesvincular.marca_modelo}</strong> (
                      {autoADesvincular.patente})? El auto no se borrará del
                      sistema.
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={handleConfirmarDesvincularAuto}
                        style={{
                          ...styles.btnDanger,
                          backgroundColor: "#d97706",
                        }}
                      >
                        Sí, desvincular
                      </button>
                      <button
                        type="button"
                        onClick={() => setAutoADesvincular(null)}
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
                      backgroundColor: "#f8fafc",
                      borderColor: "#cbd5e1",
                      margin: "12px 0 20px 0",
                      padding: "16px",
                    }}
                  >
                    {autosHuerfanos.length > 0 && (
                      <div
                        style={{
                          ...styles.unassignedBox,
                          marginBottom: "16px",
                        }}
                      >
                        <strong
                          style={{
                            color: "#1e40af",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          🔗 Asignar un auto existente sin dueño:
                        </strong>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {autosHuerfanos.map((auto) => (
                            <div
                              key={auto.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                border: "1px solid #e2e8f0",
                              }}
                            >
                              <span style={{ fontSize: "0.9rem" }}>
                                🚗 {auto.marca_modelo} (
                                <strong>{auto.patente}</strong>)
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleVincularAutoHuerfanoAEdit(auto.id)
                                }
                                style={{
                                  ...styles.btnSuccess,
                                  padding: "4px 10px",
                                  fontSize: "0.8rem",
                                }}
                              >
                                + Vincular
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <h5 style={{ margin: "0 0 10px 0", color: "#334155" }}>
                      {autosHuerfanos.length > 0
                        ? "O crear y asignar un auto nuevo:"
                        : "Cargar nuevo vehículo:"}
                    </h5>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        placeholder="Marca y Modelo (Ej: Ford Focus)"
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
                        placeholder="Patente (Ej: AB123CD)"
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
                      style={{ display: "flex", gap: "8px", marginTop: "12px" }}
                    >
                      <button
                        type="button"
                        onClick={handleAgregarAutoACliente}
                        style={styles.btnSuccess}
                      >
                        Guardar y Asignar Nuevo
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
                        <strong>Fecha:</strong> {item.fecha}
                      </p>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "1rem",
                          fontWeight: "600",
                        }}
                      >
                        Servicios:{" "}
                        {item.servicios.length > 0
                          ? item.servicios.join(" • ")
                          : "Sin servicios específicos"}
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
                          Sin insumos registrados para esta fecha.
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

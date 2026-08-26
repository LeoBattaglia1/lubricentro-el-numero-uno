import { useState, useEffect, useMemo } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1300px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "relative",
  },
  header: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#1a202c",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginLeft: "auto",
  },
  dropdownContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    padding: "6px 0",
    zIndex: 100,
    minWidth: "280px",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
  },
  card: {
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
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
  },
  calendarDayName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#4a5568",
    padding: "8px 0",
    fontSize: "0.85rem",
    borderBottom: "2px solid #e2e8f0",
  },
  calendarCell: {
    minHeight: "95px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "6px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: "0.75rem",
  },
  calendarCellToday: {
    backgroundColor: "#eff6ff",
    border: "2px solid #2563eb",
  },
  calendarCellEmpty: {
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    opacity: 0.4,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 8px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #edf2f7",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
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
    fontWeight: "500",
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
};

const NOMBRES_DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const fetchDatosServidor = async () => {
  const [resPagos, resProveedores, resPagosProveedor, resClientes] =
    await Promise.all([
      fetch("http://localhost:3000/api/pagos").catch(() => ({ ok: false })),
      fetch("http://localhost:3000/api/provedores").catch(() => ({
        ok: false,
      })),
      fetch("http://localhost:3000/api/pagosprovedor").catch(() => ({
        ok: false,
      })),
      fetch("http://localhost:3000/api/clientes").catch(() => ({ ok: false })),
    ]);

  const pagos = resPagos.ok ? await resPagos.json() : [];
  const proveedores = resProveedores.ok ? await resProveedores.json() : [];
  const pagosProveedor = resPagosProveedor.ok
    ? await resPagosProveedor.json()
    : [];
  const clientes = resClientes.ok ? await resClientes.json() : [];

  return { pagos, proveedores, pagosProveedor, clientes };
};

export default function Caja() {
  const [pagos, setPagos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [pagosProveedor, setPagosProveedor] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [montosPendientesMap, setMontosPendientesMap] = useState({});

  // Estados de UI y Calendario
  const fechaActualObj = new Date();
  const [mesActual, setMesActual] = useState(fechaActualObj.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActualObj.getFullYear());

  const [menuPendientesOpen, setMenuPendientesOpen] = useState(false);
  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });
  const [formPago, setFormPago] = useState({ provedor_id: "", monto: "" });

  const [alertaModal, setAlertaModal] = useState({
    mostrar: false,
    mensaje: "",
    titulo: "Aviso",
  });

  // Estado para el modal de confirmación de cobro
  const [confirmarCobroModal, setConfirmarCobroModal] = useState({
    mostrar: false,
    pagoId: null,
    tipoPago: "",
    nombreCliente: "",
    monto: 0,
  });

  const cargarDatos = async () => {
    try {
      const data = await fetchDatosServidor();
      setPagos(data.pagos);
      setProveedores(data.proveedores);
      setPagosProveedor(data.pagosProveedor);
      setClientes(data.clientes);
    } catch (error) {
      console.error("Error al cargar datos de caja:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await fetchDatosServidor();
        if (isMounted) {
          setPagos(data.pagos);
          setProveedores(data.proveedores);
          setPagosProveedor(data.pagosProveedor);
          setClientes(data.clientes);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const cargarMontosPendientes = async () => {
      const pendientes = pagos.filter((p) => p.tipo_pago === "pendiente");
      const clientIds = [...new Set(pendientes.map((p) => p.cliente_id))];
      const mapMontos = {};

      for (const clienteId of clientIds) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/clientes/${clienteId}/deuda-detalle`,
          );
          if (response.ok) {
            const data = await response.json();
            data.pagosPendientes.forEach((pDetalle) => {
              mapMontos[pDetalle.id] = pDetalle.precioTotalCalculado;
            });
          }
        } catch (error) {
          console.error(
            `Error al obtener detalle del cliente ${clienteId}:`,
            error,
          );
        }
      }

      setMontosPendientesMap(mapMontos);
    };

    if (pagos.length > 0) {
      cargarMontosPendientes();
    }
  }, [pagos]);

  const mostrarExito = (mensaje) => {
    setMensajeNotificacion(mensaje);
    setTimeout(() => setMensajeNotificacion(""), 4000);
  };

  const mostrarAlerta = (mensaje, titulo = "Aviso") => {
    setAlertaModal({ mostrar: true, mensaje, titulo });
  };

  const getNombreProveedor = (provedor_id) => {
    const prov = proveedores.find((p) => String(p.id) === String(provedor_id));
    return prov ? prov.nombre : "Sin Proveedor";
  };

  const getNombreCliente = (cliente_id) => {
    const cli = clientes.find((c) => String(c.id) === String(cliente_id));
    return cli ? cli.nombre : `Cliente #${cliente_id}`;
  };

  const handleMesAnterior = () => {
    if (mesActual === 0) {
      setMesActual(11);
      setAnioActual(anioActual - 1);
    } else {
      setMesActual(mesActual - 1);
    }
  };

  const handleMesSiguiente = () => {
    if (mesActual === 11) {
      setMesActual(0);
      setAnioActual(anioActual + 1);
    } else {
      setMesActual(mesActual + 1);
    }
  };

  // Mapeo diario para el almanaque (Solución de desfasaje de fecha con split puro)
  const diasAlmanaqueMes = useMemo(() => {
    const diasMap = {};

    pagos.forEach((p) => {
      if (p.tipo_pago === "pendiente") return;
      if (!p.fecha) return;

      const fechaKey = String(p.fecha).split("T")[0];
      const partes = fechaKey.split("-");
      if (partes.length !== 3) return;

      const fAnio = Number(partes[0]);
      const fMes = Number(partes[1]);

      if (fAnio === anioActual && fMes - 1 === mesActual) {
        if (!diasMap[fechaKey]) {
          diasMap[fechaKey] = { efectivo: 0, digital: 0, proveedores: 0 };
        }
        const monto = Number(p.montoTotal || 0);
        if (p.tipo_pago === "efectivo") diasMap[fechaKey].efectivo += monto;
        else if (p.tipo_pago === "cuenta_bancaria")
          diasMap[fechaKey].digital += monto;
      }
    });

    pagosProveedor.forEach((pp) => {
      if (!pp.fecha) return;
      const fechaKey = String(pp.fecha).split("T")[0];
      const partes = fechaKey.split("-");
      if (partes.length !== 3) return;

      const fAnio = Number(partes[0]);
      const fMes = Number(partes[1]);

      if (fAnio === anioActual && fMes - 1 === mesActual) {
        if (!diasMap[fechaKey]) {
          diasMap[fechaKey] = { efectivo: 0, digital: 0, proveedores: 0 };
        }
        diasMap[fechaKey].proveedores += Number(pp.monto || 0);
      }
    });

    const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
    const ultimoDiaMes = new Date(anioActual, mesActual + 1, 0).getDate();

    const celdas = [];
    for (let i = 0; i < primerDiaMes; i++) {
      celdas.push({ esVacio: true, id: `empty-start-${i}` });
    }

    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const mesStr = String(mesActual + 1).padStart(2, "0");
      const diaStr = String(dia).padStart(2, "0");
      const fechaKey = `${anioActual}-${mesStr}-${diaStr}`;
      const item = diasMap[fechaKey] || {
        efectivo: 0,
        digital: 0,
        proveedores: 0,
      };
      const neto = item.efectivo + item.digital - item.proveedores;

      celdas.push({
        esVacio: false,
        dia,
        fechaKey,
        efectivo: item.efectivo,
        digital: item.digital,
        proveedores: item.proveedores,
        neto,
      });
    }

    return celdas;
  }, [pagos, pagosProveedor, mesActual, anioActual]);

  const pagosPendientesList = useMemo(() => {
    return pagos.filter((p) => p.tipo_pago === "pendiente");
  }, [pagos]);

  const abrirConfirmacionCobro = (pagoId, tipoPago) => {
    const pagoActual = pagos.find((p) => p.id === pagoId);
    const montoCalculado =
      montosPendientesMap[pagoId] || Number(pagoActual?.montoExtra || 0);
    const nombreCli = getNombreCliente(pagoActual?.cliente_id);

    setConfirmarCobroModal({
      mostrar: true,
      pagoId,
      tipoPago,
      nombreCliente: nombreCli,
      monto: montoCalculado,
    });
    setMenuPendientesOpen(false);
  };

  const handleEjecutarCobro = async () => {
    const { pagoId, tipoPago, monto } = confirmarCobroModal;

    // Forzar siempre la fecha local actual con formato 00:00:00
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const fechaConCeros = `${anio}-${mes}-${dia} 00:00:00`;

    try {
      const res = await fetch(`http://localhost:3000/api/pagos/${pagoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_pago: tipoPago,
          fecha: fechaConCeros,
          montoTotal: monto,
          montoExtra: 0,
        }),
      });

      if (res.ok) {
        setConfirmarCobroModal({
          mostrar: false,
          pagoId: null,
          tipoPago: "",
          nombreCliente: "",
          monto: 0,
        });
        await cargarDatos();
        mostrarExito("✅ Cobro registrado con éxito.");
      } else {
        mostrarAlerta("No se pudo actualizar el pago pendiente.");
      }
    } catch (error) {
      console.error("Error al cobrar pago:", error);
      mostrarAlerta("Error de conexión al procesar el cobro.");
    }
  };

  const handleCrearPagoProveedor = async (e) => {
    e.preventDefault();
    if (!formPago.provedor_id || !formPago.monto) return;

    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const fechaConCeros = `${anio}-${mes}-${dia} 00:00:00`;

    try {
      const res = await fetch("http://localhost:3000/api/pagosprovedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provedor_id: Number(formPago.provedor_id),
          monto: Number(formPago.monto),
          fecha: fechaConCeros,
        }),
      });

      if (res.ok) {
        setFormPago({ provedor_id: "", monto: "" });
        await cargarDatos();
        setVistaPanel({ tipo: null, data: null });
        mostrarExito("✅ Pago a proveedor registrado correctamente.");
      } else {
        const errorData = await res.json();
        mostrarAlerta(
          `Error: ${errorData.error || "No se pudo registrar el pago"}`,
        );
      }
    } catch (error) {
      console.error("Error al registrar pago proveedor:", error);
      mostrarAlerta("Error de conexión con el servidor.");
    }
  };

  const fechaHoyStr = new Date().toISOString().split("T")[0];

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Módulo de Caja y Pagos</h1>

      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}

      {alertaModal.mostrar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px 24px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>
              {alertaModal.titulo}
            </h3>
            <p style={{ color: "#475569", margin: "16px 0" }}>
              {alertaModal.mensaje}
            </p>
            <button
              onClick={() =>
                setAlertaModal({ mostrar: false, mensaje: "", titulo: "Aviso" })
              }
              style={styles.btnPrimary}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {confirmarCobroModal.mostrar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "420px",
              width: "90%",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Confirmar Cobro</h3>
            <p
              style={{
                color: "#475569",
                margin: "12px 0",
                fontSize: "0.95rem",
              }}
            >
              ¿Estás seguro de registrar el cobro de la deuda para{" "}
              <strong>{confirmarCobroModal.nombreCliente}</strong> por un monto
              de{" "}
              <strong style={{ color: "#16a34a" }}>
                ${confirmarCobroModal.monto.toLocaleString()}
              </strong>{" "}
              vía{" "}
              <strong>
                {confirmarCobroModal.tipoPago === "efectivo"
                  ? "Efectivo"
                  : "Cuenta Bancaria"}
              </strong>
              ?
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  setConfirmarCobroModal({
                    mostrar: false,
                    pagoId: null,
                    tipoPago: "",
                    nombreCliente: "",
                    monto: 0,
                  })
                }
                style={styles.btnSecondary}
              >
                Cancelar
              </button>
              <button onClick={handleEjecutarCobro} style={styles.btnSuccess}>
                Sí, Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.topBar}>
        <div style={{ fontWeight: "600", color: "#475569" }}>
          Control diario de entradas y salidas de efectivo y bancos.
        </div>
        <div style={styles.actionButtons}>
          <button
            onClick={() =>
              setVistaPanel({ tipo: "pagos_proveedores", data: null })
            }
            style={styles.btnSuccess}
          >
            💳 Registrar Pago a Proveedor
          </button>

          <div
            style={styles.dropdownContainer}
            onMouseEnter={() => setMenuPendientesOpen(true)}
            onMouseLeave={() => setMenuPendientesOpen(false)}
          >
            <button style={styles.btnPrimary}>
              🕒 Pagos Pendientes ({pagosPendientesList.length}) ▾
            </button>
            {menuPendientesOpen && (
              <div style={styles.dropdownMenu}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  Clientes con Deuda Pendiente
                </div>
                {pagosPendientesList.length > 0 ? (
                  pagosPendientesList.map((p) => {
                    const montoPendiente =
                      montosPendientesMap[p.id] || Number(p.montoExtra || 0);

                    return (
                      <div
                        key={p.id}
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #f1f5f9",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.85rem",
                          }}
                        >
                          <strong>{getNombreCliente(p.cliente_id)}</strong>
                          <span
                            style={{ color: "#dc2626", fontWeight: "bold" }}
                          >
                            ${montoPendiente.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            marginTop: "4px",
                          }}
                        >
                          <button
                            onClick={() =>
                              abrirConfirmacionCobro(p.id, "efectivo")
                            }
                            style={{
                              ...styles.btnSuccess,
                              padding: "3px 6px",
                              fontSize: "0.7rem",
                              flex: 1,
                            }}
                          >
                            Cobrar Efectivo
                          </button>
                          <button
                            onClick={() =>
                              abrirConfirmacionCobro(p.id, "cuenta_bancaria")
                            }
                            style={{
                              ...styles.btnPrimary,
                              padding: "3px 6px",
                              fontSize: "0.7rem",
                              flex: 1,
                            }}
                          >
                            Cobrar Banco
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      padding: "12px",
                      color: "#64748b",
                      fontSize: "0.85rem",
                      textAlign: "center",
                    }}
                  >
                    No hay pagos pendientes.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.panelGrid}>
        <div style={styles.card}>
          <div style={styles.calendarHeader}>
            <button onClick={handleMesAnterior} style={styles.btnSecondary}>
              ◀ Mes Anterior
            </button>
            <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.2rem" }}>
              {NOMBRES_MESES[mesActual]} {anioActual}
            </h2>
            <button onClick={handleMesSiguiente} style={styles.btnSecondary}>
              Mes Siguiente ▶
            </button>
          </div>

          <div style={styles.calendarGrid}>
            {NOMBRES_DIAS.map((diaSemana, idx) => (
              <div key={idx} style={styles.calendarDayName}>
                {diaSemana}
              </div>
            ))}

            {diasAlmanaqueMes.map((celda) => {
              if (celda.esVacio) {
                return <div key={celda.id} style={styles.calendarCellEmpty} />;
              }

              const esHoy = celda.fechaKey === fechaHoyStr;

              return (
                <div
                  key={celda.fechaKey}
                  style={{
                    ...styles.calendarCell,
                    ...(esHoy ? styles.calendarCellToday : {}),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                      color: esHoy ? "#2563eb" : "#334155",
                    }}
                  >
                    <span>{celda.dia}</span>
                    {esHoy && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          padding: "1px 4px",
                          borderRadius: "4px",
                        }}
                      >
                        HOY
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.7rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      margin: "2px 0",
                    }}
                  >
                    {celda.efectivo > 0 && (
                      <span style={{ color: "#16a34a" }}>
                        Ef: ${celda.efectivo.toLocaleString()}
                      </span>
                    )}
                    {celda.digital > 0 && (
                      <span style={{ color: "#0284c7" }}>
                        Ban: ${celda.digital.toLocaleString()}
                      </span>
                    )}
                    {celda.proveedores > 0 && (
                      <span style={{ color: "#dc2626" }}>
                        Prov: -${celda.proveedores.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "2px",
                      color: celda.neto >= 0 ? "#1e293b" : "#dc2626",
                    }}
                  >
                    ${celda.neto.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {vistaPanel.tipo === "pagos_proveedores" ? (
            <div style={styles.cardRight}>
              <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>
                Gestión de Proveedores
              </h3>

              <form
                onSubmit={handleCrearPagoProveedor}
                style={{
                  backgroundColor: "#fff",
                  padding: "12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  marginBottom: "16px",
                }}
              >
                <h5 style={{ margin: "0 0 8px 0" }}>
                  💳 Nuevo Pago a Proveedor
                </h5>
                <div style={{ marginBottom: "8px" }}>
                  <select
                    required
                    style={styles.select}
                    value={formPago.provedor_id}
                    onChange={(e) =>
                      setFormPago({ ...formPago, provedor_id: e.target.value })
                    }
                  >
                    <option value="">-- Seleccionar Proveedor --</option>
                    {proveedores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="number"
                    required
                    placeholder="Monto ($)"
                    style={styles.input}
                    value={formPago.monto}
                    onChange={(e) =>
                      setFormPago({ ...formPago, monto: e.target.value })
                    }
                  />
                </div>

                <button type="submit" style={styles.btnSuccess}>
                  Registrar Pago
                </button>
              </form>

              <h4 style={{ fontSize: "0.95rem" }}>
                Historial Reciente de Proveedores
              </h4>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Proveedor</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosProveedor.length > 0 ? (
                    pagosProveedor.slice(0, 5).map((pago) => (
                      <tr key={pago.id}>
                        <td style={styles.td}>
                          {pago.fecha ? String(pago.fecha).split("T")[0] : ""}
                        </td>
                        <td style={styles.td}>
                          {getNombreProveedor(pago.provedor_id)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ${Number(pago.monto || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{ ...styles.td, color: "#64748b" }}
                      >
                        Sin registros recientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <button
                onClick={() => setVistaPanel({ tipo: null, data: null })}
                style={{
                  ...styles.btnSecondary,
                  marginTop: "16px",
                  width: "100%",
                }}
              >
                Cerrar Panel
              </button>
            </div>
          ) : (
            <div
              style={{
                ...styles.cardRight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                textAlign: "center",
                minHeight: "300px",
              }}
            >
              <p>
                Seleccioná "Registrar Pago a Proveedor" para gestionar los
                egresos o consultá los pagos pendientes en la esquina superior.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

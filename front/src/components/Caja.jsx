import { useState, useEffect, useMemo, useCallback } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1400px",
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
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 480px",
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
    gap: "4px",
  },
  calendarDayName: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#4a5568",
    padding: "6px 0",
    fontSize: "0.8rem",
    borderBottom: "2px solid #e2e8f0",
  },
  calendarCell: {
    minHeight: "75px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    padding: "4px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontSize: "0.7rem",
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
    padding: "8px 6px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
    fontSize: "0.75rem",
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "6px",
    borderBottom: "1px solid #edf2f7",
    fontSize: "0.75rem",
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

  // Estados de ordenamiento para Historial de Pagos Proveedores
  const [ordenHistorial, setOrdenHistorial] = useState({
    campo: "fecha",
    direccion: "desc",
  });

  // Estados de UI y Calendario
  const fechaActualObj = new Date();
  const [mesActual, setMesActual] = useState(fechaActualObj.getMonth());
  const [anioActual, setAnioActual] = useState(fechaActualObj.getFullYear());

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null }); // 'pagos_proveedores' o 'pagos_pendientes_clientes'
  const [formPago, setFormPago] = useState({
    provedor_id: "",
    numeroFactura: "",
    monto: "",
    totalFactura: "",
  });

  const [modalPagoAdicional, setModalPagoAdicional] = useState({
    mostrar: false,
    provedor_id: "",
    numeroFactura: "",
    totalFactura: 0,
    pagadoActual: 0,
    montoAdicional: "",
  });

  const [alertaModal, setAlertaModal] = useState({
    mostrar: false,
    mensaje: "",
    titulo: "Aviso",
  });

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

    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
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

  const getNombreProveedor = useCallback(
    (provedor_id) => {
      const prov = proveedores.find(
        (p) => String(p.id) === String(provedor_id),
      );
      return prov ? prov.nombre : "Sin Proveedor";
    },
    [proveedores],
  );

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

  const diasAlmanaqueMes = useMemo(() => {
    const diasMap = {};

    pagos.forEach((p) => {
      if (p.tipo_pago === "pendiente") return;
      if (!p.fecha) return;

      const fechaKey = String(p.fecha).substring(0, 10);
      const partes = fechaKey.split("-");
      if (partes.length !== 3) return;

      const fAnio = Number(partes[0]);
      const fMes = Number(partes[1]);

      if (fAnio === anioActual && fMes - 1 === mesActual) {
        if (!diasMap[fechaKey]) {
          diasMap[fechaKey] = { efectivo: 0, digital: 0, proveedores: 0 };
        }
        const monto = Number(p.montoTotal || p.monto || 0);
        if (p.tipo_pago === "efectivo") {
          diasMap[fechaKey].efectivo += monto;
        } else if (p.tipo_pago === "cuenta_bancaria") {
          diasMap[fechaKey].digital += monto;
        }
      }
    });

    pagosProveedor.forEach((pp) => {
      if (!pp.fecha) return;

      const fechaKey = String(pp.fecha).substring(0, 10);
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

  const facturasProveedoresMap = useMemo(() => {
    const mapa = {};
    pagosProveedor.forEach((p) => {
      const key = `${p.provedor_id}_${p.numeroFactura}`;
      if (!mapa[key]) {
        mapa[key] = {
          provedor_id: p.provedor_id,
          numeroFactura: p.numeroFactura,
          totalFactura: Number(p.totalFactura || 0),
          totalPagado: 0,
          pagos: [],
        };
      }
      mapa[key].totalPagado += Number(p.monto || 0);
      if (Number(p.totalFactura || 0) > 0) {
        mapa[key].totalFactura = Number(p.totalFactura);
      }
      mapa[key].pagos.push(p);
    });
    return Object.values(mapa);
  }, [pagosProveedor]);

  const facturasPendientesProveedores = useMemo(() => {
    return facturasProveedoresMap.filter((f) => f.totalPagado < f.totalFactura);
  }, [facturasProveedoresMap]);

  const pagosProveedorOrdenados = useMemo(() => {
    return [...pagosProveedor].sort((a, b) => {
      let valA, valB;
      if (ordenHistorial.campo === "fecha") {
        valA = new Date(a.fecha || 0).getTime();
        valB = new Date(b.fecha || 0).getTime();
      } else if (ordenHistorial.campo === "proveedor") {
        valA = getNombreProveedor(a.provedor_id).toLowerCase();
        valB = getNombreProveedor(b.provedor_id).toLowerCase();
      } else if (ordenHistorial.campo === "numeroFactura") {
        valA = String(a.numeroFactura).toLowerCase();
        valB = String(b.numeroFactura).toLowerCase();
      }

      if (valA < valB) return ordenHistorial.direccion === "asc" ? -1 : 1;
      if (valA > valB) return ordenHistorial.direccion === "asc" ? 1 : -1;
      return 0;
    });
  }, [pagosProveedor, ordenHistorial, getNombreProveedor]);

  const cambiarOrdenHistorial = (campo) => {
    if (ordenHistorial.campo === campo) {
      setOrdenHistorial({
        campo,
        direccion: ordenHistorial.direccion === "asc" ? "desc" : "asc",
      });
    } else {
      setOrdenHistorial({ campo, direccion: "asc" });
    }
  };

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
  };

  const handleEjecutarCobro = async () => {
    const { pagoId, tipoPago, monto } = confirmarCobroModal;

    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");

    const fechaHoraActual = `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    try {
      const res = await fetch(`http://localhost:3000/api/pagos/${pagoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_pago: tipoPago,
          fecha: fechaHoraActual,
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
    const totalFac = Number(formPago.totalFactura);
    const montoPagar = Number(formPago.monto);

    if (
      !formPago.provedor_id ||
      !formPago.numeroFactura ||
      !montoPagar ||
      !totalFac
    )
      return;

    if (montoPagar > totalFac) {
      mostrarAlerta(
        "El total a pagar no puede ser mayor al total de la factura.",
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/pagosprovedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provedor_id: Number(formPago.provedor_id),
          numeroFactura: formPago.numeroFactura,
          monto: montoPagar,
          totalFactura: totalFac,
        }),
      });

      if (res.ok) {
        setFormPago({
          provedor_id: "",
          numeroFactura: "",
          monto: "",
          totalFactura: "",
        });
        await cargarDatos();
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

  const handleEjecutarPagoAdicional = async (e) => {
    e.preventDefault();
    const montoNum = Number(modalPagoAdicional.montoAdicional);
    const restanteMax =
      modalPagoAdicional.totalFactura - modalPagoAdicional.pagadoActual;

    if (!montoNum || montoNum <= 0) return;

    if (montoNum > restanteMax) {
      mostrarAlerta(
        "El monto a abonar no puede superar el restante por pagar de la factura.",
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/pagosprovedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provedor_id: Number(modalPagoAdicional.provedor_id),
          numeroFactura: modalPagoAdicional.numeroFactura,
          monto: montoNum,
          totalFactura: modalPagoAdicional.totalFactura,
        }),
      });

      if (res.ok) {
        setModalPagoAdicional({
          mostrar: false,
          provedor_id: "",
          numeroFactura: "",
          totalFactura: 0,
          pagadoActual: 0,
          montoAdicional: "",
        });
        await cargarDatos();
        mostrarExito("✅ Pago parcial adicional registrado correctamente.");
      } else {
        const errorData = await res.json();
        mostrarAlerta(
          `Error: ${errorData.error || "No se pudo registrar el pago"}`,
        );
      }
    } catch (error) {
      console.error("Error al registrar pago adicional:", error);
      mostrarAlerta("Error de conexión con el servidor.");
    }
  };

  const fechaHoyStr = new Date().toISOString().split("T")[0];

  return (
    <div style={styles.container}>
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

      {/* Modal para Abonar Pago Adicional a Factura Pendiente con restante por defecto */}
      {modalPagoAdicional.mostrar && (
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
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>
              Pagar Factura Pendiente
            </h3>
            <p
              style={{ color: "#475569", fontSize: "0.9rem", margin: "8px 0" }}
            >
              Proveedor:{" "}
              <strong>
                {getNombreProveedor(modalPagoAdicional.provedor_id)}
              </strong>
              <br />
              Factura Nº: <strong>{modalPagoAdicional.numeroFactura}</strong>
              <br />
              Restante por Pagar:{" "}
              <strong style={{ color: "#dc2626" }}>
                $
                {(
                  modalPagoAdicional.totalFactura -
                  modalPagoAdicional.pagadoActual
                ).toLocaleString()}
              </strong>
            </p>

            <form
              onSubmit={handleEjecutarPagoAdicional}
              style={{ marginTop: "16px" }}
            >
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Monto a abonar ($)
                </label>
                <input
                  type="number"
                  required
                  autoFocus
                  style={styles.input}
                  value={modalPagoAdicional.montoAdicional}
                  onChange={(e) =>
                    setModalPagoAdicional({
                      ...modalPagoAdicional,
                      montoAdicional: e.target.value,
                    })
                  }
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setModalPagoAdicional({
                      mostrar: false,
                      provedor_id: "",
                      numeroFactura: "",
                      totalFactura: 0,
                      pagadoActual: 0,
                      montoAdicional: "",
                    })
                  }
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Confirmar Pago
                </button>
              </div>
            </form>
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
            💳 Gestionar Proveedores
          </button>
          <button
            onClick={() =>
              setVistaPanel({ tipo: "pagos_pendientes_clientes", data: null })
            }
            style={styles.btnPrimary}
          >
            🕒 Pagos Pendientes Clientes ({pagosPendientesList.length})
          </button>
        </div>
      </div>

      <div style={styles.panelGrid}>
        <div style={styles.card}>
          <div style={styles.calendarHeader}>
            <button onClick={handleMesAnterior} style={styles.btnSecondary}>
              ◀ Mes
            </button>
            <h2 style={{ margin: 0, color: "#1e293b", fontSize: "1.1rem" }}>
              {NOMBRES_MESES[mesActual]} {anioActual}
            </h2>
            <button onClick={handleMesSiguiente} style={styles.btnSecondary}>
              Mes ▶
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
                          fontSize: "0.55rem",
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          padding: "1px 3px",
                          borderRadius: "3px",
                        }}
                      >
                        HOY
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.65rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1px",
                      margin: "1px 0",
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
                      fontSize: "0.7rem",
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
              <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>
                Gestión de Proveedores
              </h3>

              <div
                style={{
                  backgroundColor: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "6px",
                  padding: "10px",
                  marginBottom: "16px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "0.9rem",
                    color: "#b45309",
                  }}
                >
                  ⚠️ Facturas Pendientes de Pago (
                  {facturasPendientesProveedores.length})
                </h4>
                {facturasPendientesProveedores.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {facturasPendientesProveedores.map((fac) => {
                      const resto = fac.totalFactura - fac.totalPagado;
                      return (
                        <div
                          key={`${fac.provedor_id}_${fac.numeroFactura}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#fff",
                            padding: "6px 8px",
                            borderRadius: "4px",
                            border: "1px solid #fef3c7",
                            fontSize: "0.8rem",
                          }}
                        >
                          <div>
                            <strong>
                              {getNombreProveedor(fac.provedor_id)}
                            </strong>{" "}
                            (Nº {fac.numeroFactura})<br />
                            <span style={{ color: "#1d4ed8" }}>
                              Total de la factura: $
                              {fac.totalFactura.toLocaleString()}
                            </span>
                            <br />
                            <span style={{ color: "#1d4ed8" }}>
                              Pago realizado: $
                              {fac.totalPagado.toLocaleString()}
                            </span>
                            <br />
                            <span
                              style={{ color: "#dc2626", fontWeight: "bold" }}
                            >
                              aun sin pagar: ${resto.toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setModalPagoAdicional({
                                mostrar: true,
                                provedor_id: fac.provedor_id,
                                numeroFactura: fac.numeroFactura,
                                totalFactura: fac.totalFactura,
                                pagadoActual: fac.totalPagado,
                                montoAdicional: resto,
                              })
                            }
                            style={{
                              ...styles.btnSuccess,
                              padding: "4px 8px",
                              fontSize: "0.75rem",
                            }}
                          >
                            Pagar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p
                    style={{ margin: 0, fontSize: "0.8rem", color: "#65a30d" }}
                  >
                    ¡Excelente! No hay facturas pendientes con proveedores.
                  </p>
                )}
              </div>

              <form
                onSubmit={handleCrearPagoProveedor}
                style={{
                  backgroundColor: "#fff",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  marginBottom: "14px",
                }}
              >
                <h5 style={{ margin: "0 0 6px 0", fontSize: "0.85rem" }}>
                  💳 Registrar Nueva Factura / Pago
                </h5>
                <div style={{ marginBottom: "6px" }}>
                  <select
                    required
                    style={{
                      ...styles.select,
                      padding: "6px 8px",
                      fontSize: "0.85rem",
                    }}
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

                <div style={{ marginBottom: "6px" }}>
                  <input
                    type="text"
                    required
                    placeholder="Número de Factura"
                    style={{
                      ...styles.input,
                      padding: "6px 8px",
                      fontSize: "0.85rem",
                    }}
                    value={formPago.numeroFactura}
                    onChange={(e) =>
                      setFormPago({
                        ...formPago,
                        numeroFactura: e.target.value,
                      })
                    }
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    marginBottom: "8px",
                  }}
                >
                  <input
                    type="number"
                    required
                    placeholder="Total de la Factura ($)"
                    style={{
                      ...styles.input,
                      padding: "6px 8px",
                      fontSize: "0.85rem",
                    }}
                    value={formPago.totalFactura}
                    onChange={(e) =>
                      setFormPago({ ...formPago, totalFactura: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    required
                    placeholder="Total a pagar ($)"
                    style={{
                      ...styles.input,
                      padding: "6px 8px",
                      fontSize: "0.85rem",
                    }}
                    value={formPago.monto}
                    onChange={(e) =>
                      setFormPago({ ...formPago, monto: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    ...styles.btnSuccess,
                    width: "100%",
                    padding: "6px",
                  }}
                >
                  Registrar Pago
                </button>
              </form>

              <h4 style={{ fontSize: "0.85rem", marginBottom: "6px" }}>
                Historial Reciente de Pagos
              </h4>
              <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th
                        style={styles.th}
                        onClick={() => cambiarOrdenHistorial("fecha")}
                      >
                        Fecha/Hora{" "}
                        {ordenHistorial.campo === "fecha"
                          ? ordenHistorial.direccion === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => cambiarOrdenHistorial("proveedor")}
                      >
                        Proveedor{" "}
                        {ordenHistorial.campo === "proveedor"
                          ? ordenHistorial.direccion === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => cambiarOrdenHistorial("numeroFactura")}
                      >
                        Nº Fact.{" "}
                        {ordenHistorial.campo === "numeroFactura"
                          ? ordenHistorial.direccion === "asc"
                            ? "▲"
                            : "▼"
                          : "↕"}
                      </th>
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        Pagado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosProveedorOrdenados.length > 0 ? (
                      pagosProveedorOrdenados.slice(0, 10).map((pago) => {
                        const pagado = Number(pago.monto || 0);

                        return (
                          <tr key={pago.id}>
                            <td style={{ ...styles.td, fontSize: "0.7rem" }}>
                              {pago.fecha}
                            </td>
                            <td style={styles.td}>
                              {getNombreProveedor(pago.provedor_id)}
                            </td>
                            <td style={styles.td}>{pago.numeroFactura}</td>
                            <td style={{ ...styles.td, textAlign: "right" }}>
                              ${pagado.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{ ...styles.td, color: "#64748b" }}
                        >
                          Sin registros recientes.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setVistaPanel({ tipo: null, data: null })}
                style={{
                  ...styles.btnSecondary,
                  marginTop: "12px",
                  width: "100%",
                  padding: "6px",
                }}
              >
                Cerrar Panel
              </button>
            </div>
          ) : vistaPanel.tipo === "pagos_pendientes_clientes" ? (
            <div style={styles.cardRight}>
              <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>
                🕒 Pagos Pendientes de Clientes
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  marginBottom: "12px",
                }}
              >
                Lista completa de clientes con deudas pendientes registradas en
                el sistema.
              </p>

              <div
                style={{
                  maxHeight: "360px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {pagosPendientesList.length > 0 ? (
                  pagosPendientesList.map((p) => {
                    const montoPendiente =
                      montosPendientesMap[p.id] || Number(p.montoExtra || 0);

                    return (
                      <div
                        key={p.id}
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "10px 12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <strong
                            style={{ fontSize: "0.95rem", color: "#1e293b" }}
                          >
                            {getNombreCliente(p.cliente_id)}
                          </strong>
                          <span
                            style={{
                              color: "#dc2626",
                              fontWeight: "bold",
                              fontSize: "0.95rem",
                            }}
                          >
                            ${montoPendiente.toLocaleString()}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() =>
                              abrirConfirmacionCobro(p.id, "efectivo")
                            }
                            style={{
                              ...styles.btnSuccess,
                              padding: "6px 10px",
                              fontSize: "0.8rem",
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
                              padding: "6px 10px",
                              fontSize: "0.8rem",
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
                      padding: "24px",
                      color: "#64748b",
                      fontSize: "0.9rem",
                      textAlign: "center",
                    }}
                  >
                    No hay pagos pendientes de clientes en este momento.
                  </div>
                )}
              </div>

              <button
                onClick={() => setVistaPanel({ tipo: null, data: null })}
                style={{
                  ...styles.btnSecondary,
                  marginTop: "16px",
                  width: "100%",
                  padding: "6px",
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
                Seleccioná "Gestionar Proveedores" o "Pagos Pendientes Clientes"
                en la parte superior para desplegar la información en este
                espacio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

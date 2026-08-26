import { useState, useEffect, useMemo } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#1a202c",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  cardHeaderWithSearch: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "10px",
  },
  gridTwoCols: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "15px",
  },
  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
    fontSize: "0.9rem",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle",
    fontSize: "0.9rem",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
  },
  inputSmallSearch: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    width: "220px",
  },
  select: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
    backgroundColor: "#fff",
  },
  btnPrimary: {
    padding: "12px 24px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  btnSecondary: {
    padding: "6px 12px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  btnActionInline: {
    padding: "8px 14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  totalBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    padding: "16px",
    borderRadius: "6px",
    marginTop: "10px",
    marginBottom: "20px",
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
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "400px",
    textAlign: "center",
  },
  modalBtn: {
    marginTop: "16px",
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  radioGroup: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "16px",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#334155",
    cursor: "pointer",
  },
};

const ENDPOINT_AUTOS = "http://localhost:3000/api/autos";
const ENDPOINT_CLIENTES = "http://localhost:3000/api/clientes";
const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";
const ENDPOINT_MERCADERIA = "http://localhost:3000/api/mercaderia";
const ENDPOINT_TRABAJOS = "http://localhost:3000/api/trabajos-realizados";
const ENDPOINT_CLIENTE_AUTO = "http://localhost:3000/api/cliente-auto";

export default function TrabajosRealizados({ onVolver }) {
  const [tipoOperacion, setTipoOperacion] = useState("vehiculo"); // "vehiculo" o "particular"

  const [autos, setAutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [serviciosOriginales, setServiciosOriginales] = useState([]);
  const [mercaderiaOriginales, setMercaderiaOriginales] = useState([]);

  const [autoId, setAutoId] = useState("");
  const [nuevoAutoMarcaModelo, setNuevoAutoMarcaModelo] = useState("");
  const [nuevoAutoPatente, setNuevoAutoPatente] = useState("");

  const [kmActual, setKmActual] = useState("");
  const [kmProximo, setKmProximo] = useState("");

  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [busquedaMercaderia, setBusquedaMercaderia] = useState("");

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState({});
  const [mercaderiaSeleccionada, setMercaderiaSeleccionada] = useState({});

  const [editandoMonto, setEditandoMonto] = useState(false);
  const [montoManual, setMontoManual] = useState("");
  const [montoFinalFijo, setMontoFinalFijo] = useState(null);
  const [tipoPago, setTipoPago] = useState("efectivo");

  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState("");
  const [nuevoClienteNombre, setNuevoClienteNombre] = useState("");
  const [nuevoClienteTelefono, setNuevoClienteTelefono] = useState("");

  const [modalAlerta, setModalAlerta] = useState({
    visible: false,
    texto: "",
    tipo: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resA, resC, resS, resM] = await Promise.all([
          fetch(ENDPOINT_AUTOS),
          fetch(ENDPOINT_CLIENTES),
          fetch(ENDPOINT_SERVICIOS),
          fetch(ENDPOINT_MERCADERIA),
        ]);

        if (resA.ok) setAutos(await resA.json());
        if (resC.ok) setClientes(await resC.json());
        if (resS.ok) setServiciosOriginales(await resS.json());
        if (resM.ok) setMercaderiaOriginales(await resM.json());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, []);

  const autoSeleccionado = useMemo(() => {
    return autos.find((a) => Number(a.id) === Number(autoId));
  }, [autos, autoId]);

  const clienteAsociadoAlAuto = useMemo(() => {
    if (!autoSeleccionado || !autoSeleccionado.cliente_id) return null;
    return clientes.find(
      (c) => Number(c.id) === Number(autoSeleccionado.cliente_id),
    );
  }, [autoSeleccionado, clientes]);

  const serviciosFiltrados = useMemo(() => {
    return serviciosOriginales.filter((s) =>
      s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase().trim()),
    );
  }, [serviciosOriginales, busquedaServicio]);

  const mercaderiaFiltrada = useMemo(() => {
    return mercaderiaOriginales.filter((m) =>
      m.nombre.toLowerCase().includes(busquedaMercaderia.toLowerCase().trim()),
    );
  }, [mercaderiaOriginales, busquedaMercaderia]);

  const subtotalServicios = useMemo(() => {
    return Object.values(serviciosSeleccionados).reduce(
      (acc, curr) => acc + Number(curr.precio || 0),
      0,
    );
  }, [serviciosSeleccionados]);

  const subtotalMercaderia = useMemo(() => {
    return Object.values(mercaderiaSeleccionada).reduce(
      (acc, curr) =>
        acc + Number(curr.precio || 0) * Number(curr.cantidad || 1),
      0,
    );
  }, [mercaderiaSeleccionada]);

  const totalBaseCalculado = subtotalServicios + subtotalMercaderia;
  const montoFinal =
    montoFinalFijo !== null ? montoFinalFijo : totalBaseCalculado;
  const costoExtra = montoFinal - totalBaseCalculado;

  const toggleServicio = (item) => {
    setServiciosSeleccionados((prev) => {
      const nuevo = { ...prev };
      if (nuevo[item.id]) delete nuevo[item.id];
      else nuevo[item.id] = item;
      return nuevo;
    });
  };

  const toggleMercaderia = (item) => {
    setMercaderiaSeleccionada((prev) => {
      const nuevo = { ...prev };
      if (nuevo[item.id]) {
        delete nuevo[item.id];
      } else {
        nuevo[item.id] = { ...item, cantidad: 1 };
      }
      return nuevo;
    });
  };

  const cambiarCantidadMercaderia = (id, cantidad) => {
    const cantNum = Math.max(1, Number(cantidad));
    setMercaderiaSeleccionada((prev) => ({
      ...prev,
      [id]: { ...prev[id], cantidad: cantNum },
    }));
  };

  const handleAgregarAutoInmediato = async () => {
    if (!nuevoAutoMarcaModelo.trim()) {
      setModalAlerta({
        visible: true,
        texto: "Debe ingresar la marca y modelo del auto.",
        tipo: "error",
      });
      return;
    }

    try {
      const response = await fetch(ENDPOINT_AUTOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marca_modelo: nuevoAutoMarcaModelo,
          patente: nuevoAutoPatente,
        }),
      });

      if (response.ok) {
        const autoCreado = await response.json();
        setAutos((prev) => [...prev, autoCreado]);
        setAutoId(String(autoCreado.id));
        setNuevoAutoMarcaModelo("");
        setNuevoAutoPatente("");
        setModalAlerta({
          visible: true,
          texto: "¡Auto registrado y seleccionado con éxito!",
          tipo: "exito",
        });
      } else {
        setModalAlerta({
          visible: true,
          texto: "Error al registrar el auto.",
          tipo: "error",
        });
      }
    } catch (error) {
      console.error("Error de red al crear auto:", error);
      setModalAlerta({
        visible: true,
        texto: "Error de red al intentar registrar el auto.",
        tipo: "error",
      });
    }
  };

  const handleCrearCliente = async () => {
    if (!nuevoClienteNombre.trim()) {
      setModalAlerta({
        visible: true,
        texto: "Debe ingresar el nombre del cliente.",
        tipo: "error",
      });
      return;
    }

    try {
      const resCliente = await fetch(ENDPOINT_CLIENTES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoClienteNombre,
          telefono: nuevoClienteTelefono,
        }),
      });

      if (!resCliente.ok) throw new Error("Error al crear el cliente");
      const clienteCreado = await resCliente.json();
      setClientes((prev) => [...prev, clienteCreado]);
      setClienteSeleccionadoId(String(clienteCreado.id));
      setNuevoClienteNombre("");
      setNuevoClienteTelefono("");
      setModalAlerta({
        visible: true,
        texto: "¡Cliente creado con éxito y seleccionado!",
        tipo: "exito",
      });
    } catch (error) {
      console.error("Error al crear cliente:", error);
      setModalAlerta({
        visible: true,
        texto: "Error de red al intentar crear el cliente.",
        tipo: "error",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tipoOperacion === "vehiculo") {
      if (autoId === "" || autoId === "nuevo") {
        setModalAlerta({
          visible: true,
          texto: "Debe seleccionar un vehículo válido registrado.",
          tipo: "error",
        });
        return;
      }
    }

    if (
      Object.keys(serviciosSeleccionados).length === 0 &&
      Object.keys(mercaderiaSeleccionada).length === 0
    ) {
      setModalAlerta({
        visible: true,
        texto: "Debe seleccionar al menos un servicio o mercadería.",
        tipo: "error",
      });
      return;
    }

    let clienteIdFinal = clienteAsociadoAlAuto
      ? Number(clienteAsociadoAlAuto.id)
      : clienteSeleccionadoId && clienteSeleccionadoId !== "nuevo"
        ? Number(clienteSeleccionadoId)
        : null;

    if (tipoPago === "pendiente" && !clienteIdFinal) {
      setModalAlerta({
        visible: true,
        texto: "Debe seleccionar un cliente para registrar el pago pendiente.",
        tipo: "error",
      });
      return;
    }

    if (
      tipoOperacion === "vehiculo" &&
      clienteIdFinal &&
      !clienteAsociadoAlAuto
    ) {
      try {
        await fetch(ENDPOINT_CLIENTE_AUTO, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_id: clienteIdFinal,
            auto_id: Number(autoId),
          }),
        });
      } catch (err) {
        console.error("Error al asociar auto con cliente:", err);
      }
    }

    const payload = {
      auto_id: tipoOperacion === "vehiculo" ? Number(autoId) : null,
      cliente_id: clienteIdFinal,
      kilometros_actuales:
        tipoOperacion === "vehiculo" && kmActual ? Number(kmActual) : null,
      kilometros_proximo_cambio:
        tipoOperacion === "vehiculo" && kmProximo ? Number(kmProximo) : null,
      fecha: new Date().toISOString().slice(0, 10),
      servicios_ids: Object.values(serviciosSeleccionados).map((s) =>
        Number(s.id),
      ),
      mercaderia: Object.values(mercaderiaSeleccionada).map((m) => ({
        mercaderia_id: Number(m.id),
        cantidad: Number(m.cantidad),
      })),
      tipo_pago: tipoPago,
      forma_pago: tipoPago,
      montoExtra: tipoPago === "pendiente" ? costoExtra : 0,
      montoTotal: tipoPago === "pendiente" ? 0 : montoFinal,
      total_final: tipoPago === "pendiente" ? 0 : montoFinal,
    };

    try {
      const response = await fetch(ENDPOINT_TRABAJOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalAlerta({
          visible: true,
          texto: "¡Trabajo registrado y guardado exitosamente!",
          tipo: "exito",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setModalAlerta({
          visible: true,
          texto:
            errorData.error ||
            "Hubo un error al guardar el trabajo en el servidor.",
          tipo: "error",
        });
      }
    } catch (error) {
      console.error("Error de red:", error);
      setModalAlerta({
        visible: true,
        texto: "Error de red al intentar conectar con el servidor.",
        tipo: "error",
      });
    }
  };

  const cerrarModalYContinuar = () => {
    const fueExito = modalAlerta.tipo === "exito";
    setModalAlerta({ visible: false, texto: "", tipo: "" });

    if (fueExito && modalAlerta.texto.includes("Trabajo registrado")) {
      setAutoId("");
      setNuevoAutoMarcaModelo("");
      setNuevoAutoPatente("");
      setKmActual("");
      setKmProximo("");
      setServiciosSeleccionados({});
      setMercaderiaSeleccionada({});
      setMontoManual("");
      setMontoFinalFijo(null);
      setEditandoMonto(false);
      setTipoPago("efectivo");
      setClienteSeleccionadoId("");
      setNuevoClienteNombre("");
      setNuevoClienteTelefono("");
      setTipoOperacion("vehiculo");

      if (typeof onVolver === "function") {
        onVolver();
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Registrar Trabajo Realizado</h1>

      {modalAlerta.visible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3
              style={{
                margin: "0 0 10px 0",
                color: modalAlerta.tipo === "error" ? "#dc2626" : "#16a34a",
              }}
            >
              {modalAlerta.tipo === "error" ? "⚠️ Atención" : "✅ ¡Éxito!"}
            </h3>
            <p style={{ color: "#475569", fontSize: "0.95rem" }}>
              {modalAlerta.texto}
            </p>
            <button onClick={cerrarModalYContinuar} style={styles.modalBtn}>
              Aceptar
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: "#334155" }}>
            1. Vehículo
          </h3>

          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="tipoOperacion"
                value="vehiculo"
                checked={tipoOperacion === "vehiculo"}
                onChange={() => setTipoOperacion("vehiculo")}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              Vehículo
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="tipoOperacion"
                value="particular"
                checked={tipoOperacion === "particular"}
                onChange={() => setTipoOperacion("particular")}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              Particular
            </label>
          </div>

          {tipoOperacion === "vehiculo" ? (
            <div style={styles.gridTwoCols}>
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Auto *
                </label>
                <select
                  value={autoId}
                  onChange={(e) => setAutoId(e.target.value)}
                  style={styles.select}
                  required
                >
                  <option value="">-- Seleccionar vehículo --</option>
                  <option value="nuevo">➕ Agregar nuevo auto...</option>
                  {autos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.marca_modelo} {a.patente ? `(${a.patente})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {autoId === "nuevo" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr auto",
                    gap: "10px",
                    gridColumn: "1 / -1",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Marca y Modelo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Ford Focus"
                      value={nuevoAutoMarcaModelo}
                      onChange={(e) => setNuevoAutoMarcaModelo(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Patente
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: AB123CD"
                      value={nuevoAutoPatente}
                      onChange={(e) => setNuevoAutoPatente(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAgregarAutoInmediato}
                      style={styles.btnActionInline}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Km Actuales
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 50000"
                    value={kmActual}
                    onChange={(e) => setKmActual(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Próximo Km
                  </label>
                  <input
                    type="number"
                    placeholder="Ej: 60000"
                    value={kmProximo}
                    onChange={(e) => setKmProximo(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: "0.95rem", margin: 0 }}>
              Modo Particular seleccionado. No se asociará ningún vehículo a
              este registro.
            </p>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeaderWithSearch}>
            <h3 style={{ margin: 0, color: "#334155" }}>
              2. Servicios Realizados
            </h3>
            <input
              type="text"
              placeholder="🔍 Buscar servicio..."
              value={busquedaServicio}
              onChange={(e) => setBusquedaServicio(e.target.value)}
              style={styles.inputSmallSearch}
            />
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, width: "50px", textAlign: "center" }}
                >
                  Sel.
                </th>
                <th style={styles.th}>Nombre del Servicio</th>
                <th style={{ ...styles.th, textAlign: "right" }}>
                  Precio Base
                </th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.length > 0 ? (
                serviciosFiltrados.map((item) => {
                  const seleccionado = !!serviciosSeleccionados[item.id];
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: seleccionado
                          ? "#f8fafc"
                          : "transparent",
                      }}
                    >
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={seleccionado}
                          onChange={() => toggleServicio(item)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </td>
                      <td style={styles.td}>{item.nombre}</td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ${Number(item.precio).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    No se encontraron servicios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeaderWithSearch}>
            <h3 style={{ margin: 0, color: "#334155" }}>
              3. Mercadería Utilizada
            </h3>
            <input
              type="text"
              placeholder="🔍 Buscar mercadería..."
              value={busquedaMercaderia}
              onChange={(e) => setBusquedaMercaderia(e.target.value)}
              style={styles.inputSmallSearch}
            />
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={{ ...styles.th, width: "50px", textAlign: "center" }}
                >
                  Sel.
                </th>
                <th style={styles.th}>Nombre del Producto</th>
                <th style={{ ...styles.th, textAlign: "right" }}>
                  Precio Unit.
                </th>
                <th
                  style={{ ...styles.th, width: "100px", textAlign: "center" }}
                >
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {mercaderiaFiltrada.length > 0 ? (
                mercaderiaFiltrada.map((item) => {
                  const seleccionado = !!mercaderiaSeleccionada[item.id];
                  const datos = mercaderiaSeleccionada[item.id];
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: seleccionado
                          ? "#f8fafc"
                          : "transparent",
                      }}
                    >
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={seleccionado}
                          onChange={() => toggleMercaderia(item)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                          }}
                        />
                      </td>
                      <td style={styles.td}>{item.nombre}</td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ${Number(item.precio).toLocaleString()}
                      </td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        {seleccionado ? (
                          <input
                            type="number"
                            min="1"
                            value={datos.cantidad}
                            onChange={(e) =>
                              cambiarCantidadMercaderia(item.id, e.target.value)
                            }
                            style={{
                              ...styles.input,
                              width: "70px",
                              textAlign: "center",
                              padding: "4px",
                            }}
                          />
                        ) : (
                          <span style={{ color: "#94a3b8" }}>-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      ...styles.td,
                      textAlign: "center",
                      color: "#64748b",
                    }}
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: "#334155" }}>
            4. Total Final y Forma de Pago
          </h3>

          <div style={styles.totalBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Total Final a Registrar:
              </span>
              {!editandoMonto ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "bold",
                      color: "#16a34a",
                    }}
                  >
                    ${montoFinal.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditandoMonto(true);
                      setMontoManual(montoFinal);
                    }}
                    style={styles.btnSecondary}
                  >
                    Modificar
                  </button>
                </div>
              ) : (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input
                    type="number"
                    value={montoManual}
                    onChange={(e) => setMontoManual(e.target.value)}
                    style={{
                      ...styles.input,
                      width: "150px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (montoManual !== "") {
                        setMontoFinalFijo(Number(montoManual));
                      }
                      setEditandoMonto(false);
                    }}
                    style={{
                      ...styles.btnSecondary,
                      backgroundColor: "#16a34a",
                    }}
                  >
                    OK
                  </button>
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "8px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span>
                Subtotal Servicios:{" "}
                <strong>${subtotalServicios.toLocaleString()}</strong>
              </span>
              <span>
                Subtotal Mercadería:{" "}
                <strong>${subtotalMercaderia.toLocaleString()}</strong>
              </span>
              {costoExtra !== 0 && (
                <span style={{ color: costoExtra > 0 ? "#16a34a" : "#dc2626" }}>
                  Ajuste manual:{" "}
                  <strong>
                    {costoExtra > 0
                      ? `+$${costoExtra.toLocaleString()}`
                      : `-$${Math.abs(costoExtra).toLocaleString()}`}
                  </strong>
                </span>
              )}
            </div>
          </div>

          <div style={styles.gridTwoCols}>
            <div>
              <label
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Forma de Pago *
              </label>
              <select
                value={tipoPago}
                onChange={(e) => setTipoPago(e.target.value)}
                style={styles.select}
              >
                <option value="efectivo">Efectivo</option>
                <option value="cuenta_bancaria">
                  Cuenta Bancaria / Billetera Virtual
                </option>
                <option value="pendiente">Pendiente (A cobrar)</option>
              </select>
            </div>

            {(tipoPago === "pendiente" || tipoOperacion === "particular") && (
              <div>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Dueño / Cliente *
                </label>
                {tipoOperacion === "vehiculo" && clienteAsociadoAlAuto ? (
                  <div
                    style={{
                      ...styles.input,
                      backgroundColor: "#f1f5f9",
                      fontWeight: "500",
                      color: "#334155",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    👤 {clienteAsociadoAlAuto.nombre}{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginLeft: "auto",
                      }}
                    >
                      (Asociado al auto)
                    </span>
                  </div>
                ) : (
                  <>
                    <select
                      value={clienteSeleccionadoId}
                      onChange={(e) => setClienteSeleccionadoId(e.target.value)}
                      style={{
                        ...styles.select,
                        marginBottom:
                          clienteSeleccionadoId === "nuevo" ? "8px" : "0",
                      }}
                      required={
                        tipoPago === "pendiente" ||
                        tipoOperacion === "particular"
                      }
                    >
                      <option value="">-- Seleccionar cliente --</option>
                      <option value="nuevo">➕ Agregar nuevo cliente...</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} {c.telefono ? `- Tel: ${c.telefono}` : ""}
                        </option>
                      ))}
                    </select>

                    {clienteSeleccionadoId === "nuevo" && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Nombre y Apellido"
                          value={nuevoClienteNombre}
                          onChange={(e) =>
                            setNuevoClienteNombre(e.target.value)
                          }
                          style={styles.input}
                        />
                        <input
                          type="text"
                          placeholder="Teléfono"
                          value={nuevoClienteTelefono}
                          onChange={(e) =>
                            setNuevoClienteTelefono(e.target.value)
                          }
                          style={styles.input}
                        />
                        <button
                          type="button"
                          onClick={handleCrearCliente}
                          style={{
                            ...styles.btnActionInline,
                            alignSelf: "flex-start",
                            marginTop: "4px",
                          }}
                        >
                          Crear
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button type="submit" style={styles.btnPrimary}>
              💾 Guardar Trabajo Realizado
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

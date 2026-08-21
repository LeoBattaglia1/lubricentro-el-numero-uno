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
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1.8fr 1.2fr",
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
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "10px 8px",
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
  },
  btnDanger: {
    padding: "4px 8px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnWarning: {
    padding: "6px 10px",
    backgroundColor: "#d97706",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
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
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  itemFilaEscasez: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#ffffff",
    marginBottom: "8px",
  },
};

const fetchDatosServidor = async () => {
  const [resMercaderia, resProveedores, resPagos, resEscasez] =
    await Promise.all([
      fetch("http://localhost:3000/api/mercaderia"),
      fetch("http://localhost:3000/api/provedores"),
      fetch("http://localhost:3000/api/pagosprovedor"),
      fetch("http://localhost:3000/api/escasesdestock"),
    ]);

  const dataMercaderia = resMercaderia.ok ? await resMercaderia.json() : [];
  const dataProveedores = resProveedores.ok ? await resProveedores.json() : [];
  const dataPagos = resPagos.ok ? await resPagos.json() : [];
  const dataEscasez = resEscasez.ok ? await resEscasez.json() : [];

  return { dataMercaderia, dataProveedores, dataPagos, dataEscasez };
};

export default function Mercaderia() {
  // Estados de datos
  const [mercaderia, setMercaderia] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [pagosProveedor, setPagosProveedor] = useState([]);
  const [escasezStock, setEscasezStock] = useState([]);

  // Estados UI y Filtros (Mercadería)
  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Estados Ordenamiento (Pagos)
  const [ordenCampoPagos, setOrdenCampoPagos] = useState("fecha");
  const [ordenAscPagos, setOrdenAscPagos] = useState(false); // Por defecto más recientes primero

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });

  // Estados Formularios
  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    telefono: "",
  });
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState("");
  const [filasNuevasMercaderias, setFilasNuevasMercaderias] = useState([
    { nombre: "", precio: "" },
  ]);

  // Formulario Pago
  const [formPago, setFormPago] = useState({ provedor_id: "", monto: "" });

  // Formulario Escasez
  const [itemEscasezAgregar, setItemEscasezAgregar] = useState(null);
  const [observacionEscasez, setObservacionEscasez] = useState("");

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        const { dataMercaderia, dataProveedores, dataPagos, dataEscasez } =
          await fetchDatosServidor();

        if (isMounted) {
          setMercaderia(dataMercaderia);
          setProveedores(dataProveedores);
          setPagosProveedor(dataPagos);
          setEscasezStock(dataEscasez);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, []);

  const refrescarTodo = async () => {
    try {
      const { dataMercaderia, dataProveedores, dataPagos, dataEscasez } =
        await fetchDatosServidor();
      setMercaderia(dataMercaderia);
      setProveedores(dataProveedores);
      setPagosProveedor(dataPagos);
      setEscasezStock(dataEscasez);
    } catch (error) {
      console.error("Error al refrescar datos:", error);
    }
  };

  const mostrarExito = (mensaje) => {
    setMensajeNotificacion(mensaje);
    setTimeout(() => {
      setMensajeNotificacion("");
    }, 4000);
  };

  const getNombreProveedor = (provedor_id) => {
    if (!provedor_id) return "Sin Proveedor";
    const prov = proveedores.find((p) => p.id === Number(provedor_id));
    return prov ? prov.nombre : "Sin Proveedor";
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const fecha = new Date(fechaStr);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  // --- ORDENAMIENTO Y FILTRADO MERCADERÍA ---
  const handleCambiarOrden = (campo) => {
    if (ordenCampo === campo) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenCampo(campo);
      setOrdenAsc(true);
    }
  };

  const mercaderiaFiltradaYOrdenada = mercaderia
    .filter((m) => {
      const q = busqueda.toLowerCase().trim();
      if (!q) return true;
      const nombreMatcheo = m.nombre?.toLowerCase().includes(q);
      const provNombreMatcheo = getNombreProveedor(m.provedor_id)
        .toLowerCase()
        .includes(q);
      return nombreMatcheo || provNombreMatcheo;
    })
    .sort((a, b) => {
      let valA = "";
      let valB = "";

      if (ordenCampo === "nombre") {
        valA = a.nombre?.toLowerCase() || "";
        valB = b.nombre?.toLowerCase() || "";
      } else if (ordenCampo === "proveedor") {
        valA = getNombreProveedor(a.provedor_id).toLowerCase();
        valB = getNombreProveedor(b.provedor_id).toLowerCase();
      }

      if (valA < valB) return ordenAsc ? -1 : 1;
      if (valA > valB) return ordenAsc ? 1 : -1;
      return 0;
    });

  // --- ORDENAMIENTO HISTORIAL DE PAGOS ---
  const handleCambiarOrdenPagos = (campo) => {
    if (ordenCampoPagos === campo) {
      setOrdenAscPagos(!ordenAscPagos);
    } else {
      setOrdenCampoPagos(campo);
      setOrdenAscPagos(true);
    }
  };

  const pagosOrdenados = [...pagosProveedor].sort((a, b) => {
    let valA = "";
    let valB = "";

    if (ordenCampoPagos === "fecha") {
      valA = a.fecha ? new Date(a.fecha).getTime() : 0;
      valB = b.fecha ? new Date(b.fecha).getTime() : 0;
    } else if (ordenCampoPagos === "proveedor") {
      valA = getNombreProveedor(a.provedor_id).toLowerCase();
      valB = getNombreProveedor(b.provedor_id).toLowerCase();
    }

    if (valA < valB) return ordenAscPagos ? -1 : 1;
    if (valA > valB) return ordenAscPagos ? 1 : -1;
    return 0;
  });

  // --- ACCIONES: CREAR PROVEEDOR ---
  const handleCrearProveedor = async (e) => {
    e.preventDefault();
    if (!formProveedor.nombre.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/api/provedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formProveedor),
      });

      if (res.ok) {
        const nuevoProveedor = await res.json();
        setProveedores((prev) => [...prev, nuevoProveedor]);
        setFormProveedor({ nombre: "", telefono: "" });
        setVistaPanel({ tipo: null, data: null });
        mostrarExito("✅ Proveedor agregado correctamente.");
      } else {
        const err = await res.json();
        alert(`Error al guardar: ${err.error || "Revisa la consola"}`);
      }
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  // --- ACCIONES: CREAR MERCADERÍA LOTE ---
  const handleAgregarFilaMercaderia = () => {
    setFilasNuevasMercaderias((prev) => [...prev, { nombre: "", precio: "" }]);
  };

  const handleGuardarLoteMercaderia = async (e) => {
    e.preventDefault();
    try {
      const promesas = filasNuevasMercaderias
        .filter((f) => f.nombre.trim() !== "")
        .map((f) =>
          fetch("http://localhost:3000/api/mercaderia", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: f.nombre,
              precio: Number(f.precio) || 0,
              provedor_id: proveedorSeleccionadoId
                ? Number(proveedorSeleccionadoId)
                : null,
            }),
          }),
        );

      await Promise.all(promesas);
      await refrescarTodo();
      setFilasNuevasMercaderias([{ nombre: "", precio: "" }]);
      setProveedorSeleccionadoId("");
      setVistaPanel({ tipo: null, data: null });
      mostrarExito("✅ Mercadería registrada con éxito.");
    } catch (error) {
      console.error("Error al guardar mercadería:", error);
    }
  };

  const handleCrearPagoProveedor = async (e) => {
    e.preventDefault();
    if (!formPago.provedor_id || !formPago.monto) return;

    const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
      const res = await fetch("http://localhost:3000/api/pagosprovedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provedor_id: Number(formPago.provedor_id),
          monto: Number(formPago.monto),
          fecha: fechaActual,
        }),
      });

      if (res.ok) {
        setFormPago({ provedor_id: "", monto: "" });
        await refrescarTodo();
        mostrarExito("✅ Pago registrado correctamente.");
      } else {
        const errorData = await res.json();
        alert(
          `Error del servidor: ${
            errorData.error ||
            errorData.message ||
            "No se pudo registrar el pago"
          }`,
        );
      }
    } catch (error) {
      console.error("Error al registrar pago:", error);
      alert("Error de conexión con el servidor backend.");
    }
  };

  // --- ACCIONES: ESCASEZ DE STOCK ---
  const handleGuardarEscasez = async (e) => {
    e.preventDefault();
    if (!itemEscasezAgregar) return;

    try {
      const res = await fetch("http://localhost:3000/api/escasesdestock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mercaderia_id: itemEscasezAgregar.id,
          observacion: observacionEscasez || null,
        }),
      });

      if (res.ok) {
        setItemEscasezAgregar(null);
        setObservacionEscasez("");
        await refrescarTodo();
        mostrarExito("⚠️ Producto añadido a la lista de escasez de stock.");
      } else {
        const err = await res.json();
        alert(`Error al registrar escasez: ${err.error || "Ocurrió un error"}`);
      }
    } catch (error) {
      console.error("Error al agregar a escasez:", error);
    }
  };

  const handleEliminarEscasez = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/escasesdestock/${id}`,
        {
          method: "DELETE",
        },
      );

      if (res.ok) {
        setEscasezStock((prev) => prev.filter((item) => item.id !== id));
        mostrarExito("🗑️ Registro de escasez eliminado.");
      }
    } catch (error) {
      console.error("Error al eliminar registro de escasez:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Mercadería y Proveedores</h1>

      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}

      {/* BARRA SUPERIOR: BUSCADOR Y BOTONES */}
      <div style={styles.topBar}>
        <div style={{ width: "320px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar mercadería o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.actionButtons}>
          <button
            onClick={() =>
              setVistaPanel({ tipo: "nuevo_proveedor", data: null })
            }
            style={styles.btnSecondary}
          >
            + Agregar Proveedor
          </button>

          <button
            onClick={() =>
              setVistaPanel({ tipo: "nueva_mercaderia", data: null })
            }
            style={styles.btnPrimary}
          >
            + Agregar Mercadería
          </button>

          <button
            onClick={() =>
              setVistaPanel({ tipo: "pagos_proveedores", data: null })
            }
            style={styles.btnSuccess}
          >
            💳 Pagos a Proveedores
          </button>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div style={styles.panelGrid}>
        {/* TABLA IZQUIERDA: MERCADERÍA */}
        <div style={styles.card}>
          <h3 style={{ margin: "0 0 16px 0", color: "#1a202c" }}>
            Listado de Mercadería
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  style={styles.th}
                  onClick={() => handleCambiarOrden("nombre")}
                >
                  Mercadería{" "}
                  {ordenCampo === "nombre" ? (ordenAsc ? "▲" : "▼") : "↕"}
                </th>
                <th
                  style={styles.th}
                  onClick={() => handleCambiarOrden("proveedor")}
                >
                  Proveedor{" "}
                  {ordenCampo === "proveedor" ? (ordenAsc ? "▲" : "▼") : "↕"}
                </th>
                <th style={{ ...styles.th, textAlign: "right" }}>Precio</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {mercaderiaFiltradaYOrdenada.length > 0 ? (
                mercaderiaFiltradaYOrdenada.map((item) => (
                  <tr key={item.id}>
                    <td style={{ ...styles.td, fontWeight: "500" }}>
                      {item.nombre}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>
                        {getNombreProveedor(item.provedor_id)}
                      </span>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      ${Number(item.precio || 0).toLocaleString()}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        title="Marcar como Escasez de Stock"
                        onClick={() => setItemEscasezAgregar(item)}
                        style={styles.btnWarning}
                      >
                        ⚠️ Escasez
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ ...styles.td, color: "#64748b" }}>
                    No hay productos registrados o coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COLUMNA DERECHA: PANEL MODULAR Y ESCASEZ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* ESCASEZ DE STOCK */}
          <div style={{ ...styles.card, borderLeft: "4px solid #d97706" }}>
            <h3
              style={{
                margin: "0 0 12px 0",
                color: "#b45309",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚠️ Escasez de Stock
            </h3>

            {itemEscasezAgregar && (
              <form
                onSubmit={handleGuardarEscasez}
                style={{
                  backgroundColor: "#fffbeb",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "14px",
                  border: "1px solid #fef3c7",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "0.9rem",
                    color: "#92400e",
                  }}
                >
                  Agregar <strong>{itemEscasezAgregar.nombre}</strong> a la
                  lista:
                </p>
                <input
                  type="text"
                  placeholder="Observación (opcional, ej: Pedir 10 unidades)"
                  value={observacionEscasez}
                  onChange={(e) => setObservacionEscasez(e.target.value)}
                  style={{ ...styles.input, marginBottom: "8px" }}
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="submit" style={styles.btnWarning}>
                    Confirmar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setItemEscasezAgregar(null);
                      setObservacionEscasez("");
                    }}
                    style={styles.btnSecondary}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {escasezStock.length > 0 ? (
              <div>
                {escasezStock.map((esc) => (
                  <div key={esc.id} style={styles.itemFilaEscasez}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1e293b" }}>
                          {esc.producto || "Producto"}
                        </strong>
                        {esc.precio && (
                          <span
                            style={{
                              marginLeft: "8px",
                              fontSize: "0.85rem",
                              color: "#16a34a",
                              fontWeight: "bold",
                            }}
                          >
                            ${Number(esc.precio).toLocaleString()}
                          </span>
                        )}
                        {esc.observacion && (
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#475569",
                              marginTop: "4px",
                              fontStyle: "italic",
                            }}
                          >
                            "{esc.observacion}"
                          </div>
                        )}
                      </div>
                      <button
                        title="Eliminar de la lista"
                        onClick={() => handleEliminarEscasez(esc.id)}
                        style={styles.btnDanger}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                No hay productos reportados con escasez de stock.
              </p>
            )}
          </div>

          {/* VISTAS DINÁMICAS (PANEL ACCIONES) */}
          {vistaPanel.tipo !== null && (
            <div style={styles.cardRight}>
              {/* VISTA 1: AGREGAR PROVEEDOR */}
              {vistaPanel.tipo === "nuevo_proveedor" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Agregar Proveedor</h3>
                  <form onSubmit={handleCrearProveedor}>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        Nombre del Proveedor:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Distribuidora Central"
                        style={styles.input}
                        value={formProveedor.nombre}
                        onChange={(e) =>
                          setFormProveedor({
                            ...formProveedor,
                            nombre: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        Teléfono:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 11 4444-5555"
                        style={styles.input}
                        value={formProveedor.telefono}
                        onChange={(e) =>
                          setFormProveedor({
                            ...formProveedor,
                            telefono: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" style={styles.btnSuccess}>
                        Guardar Proveedor
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setVistaPanel({ tipo: null, data: null })
                        }
                        style={styles.btnSecondary}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VISTA 2: AGREGAR MERCADERÍA LOTE */}
              {vistaPanel.tipo === "nueva_mercaderia" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Agregar Mercadería</h3>
                  <form onSubmit={handleGuardarLoteMercaderia}>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        Seleccionar Proveedor:
                      </label>
                      <select
                        style={styles.select}
                        value={proveedorSeleccionadoId}
                        onChange={(e) =>
                          setProveedorSeleccionadoId(e.target.value)
                        }
                      >
                        <option value="">-- Sin Proveedor / Ninguno --</option>
                        {proveedores.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <h4 style={{ marginBottom: "8px" }}>Cargar Productos</h4>
                    {filasNuevasMercaderias.map((fila, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Nombre producto"
                          required
                          value={fila.nombre}
                          onChange={(e) => {
                            const copia = [...filasNuevasMercaderias];
                            copia[idx].nombre = e.target.value;
                            setFilasNuevasMercaderias(copia);
                          }}
                          style={{ ...styles.input, flex: "2" }}
                        />
                        <input
                          type="number"
                          placeholder="Precio"
                          required
                          value={fila.precio}
                          onChange={(e) => {
                            const copia = [...filasNuevasMercaderias];
                            copia[idx].precio = e.target.value;
                            setFilasNuevasMercaderias(copia);
                          }}
                          style={{ ...styles.input, flex: "1" }}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAgregarFilaMercaderia}
                      style={{
                        ...styles.btnSecondary,
                        marginBottom: "16px",
                        display: "block",
                      }}
                    >
                      + Otro Producto
                    </button>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" style={styles.btnPrimary}>
                        Guardar Toda la Mercadería
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setVistaPanel({ tipo: null, data: null })
                        }
                        style={styles.btnSecondary}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* VISTA 3: PAGOS A PROVEEDORES */}
              {vistaPanel.tipo === "pagos_proveedores" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>
                    Gestión de Pagos a Proveedores
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
                    <h5 style={{ margin: "0 0 10px 0" }}>
                      💳 Nuevo Pago a Proveedor
                    </h5>
                    <div style={{ marginBottom: "8px" }}>
                      <select
                        required
                        style={styles.select}
                        value={formPago.provedor_id}
                        onChange={(e) =>
                          setFormPago({
                            ...formPago,
                            provedor_id: e.target.value,
                          })
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
                      Registrar Pago (Fecha Hoy)
                    </button>
                  </form>

                  <h4>Historial de Pagos</h4>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th
                          style={styles.th}
                          onClick={() => handleCambiarOrdenPagos("fecha")}
                        >
                          Fecha{" "}
                          {ordenCampoPagos === "fecha"
                            ? ordenAscPagos
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th
                          style={styles.th}
                          onClick={() => handleCambiarOrdenPagos("proveedor")}
                        >
                          Proveedor{" "}
                          {ordenCampoPagos === "proveedor"
                            ? ordenAscPagos
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th style={{ ...styles.th, textAlign: "right" }}>
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosOrdenados.length > 0 ? (
                        pagosOrdenados.map((pago) => (
                          <tr key={pago.id}>
                            <td style={styles.td}>
                              {formatearFecha(pago.fecha)}
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
                            No hay pagos registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <button
                    onClick={() => setVistaPanel({ tipo: null, data: null })}
                    style={{ ...styles.btnSecondary, marginTop: "16px" }}
                  >
                    Cerrar Panel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

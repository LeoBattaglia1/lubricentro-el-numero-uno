import { useState, useEffect, useMemo } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
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
  },
  dropdownContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#ffffff",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    padding: "6px 0",
    zIndex: 100,
    minWidth: "140px",
  },
  dropdownItem: {
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s, color 0.2s",
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
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
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
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
  btnEscasez: {
    padding: "8px 16px",
    backgroundColor: "#d97706",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnDanger: {
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnDangerSmall: {
    padding: "4px 8px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnCheckSmall: {
    padding: "4px 8px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    backgroundColor: "#f1f5f9",
    color: "#475569",
  },
  fechaBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: "bold",
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
  dropdownEscasezMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "6px",
    width: "340px",
    maxHeight: "400px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
    border: "2px solid #d97706",
    padding: "16px",
    zIndex: 100,
  },
  itemFilaEscasez: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#fffbeb",
    marginBottom: "10px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "20px 24px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
};

const formatearFecha = (fechaRaw) => {
  if (!fechaRaw) return "En Escasez";
  try {
    const d = new Date(fechaRaw);
    if (isNaN(d.getTime())) return String(fechaRaw);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return String(fechaRaw);
  }
};

const fetchEscasezBD = async () => {
  const rutas = [
    "http://localhost:3000/api/escasezstock",
    "http://localhost:3000/api/escasez",
    "http://localhost:3000/api/escasesdestock",
  ];

  for (const url of rutas) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return { data, rutaValida: url };
      }
    } catch (error) {
      console.warn(`No se pudo conectar a ${url}:`, error);
    }
  }
  return { data: [], rutaValida: rutas[0] };
};

const fetchDatosServidor = async () => {
  const [resMercaderia, resProveedores] = await Promise.all([
    fetch("http://localhost:3000/api/mercaderia"),
    fetch("http://localhost:3000/api/provedores"),
  ]);

  const dataMercaderia = resMercaderia.ok ? await resMercaderia.json() : [];
  const dataProveedores = resProveedores.ok ? await resProveedores.json() : [];
  const { data: dataEscasez, rutaValida } = await fetchEscasezBD();

  return {
    dataMercaderia,
    dataProveedores,
    dataEscasez,
    rutaValida,
  };
};

export default function Mercaderia() {
  const [mercaderia, setMercaderia] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [escasezStock, setEscasezStock] = useState([]);
  const [endpointEscasez, setEndpointEscasez] = useState(
    "http://localhost:3000/api/escasezstock",
  );

  const [menuProveedorOpen, setMenuProveedorOpen] = useState(false);
  const [menuMercaderiaOpen, setMenuMercaderiaOpen] = useState(false);
  const [menuEscasezOpen, setMenuEscasezOpen] = useState(false);
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState(null);

  const [observacionesLocal, setObservacionesLocal] = useState({});
  const [observacionesManuales, setObservacionesManuales] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAsc, setOrdenAsc] = useState(true);

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });

  const [alertaModal, setAlertaModal] = useState({
    mostrar: false,
    mensaje: "",
    titulo: "Aviso",
  });
  const [confirmModal, setConfirmModal] = useState({
    mostrar: false,
    mensaje: "",
    onConfirm: null,
  });

  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    telefono: "",
  });
  const [proveedorAEditarId, setProveedorAEditarId] = useState("");

  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState("");
  const [filasNuevasMercaderias, setFilasNuevasMercaderias] = useState([
    { nombre: "", precio: "" },
  ]);

  const [modoEdicionMercaderia, setModoEdicionMercaderia] = useState("");

  const [textoBusquedaEditar, setTextoBusquedaEditar] = useState("");
  const [mercaderiaAEditarId, setMercaderiaAEditarId] = useState("");
  const [formEditarMercaderia, setFormEditarMercaderia] = useState({
    nombre: "",
    precio: "",
    provedor_id: "",
  });

  const [proveedorEdicionMasivaId, setProveedorEdicionMasivaId] = useState("");
  const [preciosEditadosMasivos, setPreciosEditadosMasivos] = useState({});

  const [textoBusquedaEliminar, setTextoBusquedaEliminar] = useState("");
  const [mercaderiaAEliminarId, setMercaderiaAEliminarId] = useState("");

  useEffect(() => {
    let isMounted = true;
    const cargarDatos = async () => {
      try {
        const { dataMercaderia, dataProveedores, dataEscasez, rutaValida } =
          await fetchDatosServidor();
        if (isMounted) {
          setMercaderia(dataMercaderia);
          setProveedores(dataProveedores);
          setEscasezStock(dataEscasez);
          setEndpointEscasez(rutaValida);
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

  const observacionesExistentes = useMemo(() => {
    const unicas = escasezStock
      .map((e) => e.observacion)
      .filter((obs) => obs && obs.trim() !== "");
    return [...new Set(unicas)];
  }, [escasezStock]);

  const refrescarTodo = async () => {
    try {
      const { dataMercaderia, dataProveedores, dataEscasez, rutaValida } =
        await fetchDatosServidor();
      setMercaderia(dataMercaderia);
      setProveedores(dataProveedores);
      setEscasezStock(dataEscasez);
      setEndpointEscasez(rutaValida);
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

  const mostrarAlerta = (mensaje, titulo = "Aviso") => {
    setAlertaModal({ mostrar: true, mensaje, titulo });
  };

  const getNombreProveedor = (provedor_id) => {
    if (!provedor_id) return "Sin Proveedor";
    const prov = proveedores.find((p) => String(p.id) === String(provedor_id));
    return prov ? prov.nombre : "Sin Proveedor";
  };

  const handleMarcarEscasez = async (itemMercaderia) => {
    try {
      const payload = {
        mercaderia_id: Number(itemMercaderia.id),
        id_mercaderia: Number(itemMercaderia.id),
        provedor_id: itemMercaderia.provedor_id
          ? Number(itemMercaderia.provedor_id)
          : null,
        observacion: "",
      };

      let res = await fetch(endpointEscasez, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const rutasAlternativas = [
          "http://localhost:3000/api/escasezstock",
          "http://localhost:3000/api/escasez",
          "http://localhost:3000/api/escasesdestock",
        ].filter((r) => r !== endpointEscasez);

        for (const rutaAlt of rutasAlternativas) {
          res = await fetch(rutaAlt, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            setEndpointEscasez(rutaAlt);
            break;
          }
        }
      }

      if (res.ok) {
        await refrescarTodo();
        mostrarExito("⚠️ Producto registrado en Escasez de Stock.");
      } else {
        mostrarAlerta("No se pudo guardar la escasez.");
      }
    } catch (error) {
      console.error("Error al registrar escasez:", error);
    }
  };

  const handleEliminarEscasezDirecto = async (id) => {
    try {
      const res = await fetch(`${endpointEscasez}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refrescarTodo();
      } else {
        mostrarAlerta("No se pudo eliminar el registro de escasez.");
      }
    } catch (error) {
      console.error("Error al eliminar escasez:", error);
    }
  };

  const handleGuardarObservacion = async (escasezId, observacionOriginal) => {
    const escIdNum = Number(escasezId);
    const seleccion = observacionesLocal[escasezId];
    let nuevaObservacion = seleccion;

    if (seleccion === "NUEVA_OBSERVACION") {
      nuevaObservacion = observacionesManuales[escasezId] || "";
    } else if (seleccion === undefined) {
      nuevaObservacion = observacionOriginal || "";
    }

    try {
      const res = await fetch(`${endpointEscasez}/${escIdNum}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacion: nuevaObservacion }),
      });

      if (res.ok) {
        await refrescarTodo();
        mostrarExito("✅ Observación actualizada.");
      } else {
        mostrarAlerta("No se pudo actualizar la observación.");
      }
    } catch (error) {
      console.error("Error guardando observación:", error);
    }
  };

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
        await refrescarTodo();
        setFormProveedor({ nombre: "", telefono: "" });
        setVistaPanel({ tipo: null, data: null });
        mostrarExito("✅ Proveedor agregado correctamente.");
      } else {
        const err = await res.json();
        mostrarAlerta(`Error al guardar: ${err.error || "Revisa los datos"}`);
      }
    } catch (error) {
      console.error("Error al crear proveedor:", error);
    }
  };

  const handleSeleccionarProveedorAEditar = (id) => {
    setProveedorAEditarId(id);
    const prov = proveedores.find((p) => String(p.id) === String(id));
    if (prov) {
      setFormProveedor({
        nombre: prov.nombre || "",
        telefono: prov.telefono || "",
      });
    } else {
      setFormProveedor({ nombre: "", telefono: "" });
    }
  };

  const handleEditarProveedor = async (e) => {
    e.preventDefault();
    if (!proveedorAEditarId || !formProveedor.nombre.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/provedores/${proveedorAEditarId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formProveedor),
        },
      );

      if (res.ok) {
        await refrescarTodo();
        setProveedorAEditarId("");
        setFormProveedor({ nombre: "", telefono: "" });
        setVistaPanel({ tipo: null, data: null });
        mostrarExito("✅ Proveedor actualizado con éxito.");
      } else {
        const err = await res.json();
        mostrarAlerta(`Error al editar: ${err.error}`);
      }
    } catch (error) {
      console.error("Error al editar proveedor:", error);
    }
  };

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

  const handleInputSeleccionarAEditar = (valorTexto) => {
    setTextoBusquedaEditar(valorTexto);
    const itemEncontrado = mercaderia.find(
      (m) => m.nombre.toLowerCase() === valorTexto.trim().toLowerCase(),
    );

    if (itemEncontrado) {
      setMercaderiaAEditarId(itemEncontrado.id);
      setFormEditarMercaderia({
        nombre: itemEncontrado.nombre || "",
        precio: itemEncontrado.precio || "",
        provedor_id: itemEncontrado.provedor_id || "",
      });
    } else {
      setMercaderiaAEditarId("");
    }
  };

  const handleAplicarPorcentajeIndividual = (porcentaje) => {
    const precioActual = Number(formEditarMercaderia.precio) || 0;
    const nuevoPrecio = Math.round(precioActual * (1 + porcentaje / 100));
    setFormEditarMercaderia((prev) => ({ ...prev, precio: nuevoPrecio }));
  };

  const handleEditarMercaderia = async (e) => {
    e.preventDefault();
    if (!mercaderiaAEditarId || !formEditarMercaderia.nombre.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/mercaderia/${mercaderiaAEditarId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formEditarMercaderia.nombre,
            precio: Number(formEditarMercaderia.precio) || 0,
            provedor_id: formEditarMercaderia.provedor_id
              ? Number(formEditarMercaderia.provedor_id)
              : null,
          }),
        },
      );

      if (res.ok) {
        await refrescarTodo();
        setMercaderiaAEditarId("");
        setTextoBusquedaEditar("");
        setFormEditarMercaderia({ nombre: "", precio: "", provedor_id: "" });
        setVistaPanel({ tipo: null, data: null });
        mostrarExito("✅ Mercadería actualizada correctamente.");
      } else {
        mostrarAlerta("No es posible actualizar este producto");
      }
    } catch (error) {
      console.error("Error al editar mercadería:", error);
      mostrarAlerta("No es posible actualizar este producto");
    }
  };

  const handleSeleccionarProveedorMasivo = (idProv) => {
    setProveedorEdicionMasivaId(idProv);
    const filtrados = mercaderia.filter(
      (m) => String(m.provedor_id) === String(idProv),
    );

    const mapaPrecios = {};
    filtrados.forEach((item) => {
      mapaPrecios[item.id] = item.precio || 0;
    });
    setPreciosEditadosMasivos(mapaPrecios);
  };

  const handleAplicarPorcentajeMasivo = (porcentaje, idProducto = null) => {
    setPreciosEditadosMasivos((prev) => {
      const copia = { ...prev };
      if (idProducto) {
        const precioActual = Number(copia[idProducto]) || 0;
        copia[idProducto] = Math.round(precioActual * (1 + porcentaje / 100));
      } else {
        Object.keys(copia).forEach((id) => {
          const precioActual = Number(copia[id]) || 0;
          copia[id] = Math.round(precioActual * (1 + porcentaje / 100));
        });
      }
      return copia;
    });
  };

  const handleGuardarPreciosPorProveedor = async (e) => {
    e.preventDefault();
    try {
      const productosDelProveedor = mercaderia.filter(
        (m) => String(m.provedor_id) === String(proveedorEdicionMasivaId),
      );

      const promesas = productosDelProveedor
        .map((item) => {
          const nuevoPrecio = Number(preciosEditadosMasivos[item.id]);
          if (isNaN(nuevoPrecio)) return null;

          return fetch(`http://localhost:3000/api/mercaderia/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: item.nombre,
              precio: nuevoPrecio,
              provedor_id: item.provedor_id ? Number(item.provedor_id) : null,
            }),
          });
        })
        .filter(Boolean);

      await Promise.all(promesas);
      await refrescarTodo();
      setVistaPanel({ tipo: null, data: null });
      mostrarExito("✅ Precios actualizados correctamente por proveedor.");
    } catch (error) {
      console.error("Error al actualizar precios masivos:", error);
      mostrarAlerta("No se pudieron actualizar algunos precios.");
    }
  };

  const handleInputSeleccionarAEliminar = (valorTexto) => {
    setTextoBusquedaEliminar(valorTexto);
    const itemEncontrado = mercaderia.find(
      (m) => m.nombre.toLowerCase() === valorTexto.trim().toLowerCase(),
    );

    if (itemEncontrado) {
      setMercaderiaAEliminarId(itemEncontrado.id);
    } else {
      setMercaderiaAEliminarId("");
    }
  };

  const confirmarYEliminarMercaderia = async () => {
    if (!mercaderiaAEliminarId) return;

    const item = mercaderia.find(
      (m) => String(m.id) === String(mercaderiaAEliminarId),
    );

    if (item && (item.vehiculo_id || item.auto_id)) {
      mostrarAlerta("No es posible eliminar este producto");
      return;
    }

    setConfirmModal({
      mostrar: true,
      mensaje: `¿Estás seguro de eliminar "${item?.nombre}"?`,
      onConfirm: async () => {
        setConfirmModal({ mostrar: false, mensaje: "", onConfirm: null });
        try {
          const res = await fetch(
            `http://localhost:3000/api/mercaderia/${mercaderiaAEliminarId}`,
            { method: "DELETE" },
          );

          if (res.ok) {
            await refrescarTodo();
            setMercaderiaAEliminarId("");
            setTextoBusquedaEliminar("");
            setVistaPanel({ tipo: null, data: null });
            mostrarExito("🗑️ Mercadería eliminada exitosamente.");
          } else {
            mostrarAlerta("No es posible eliminar este producto");
          }
        } catch (error) {
          console.error("Error al eliminar mercadería:", error);
          mostrarAlerta("No es posible eliminar este producto");
        }
      },
    });
  };

  const getStyleDropdownItem = (id) => {
    const isHovered = hoveredDropdownItem === id;
    return {
      ...styles.dropdownItem,
      backgroundColor: isHovered ? "#2563eb" : "transparent",
      color: isHovered ? "#ffffff" : "#334155",
    };
  };

  return (
    <div style={styles.container}>
      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}

      {/* MODAL ADVERTENCIA */}
      {alertaModal.mostrar && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
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

      {/* MODAL ELIMINAR */}
      {confirmModal.mostrar && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ marginTop: 0, color: "#dc2626" }}>
              Confirmar Eliminación
            </h3>
            <p style={{ color: "#475569", margin: "16px 0" }}>
              {confirmModal.mensaje}
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button onClick={confirmModal.onConfirm} style={styles.btnDanger}>
                Eliminar
              </button>
              <button
                onClick={() =>
                  setConfirmModal({
                    mostrar: false,
                    mensaje: "",
                    onConfirm: null,
                  })
                }
                style={styles.btnSecondary}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BARRA SUPERIOR */}
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
          <div
            style={styles.dropdownContainer}
            onMouseEnter={() => setMenuProveedorOpen(true)}
            onMouseLeave={() => setMenuProveedorOpen(false)}
          >
            <button style={styles.btnSecondary}>Proveedor ▾</button>
            {menuProveedorOpen && (
              <div style={styles.dropdownMenu}>
                <button
                  style={getStyleDropdownItem("prov_add")}
                  onMouseEnter={() => setHoveredDropdownItem("prov_add")}
                  onMouseLeave={() => setHoveredDropdownItem(null)}
                  onClick={() => {
                    setVistaPanel({ tipo: "nuevo_proveedor", data: null });
                    setMenuProveedorOpen(false);
                  }}
                >
                  ➕ Agregar
                </button>
                <button
                  style={getStyleDropdownItem("prov_edit")}
                  onMouseEnter={() => setHoveredDropdownItem("prov_edit")}
                  onMouseLeave={() => setHoveredDropdownItem(null)}
                  onClick={() => {
                    setVistaPanel({ tipo: "editar_proveedor", data: null });
                    setMenuProveedorOpen(false);
                  }}
                >
                  ✏️ Editar
                </button>
              </div>
            )}
          </div>

          <div
            style={styles.dropdownContainer}
            onMouseEnter={() => setMenuMercaderiaOpen(true)}
            onMouseLeave={() => setMenuMercaderiaOpen(false)}
          >
            <button style={styles.btnPrimary}>Mercadería ▾</button>
            {menuMercaderiaOpen && (
              <div style={styles.dropdownMenu}>
                <button
                  style={getStyleDropdownItem("merc_add")}
                  onMouseEnter={() => setHoveredDropdownItem("merc_add")}
                  onMouseLeave={() => setHoveredDropdownItem(null)}
                  onClick={() => {
                    setVistaPanel({ tipo: "nueva_mercaderia", data: null });
                    setMenuMercaderiaOpen(false);
                  }}
                >
                  ➕ Agregar
                </button>
                <button
                  style={getStyleDropdownItem("merc_edit")}
                  onMouseEnter={() => setHoveredDropdownItem("merc_edit")}
                  onMouseLeave={() => setHoveredDropdownItem(null)}
                  onClick={() => {
                    setModoEdicionMercaderia("");
                    setTextoBusquedaEditar("");
                    setMercaderiaAEditarId("");
                    setProveedorEdicionMasivaId("");
                    setPreciosEditadosMasivos({});
                    setVistaPanel({ tipo: "editar_mercaderia", data: null });
                    setMenuMercaderiaOpen(false);
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  style={getStyleDropdownItem("merc_del")}
                  onMouseEnter={() => setHoveredDropdownItem("merc_del")}
                  onMouseLeave={() => setHoveredDropdownItem(null)}
                  onClick={() => {
                    setTextoBusquedaEliminar("");
                    setMercaderiaAEliminarId("");
                    setVistaPanel({ tipo: "eliminar_mercaderia", data: null });
                    setMenuMercaderiaOpen(false);
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>

          {/* BOTÓN DESPLEGABLE DE ESCASEZ */}
          <div
            style={styles.dropdownContainer}
            onMouseEnter={() => setMenuEscasezOpen(true)}
            onMouseLeave={() => setMenuEscasezOpen(false)}
          >
            <button style={styles.btnEscasez}>Escasez de Stock ▾</button>
            {menuEscasezOpen && (
              <div style={styles.dropdownEscasezMenu}>
                <h4
                  style={{
                    marginTop: 0,
                    color: "#b45309",
                    marginBottom: "12px",
                  }}
                >
                  Productos en Escasez
                </h4>

                {escasezStock.length > 0 ? (
                  escasezStock.map((esc) => {
                    const escId = esc.escasez_id || esc.id_escasez || esc.id;
                    const idMercaderiaEsc =
                      esc.mercaderia_id || esc.id_mercaderia || esc.producto_id;

                    const productoAsociado = mercaderia.find(
                      (m) => String(m.id) === String(idMercaderiaEsc),
                    );

                    const nombreMostrar =
                      esc.producto ||
                      esc.nombre ||
                      productoAsociado?.nombre ||
                      `Producto #${idMercaderiaEsc}`;

                    const valorSelect =
                      observacionesLocal[escId] !== undefined
                        ? observacionesLocal[escId]
                        : esc.observacion || "";

                    const fechaTexto = formatearFecha(
                      esc.fecha_listado || esc.fecha || esc.created_at,
                    );

                    return (
                      <div key={escId} style={styles.itemFilaEscasez}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <strong
                            style={{ color: "#1e293b", fontSize: "0.95rem" }}
                          >
                            {nombreMostrar}
                          </strong>
                          <button
                            title="Eliminar de la lista de escasez"
                            onClick={() => handleEliminarEscasezDirecto(escId)}
                            style={styles.btnDangerSmall}
                          >
                            ✕
                          </button>
                        </div>

                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            marginBottom: "6px",
                          }}
                        >
                          Fecha: {fechaTexto}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div style={{ display: "flex", gap: "6px" }}>
                            <select
                              value={valorSelect}
                              onChange={(e) =>
                                setObservacionesLocal({
                                  ...observacionesLocal,
                                  [escId]: e.target.value,
                                })
                              }
                              style={{
                                ...styles.select,
                                fontSize: "0.85rem",
                                padding: "4px 8px",
                              }}
                            >
                              <option value="">-- Sin observación --</option>
                              {observacionesExistentes.map((obs, idx) => (
                                <option key={idx} value={obs}>
                                  {obs}
                                </option>
                              ))}
                              <option value="NUEVA_OBSERVACION">
                                ✍️ Escribir nueva observación...
                              </option>
                            </select>

                            <button
                              title="Guardar observación en BD"
                              onClick={() =>
                                handleGuardarObservacion(escId, esc.observacion)
                              }
                              style={styles.btnCheckSmall}
                            >
                              ✓
                            </button>
                          </div>

                          {valorSelect === "NUEVA_OBSERVACION" && (
                            <input
                              type="text"
                              placeholder="Escribí la observación..."
                              value={observacionesManuales[escId] || ""}
                              onChange={(e) =>
                                setObservacionesManuales({
                                  ...observacionesManuales,
                                  [escId]: e.target.value,
                                })
                              }
                              style={{
                                ...styles.input,
                                fontSize: "0.85rem",
                                padding: "4px 8px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p
                    style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}
                  >
                    No hay registros en la tabla de escasez.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div style={styles.panelGrid}>
        {/* TABLA MERCADERÍA */}
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
                <th style={{ ...styles.th, textAlign: "center" }}>Escasez</th>
              </tr>
            </thead>
            <tbody>
              {mercaderiaFiltradaYOrdenada.length > 0 ? (
                mercaderiaFiltradaYOrdenada.map((item) => {
                  const registroEscasez = escasezStock.find((esc) => {
                    const idEscasez =
                      esc.mercaderia_id || esc.id_mercaderia || esc.producto_id;
                    return String(idEscasez) === String(item.id);
                  });

                  const textoFecha = registroEscasez
                    ? formatearFecha(
                        registroEscasez.fecha_listado ||
                          registroEscasez.fecha ||
                          registroEscasez.created_at,
                      )
                    : "";

                  return (
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
                        {registroEscasez ? (
                          <span
                            style={styles.fechaBadge}
                            title={
                              registroEscasez.observacion || "Sin observación"
                            }
                          >
                            {textoFecha}
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleMarcarEscasez(item)}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer",
                              accentColor: "#d97706",
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
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

        {/* COLUMNA DERECHA */}
        <div>
          {vistaPanel.tipo !== null ? (
            <div style={styles.cardRight}>
              {/* PROVEEDOR: AGREGAR */}
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
                      <button type="submit" style={styles.btnEscasez}>
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

              {/* PROVEEDOR: EDITAR */}
              {vistaPanel.tipo === "editar_proveedor" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Editar Proveedor</h3>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Seleccionar Proveedor:
                    </label>
                    <select
                      style={styles.select}
                      value={proveedorAEditarId}
                      onChange={(e) =>
                        handleSeleccionarProveedorAEditar(e.target.value)
                      }
                    >
                      <option value="">-- Seleccionar --</option>
                      {proveedores.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {proveedorAEditarId && (
                    <form onSubmit={handleEditarProveedor}>
                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Nombre del Proveedor:
                        </label>
                        <input
                          type="text"
                          required
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
                        <label
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Teléfono:
                        </label>
                        <input
                          type="text"
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
                        <button type="submit" style={styles.btnPrimary}>
                          Actualizar Proveedor
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
                  )}
                </div>
              )}

              {/* MERCADERÍA: AGREGAR */}
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

              {/* MERCADERÍA: EDITAR (CON AMBOS BUSCADORES) */}
              {vistaPanel.tipo === "editar_mercaderia" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Editar Mercadería</h3>

                  {/* Selector del tipo de buscador dentro de editar */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "4px" }}>
                      Modo de edición:
                    </label>
                    <select
                      style={styles.select}
                      value={modoEdicionMercaderia}
                      onChange={(e) => {
                        setModoEdicionMercaderia(e.target.value);
                        setMercaderiaAEditarId("");
                        setTextoBusquedaEditar("");
                        setProveedorEdicionMasivaId("");
                      }}
                    >
                      <option value="">
                        -- Seleccionar forma de búsqueda --
                      </option>
                      <option value="producto">Buscar por Producto</option>
                      <option value="proveedor">
                        Buscar por Proveedor (Precios)
                      </option>
                    </select>
                  </div>

                  {/* 1. BUSCADOR POR PRODUCTO */}
                  {modoEdicionMercaderia === "producto" && (
                    <div>
                      <div style={{ marginBottom: "16px" }}>
                        <div style={styles.inputGroup}>
                          <label
                            style={{ display: "block", marginBottom: "4px" }}
                          >
                            Buscar Producto a Editar:
                          </label>
                          <input
                            type="text"
                            list="lista-mercaderia-editar"
                            placeholder="Escribí para buscar..."
                            style={styles.input}
                            value={textoBusquedaEditar}
                            onChange={(e) =>
                              handleInputSeleccionarAEditar(e.target.value)
                            }
                          />
                          <datalist id="lista-mercaderia-editar">
                            {mercaderia.map((m) => (
                              <option key={m.id} value={m.nombre} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {mercaderiaAEditarId && (
                        <form onSubmit={handleEditarMercaderia}>
                          <div style={{ marginBottom: "12px" }}>
                            <label
                              style={{ display: "block", marginBottom: "4px" }}
                            >
                              Nombre del Producto:
                            </label>
                            <input
                              type="text"
                              required
                              style={styles.input}
                              value={formEditarMercaderia.nombre}
                              onChange={(e) =>
                                setFormEditarMercaderia({
                                  ...formEditarMercaderia,
                                  nombre: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div style={{ marginBottom: "12px" }}>
                            <label
                              style={{ display: "block", marginBottom: "4px" }}
                            >
                              Precio:
                            </label>
                            <input
                              type="number"
                              required
                              style={styles.input}
                              value={formEditarMercaderia.precio}
                              onChange={(e) =>
                                setFormEditarMercaderia({
                                  ...formEditarMercaderia,
                                  precio: e.target.value,
                                })
                              }
                            />
                            {/* Botones de porcentaje individuales */}
                            <div style={{ marginTop: "6px" }}>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: "#64748b",
                                  display: "block",
                                  marginBottom: "4px",
                                }}
                              >
                                Aumentar precio:
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "4px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {[5, 10, 15, 20, 25].map((porc) => (
                                  <button
                                    key={porc}
                                    type="button"
                                    onClick={() =>
                                      handleAplicarPorcentajeIndividual(porc)
                                    }
                                    style={{
                                      ...styles.btnSecondary,
                                      padding: "2px 6px",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    +{porc}%
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <label
                              style={{ display: "block", marginBottom: "4px" }}
                            >
                              Proveedor:
                            </label>
                            <select
                              style={styles.select}
                              value={formEditarMercaderia.provedor_id}
                              onChange={(e) =>
                                setFormEditarMercaderia({
                                  ...formEditarMercaderia,
                                  provedor_id: e.target.value,
                                })
                              }
                            >
                              <option value="">
                                -- Sin Proveedor / Ninguno --
                              </option>
                              {proveedores.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" style={styles.btnPrimary}>
                              Guardar Cambios
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
                      )}
                    </div>
                  )}

                  {/* 2. BUSCADOR POR PROVEEDOR */}
                  {modoEdicionMercaderia === "proveedor" && (
                    <div>
                      <div style={{ marginBottom: "16px" }}>
                        <label
                          style={{ display: "block", marginBottom: "4px" }}
                        >
                          Seleccionar Proveedor:
                        </label>
                        <select
                          style={styles.select}
                          value={proveedorEdicionMasivaId}
                          onChange={(e) =>
                            handleSeleccionarProveedorMasivo(e.target.value)
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

                      {proveedorEdicionMasivaId && (
                        <form onSubmit={handleGuardarPreciosPorProveedor}>
                          <div style={{ marginBottom: "12px" }}>
                            <label
                              style={{
                                display: "block",
                                marginBottom: "6px",
                                fontSize: "0.85rem",
                                color: "#64748b",
                              }}
                            >
                              Aumentar todos:
                            </label>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >
                              {[5, 10, 15, 20, 25].map((porc) => (
                                <button
                                  key={porc}
                                  type="button"
                                  onClick={() =>
                                    handleAplicarPorcentajeMasivo(porc)
                                  }
                                  style={{
                                    ...styles.btnSecondary,
                                    padding: "4px 8px",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  +{porc}%
                                </button>
                              ))}
                            </div>
                          </div>

                          <div
                            style={{
                              maxHeight: "220px",
                              overflowY: "auto",
                              marginBottom: "16px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                            }}
                          >
                            {mercaderia
                              .filter(
                                (m) =>
                                  String(m.provedor_id) ===
                                  String(proveedorEdicionMasivaId),
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#f8fafc",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    border: "1px solid #e2e8f0",
                                    gap: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.9rem",
                                      fontWeight: "500",
                                      flex: 1,
                                    }}
                                  >
                                    {item.nombre}
                                  </span>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={
                                        preciosEditadosMasivos[item.id] !==
                                        undefined
                                          ? preciosEditadosMasivos[item.id]
                                          : ""
                                      }
                                      onChange={(e) =>
                                        setPreciosEditadosMasivos({
                                          ...preciosEditadosMasivos,
                                          [item.id]: e.target.value,
                                        })
                                      }
                                      style={{
                                        ...styles.input,
                                        width: "90px",
                                        padding: "4px 8px",
                                      }}
                                    />

                                    <button
                                      type="button"
                                      title="Aumentar 10% a este producto"
                                      onClick={() =>
                                        handleAplicarPorcentajeMasivo(
                                          10,
                                          item.id,
                                        )
                                      }
                                      style={{
                                        ...styles.btnSecondary,
                                        padding: "4px 6px",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      +10%
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>

                          <div style={{ display: "flex", gap: "10px" }}>
                            <button type="submit" style={styles.btnPrimary}>
                              Guardar Precios Masivos
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
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MERCADERÍA: ELIMINAR */}
              {vistaPanel.tipo === "eliminar_mercaderia" && (
                <div>
                  <h3 style={{ marginTop: 0, color: "#dc2626" }}>
                    Eliminar Mercadería
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={styles.inputGroup}>
                      <label style={{ display: "block", marginBottom: "4px" }}>
                        Buscar Producto a Eliminar:
                      </label>
                      <input
                        type="text"
                        list="lista-mercaderia-eliminar"
                        placeholder="Escribí el nombre del producto..."
                        style={styles.input}
                        value={textoBusquedaEliminar}
                        onChange={(e) =>
                          handleInputSeleccionarAEliminar(e.target.value)
                        }
                      />
                      <datalist id="lista-mercaderia-eliminar">
                        {mercaderia.map((m) => (
                          <option key={m.id} value={m.nombre} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {mercaderiaAEliminarId && (
                    <div style={{ marginTop: "16px" }}>
                      <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                        ⚠️ Solo se pueden eliminar productos que no pertenezcan
                        ni estén asignados a ningún vehículo.
                      </p>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={confirmarYEliminarMercaderia}
                          style={styles.btnDanger}
                        >
                          Eliminar
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
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                ...styles.cardRight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              <p>
                Selecciona una opción de los menús superiores para realizar
                acciones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

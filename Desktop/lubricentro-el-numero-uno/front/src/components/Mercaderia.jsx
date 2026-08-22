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
  btnSuccess: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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

  // PANEL LATERAL ESCASEZ
  drawerContainer: {
    position: "fixed",
    top: "100px",
    right: 0,
    zIndex: 999,
    display: "flex",
    alignItems: "flex-start",
    transition: "transform 0.3s ease-in-out",
  },
  drawerTab: {
    backgroundColor: "#d97706",
    color: "#ffffff",
    padding: "12px 8px",
    writingMode: "vertical-rl",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: "1px",
    borderRadius: "8px 0 0 8px",
    cursor: "pointer",
    boxShadow: "-2px 2px 5px rgba(0,0,0,0.15)",
    fontSize: "0.85rem",
  },
  drawerContent: {
    width: "340px",
    maxHeight: "75vh",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    borderLeft: "2px solid #d97706",
    boxShadow: "-4px 0 12px rgba(0,0,0,0.15)",
    padding: "16px",
    borderRadius: "0 0 0 8px",
  },
  itemFilaEscasez: {
    padding: "10px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#fffbeb",
    marginBottom: "10px",
  },

  // MODALES
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

// HELPER PARSE FECHA (Corregido el catch sin variable no utilizada)[cite: 2]
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

// PETICIÓN SEGURA A ESCASEZ (Prueba distintas rutas si responde 404)[cite: 2]
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
    } catch {
      // Sigue intentando la otra ruta
    }
  }
  return { data: [], rutaValida: rutas[0] };
};

const fetchDatosServidor = async () => {
  const [resMercaderia, resProveedores, resPagos] = await Promise.all([
    fetch("http://localhost:3000/api/mercaderia"),
    fetch("http://localhost:3000/api/provedores"),
    fetch("http://localhost:3000/api/pagosprovedor"),
  ]);

  const dataMercaderia = resMercaderia.ok ? await resMercaderia.json() : [];
  const dataProveedores = resProveedores.ok ? await resProveedores.json() : [];
  const dataPagos = resPagos.ok ? await resPagos.json() : [];

  const { data: dataEscasez, rutaValida } = await fetchEscasezBD();

  return {
    dataMercaderia,
    dataProveedores,
    dataPagos,
    dataEscasez,
    rutaValida,
  };
};

export default function Mercaderia() {
  const [mercaderia, setMercaderia] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [pagosProveedor, setPagosProveedor] = useState([]);
  const [escasezStock, setEscasezStock] = useState([]);
  const [endpointEscasez, setEndpointEscasez] = useState(
    "http://localhost:3000/api/escasezstock",
  );

  // Estados UI
  const [menuProveedorOpen, setMenuProveedorOpen] = useState(false);
  const [menuMercaderiaOpen, setMenuMercaderiaOpen] = useState(false);
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState(null);
  const [drawerEscasezOpen, setDrawerEscasezOpen] = useState(false);

  // Observaciones temporales
  const [observacionesLocal, setObservacionesLocal] = useState({});
  const [observacionesManuales, setObservacionesManuales] = useState({});

  // Filtros y Ordenamiento (Mercadería)
  const [busqueda, setBusqueda] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("nombre");
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Ordenamiento (Pagos)
  const [ordenCampoPagos, setOrdenCampoPagos] = useState("fecha");
  const [ordenAscPagos, setOrdenAscPagos] = useState(false);

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [vistaPanel, setVistaPanel] = useState({ tipo: null, data: null });

  // Modales
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

  // Formularios Proveedor
  const [formProveedor, setFormProveedor] = useState({
    nombre: "",
    telefono: "",
  });
  const [proveedorAEditarId, setProveedorAEditarId] = useState("");

  // Formularios Mercadería
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState("");
  const [filasNuevasMercaderias, setFilasNuevasMercaderias] = useState([
    { nombre: "", precio: "" },
  ]);

  // Autocompletado Mercadería
  const [textoBusquedaEditar, setTextoBusquedaEditar] = useState("");
  const [mercaderiaAEditarId, setMercaderiaAEditarId] = useState("");
  const [formEditarMercaderia, setFormEditarMercaderia] = useState({
    nombre: "",
    precio: "",
    provedor_id: "",
  });

  const [textoBusquedaEliminar, setTextoBusquedaEliminar] = useState("");
  const [mercaderiaAEliminarId, setMercaderiaAEliminarId] = useState("");

  // Formulario Pago
  const [formPago, setFormPago] = useState({ provedor_id: "", monto: "" });

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        const {
          dataMercaderia,
          dataProveedores,
          dataPagos,
          dataEscasez,
          rutaValida,
        } = await fetchDatosServidor();

        if (isMounted) {
          setMercaderia(dataMercaderia);
          setProveedores(dataProveedores);
          setPagosProveedor(dataPagos);
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

  // Extraer observaciones únicas
  const observacionesExistentes = useMemo(() => {
    const unicas = escasezStock
      .map((e) => e.observacion)
      .filter((obs) => obs && obs.trim() !== "");
    return [...new Set(unicas)];
  }, [escasezStock]);

  const refrescarTodo = async () => {
    try {
      const {
        dataMercaderia,
        dataProveedores,
        dataPagos,
        dataEscasez,
        rutaValida,
      } = await fetchDatosServidor();
      setMercaderia(dataMercaderia);
      setProveedores(dataProveedores);
      setPagosProveedor(dataPagos);
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

  // REGISTRAR ESCASEZ MEDIANTE EL CHECKBOX
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

      // Si falla la ruta guardada, intentamos con las rutas alternativas
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
        console.error("Error al registrar escasez:", res.statusText);
        mostrarAlerta(
          "No se pudo guardar la escasez. Verifica que la ruta de la API exista.",
        );
      }
    } catch (error) {
      console.error("Error al registrar escasez:", error);
    }
  };

  // ELIMINAR DE ESCASEZ
  const handleEliminarEscasezDirecto = async (id) => {
    try {
      const res = await fetch(`${endpointEscasez}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await refrescarTodo();
      } else {
        mostrarAlerta("No se pudo eliminar el registro de escasez.");
      }
    } catch (error) {
      console.error("Error al eliminar registro de escasez:", error);
    }
  };

  // ACTUALIZAR OBSERVACIÓN
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

  // FILTROS Y ORDENAMIENTO
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

  // PROVEEDORES
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
        mostrarAlerta(`Error al editar: ${err.error || "Error al actualizar"}`);
      }
    } catch (error) {
      console.error("Error al editar proveedor:", error);
    }
  };

  // MERCADERÍA
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

  // PAGOS
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
        mostrarAlerta(
          `Error: ${
            errorData.error ||
            errorData.message ||
            "No se pudo registrar el pago"
          }`,
        );
      }
    } catch (error) {
      console.error("Error al registrar pago:", error);
      mostrarAlerta("Error de conexión con el servidor backend.");
    }
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
      {/* PANEL LATERAL ESCASEZ */}
      <div
        style={{
          ...styles.drawerContainer,
          transform: drawerEscasezOpen ? "translateX(0)" : "translateX(340px)",
        }}
        onMouseEnter={() => setDrawerEscasezOpen(true)}
        onMouseLeave={() => setDrawerEscasezOpen(false)}
      >
        <div style={styles.drawerTab}>⚠️ Escasez de Stock</div>
        <div style={styles.drawerContent}>
          <h4 style={{ marginTop: 0, color: "#b45309", marginBottom: "12px" }}>
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
                    <strong style={{ color: "#1e293b", fontSize: "0.95rem" }}>
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
            <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
              No hay registros en la tabla de escasez.
            </p>
          )}
        </div>
      </div>

      <h1 style={styles.header}>Gestión de Mercadería y Proveedores</h1>

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
                    setTextoBusquedaEditar("");
                    setMercaderiaAEditarId("");
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

                      {/* COLUMNA ESCASEZ */}
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

              {/* MERCADERÍA: EDITAR */}
              {vistaPanel.tipo === "editar_mercaderia" && (
                <div>
                  <h3 style={{ marginTop: 0 }}>Editar Mercadería</h3>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={styles.inputGroup}>
                      <label style={{ display: "block", marginBottom: "4px" }}>
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

              {/* PAGOS A PROVEEDORES */}
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
                            <td style={styles.td}>{pago.fecha || "-"}</td>
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

import { useState, useEffect, useMemo } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  header: {
    fontSize: "1.8rem",
    color: "#1a202c",
    margin: 0,
  },
  viewToggle: {
    display: "flex",
    gap: "8px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle",
  },
  inputSmall: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "4px",
  },
  selectSmall: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    marginTop: "4px",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
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
  btnSuccess: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnSecondary: {
    padding: "8px 12px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  btnDanger: {
    padding: "8px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
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
  toastError: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fca5a5",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  calendarHeaderNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  calendarTable: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  calendarTh: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "10px",
    textAlign: "center",
    color: "#475569",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  calendarCell: {
    border: "1px solid #e2e8f0",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  calendarCellToday: {
    border: "2px solid #2563eb",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#eff6ff",
    position: "relative",
  },
  calendarCellOutside: {
    border: "1px solid #e2e8f0",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#f8fafc",
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#334155",
    marginBottom: "4px",
    display: "block",
  },
  turnoBadge: {
    backgroundColor: "#dbeafe",
    border: "1px solid #bfdbfe",
    borderRadius: "4px",
    padding: "3px 6px",
    fontSize: "0.75rem",
    marginBottom: "3px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    cursor: "pointer",
    color: "#1e40af",
  },
  dropdownSelectBox: {
    position: "relative",
    marginTop: "4px",
  },
  dropdownToggleBtn: {
    width: "100%",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    backgroundColor: "#fff",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#334155",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    zIndex: 10,
    marginTop: "2px",
    maxHeight: "150px",
    overflowY: "auto",
    padding: "4px",
  },
  servicioTagItem: {
    padding: "6px 8px",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "2px",
    userSelect: "none",
    backgroundColor: "#f8fafc",
    color: "#334155",
    transition: "background-color 0.2s",
  },
  servicioTagItemActive: {
    padding: "6px 8px",
    fontSize: "0.85rem",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "2px",
    userSelect: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "500",
  },
  selectedTagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginTop: "4px",
  },
  miniPill: {
    backgroundColor: "#eff6ff",
    color: "#1e40af",
    border: "1px solid #bfdbfe",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
};

const ENDPOINT_TURNOS = "http://localhost:3000/api/turnos";
const ENDPOINT_CLIENTES = "http://localhost:3000/api/clientes";
const ENDPOINT_AUTOS = "http://localhost:3000/api/autos";
const ENDPOINT_CLIENTE_AUTO = "http://localhost:3000/api/cliente_auto";
const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [clienteAutoRelaciones, setClienteAutoRelaciones] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [vista, setVista] = useState("tabla");
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  const [fechaCalendario, setFechaCalendario] = useState(new Date());

  // Desplegables de servicios abiertos/cerrados
  const [menuServiciosNuevoAbierto, setMenuServiciosNuevoAbierto] =
    useState(false);
  const [menuServiciosEditAbierto, setMenuServiciosEditAbierto] =
    useState(null);

  // Formulario de alta rápida
  const [nuevoFecha, setNuevoFecha] = useState("");
  const [nuevoHora, setNuevoHora] = useState("");
  const [nuevoClienteId, setNuevoClienteId] = useState("");
  const [nuevoClienteNombre, setNuevoClienteNombre] = useState("");
  const [nuevoAutoId, setNuevoAutoId] = useState("");
  const [nuevoVehiculoContacto, setNuevoVehiculoContacto] = useState("");
  const [nuevoServiciosIds, setNuevoServiciosIds] = useState([]);
  const [nuevoObservaciones, setNuevoObservaciones] = useState("");

  // Edición
  const [editId, setEditId] = useState(null);
  const [editFecha, setEditFecha] = useState("");
  const [editHora, setEditHora] = useState("");
  const [editClienteId, setEditClienteId] = useState("");
  const [editClienteNombre, setEditClienteNombre] = useState("");
  const [editAutoId, setEditAutoId] = useState("");
  const [editVehiculoContacto, setEditVehiculoContacto] = useState("");
  const [editServiciosIds, setEditServiciosIds] = useState([]);
  const [editObservaciones, setEditObservaciones] = useState("");

  const [mensajeNotificacion, setMensajeNotificacion] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const cargarDatos = async () => {
    try {
      const [resT, resC, resA, resCA, resS] = await Promise.all([
        fetch(ENDPOINT_TURNOS),
        fetch(ENDPOINT_CLIENTES).catch(() => ({ ok: false })),
        fetch(ENDPOINT_AUTOS).catch(() => ({ ok: false })),
        fetch(ENDPOINT_CLIENTE_AUTO).catch(() => ({ ok: false })),
        fetch(ENDPOINT_SERVICIOS).catch(() => ({ ok: false })),
      ]);

      if (resT.ok) setTurnos(await resT.json());
      if (resC.ok) setClientes(await resC.json());
      if (resA.ok) setAutos(await resA.json());
      if (resCA.ok) setClienteAutoRelaciones(await resCA.json());
      if (resS.ok) setServicios(await resS.json());
    } catch (error) {
      console.error("Error al cargar datos de turnos:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const inicializar = async () => {
      try {
        const [resT, resC, resA, resCA, resS] = await Promise.all([
          fetch(ENDPOINT_TURNOS),
          fetch(ENDPOINT_CLIENTES).catch(() => ({ ok: false })),
          fetch(ENDPOINT_AUTOS).catch(() => ({ ok: false })),
          fetch(ENDPOINT_CLIENTE_AUTO).catch(() => ({ ok: false })),
          fetch(ENDPOINT_SERVICIOS).catch(() => ({ ok: false })),
        ]);

        const turnosData = resT.ok ? await resT.json() : [];
        const clientesData = resC.ok ? await resC.json() : [];
        const autosData = resA.ok ? await resA.json() : [];
        const clienteAutoData = resCA.ok ? await resCA.json() : [];
        const serviciosData = resS.ok ? await resS.json() : [];

        if (isMounted) {
          setTurnos(turnosData);
          setClientes(clientesData);
          setAutos(autosData);
          setClienteAutoRelaciones(clienteAutoData);
          setServicios(serviciosData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error al cargar datos de turnos:", error);
        }
      }
    };

    inicializar();

    return () => {
      isMounted = false;
    };
  }, []);

  const mostrarExito = (mensaje) => {
    setMensajeError("");
    setMensajeNotificacion(mensaje);
    setTimeout(() => setMensajeNotificacion(""), 4000);
  };

  const mostrarError = (mensaje) => {
    setMensajeNotificacion("");
    setMensajeError(mensaje);
    setTimeout(() => setMensajeError(""), 5000);
  };

  const validarFechaNoAnterior = (fechaStr) => {
    if (!fechaStr) return true;

    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const hoyStr = `${anio}-${mes}-${dia}`;

    if (fechaStr < hoyStr) {
      mostrarError(
        "No se puede programar un turno en una fecha anterior a la de hoy.",
      );
      return false;
    }
    return true;
  };

  const construirFechaHora = (fecha, hora) => {
    if (!fecha) return null;
    if (hora) {
      return `${fecha}T${hora}:00`;
    }
    return `${fecha}T00:00:00`;
  };

  // Manejador al cambiar el Cliente en Alta
  const handleCambioClienteNuevo = (valor) => {
    setNuevoClienteId(valor);
    if (valor === "OTRO") {
      setNuevoClienteNombre("");
      setNuevoAutoId("OTRO");
      setNuevoVehiculoContacto("");
      return;
    }
    if (!valor) {
      setNuevoAutoId("");
      return;
    }
    const cId = Number(valor);
    const idsAutosRelacionados = [
      ...new Set(
        clienteAutoRelaciones
          .filter((ca) => Number(ca.cliente_id) === cId)
          .map((ca) => Number(ca.auto_id)),
      ),
    ];

    const autosDelCliente = autos.filter((a) =>
      idsAutosRelacionados.includes(Number(a.id)),
    );
    if (autosDelCliente.length === 1) {
      setNuevoAutoId(autosDelCliente[0].id.toString());
    } else {
      setNuevoAutoId("");
    }
  };

  // Manejador al cambiar el Auto en Alta (Bidireccional: auto -> cliente)
  const handleCambioAutoNuevo = (valor) => {
    setNuevoAutoId(valor);
    if (valor === "OTRO") {
      setNuevoVehiculoContacto("");
      return;
    }
    if (!valor) return;
    const aId = Number(valor);
    const relacion = clienteAutoRelaciones.find(
      (ca) => Number(ca.auto_id) === aId,
    );
    if (relacion && relacion.cliente_id) {
      setNuevoClienteId(relacion.cliente_id.toString());
    }
  };

  // Manejador al cambiar el Cliente en Edición
  const handleCambioClienteEdit = (valor) => {
    setEditClienteId(valor);
    if (valor === "OTRO") {
      setEditClienteNombre("");
      setEditAutoId("OTRO");
      setEditVehiculoContacto("");
      return;
    }
    if (!valor) {
      setEditAutoId("");
      return;
    }
    const cId = Number(valor);
    const idsAutosRelacionados = [
      ...new Set(
        clienteAutoRelaciones
          .filter((ca) => Number(ca.cliente_id) === cId)
          .map((ca) => Number(ca.auto_id)),
      ),
    ];

    const autosDelCliente = autos.filter((a) =>
      idsAutosRelacionados.includes(Number(a.id)),
    );
    if (autosDelCliente.length === 1) {
      setEditAutoId(autosDelCliente[0].id.toString());
    } else {
      setEditAutoId("");
    }
  };

  // Manejador al cambiar el Auto en Edición (Bidireccional: auto -> cliente)
  const handleCambioAutoEdit = (valor) => {
    setEditAutoId(valor);
    if (valor === "OTRO") {
      setEditVehiculoContacto("");
      return;
    }
    if (!valor) return;
    const aId = Number(valor);
    const relacion = clienteAutoRelaciones.find(
      (ca) => Number(ca.auto_id) === aId,
    );
    if (relacion && relacion.cliente_id) {
      setEditClienteId(relacion.cliente_id.toString());
    }
  };

  const toggleServicioNuevo = (nombreServicio) => {
    setNuevoServiciosIds((prev) =>
      prev.includes(nombreServicio)
        ? prev.filter((s) => s !== nombreServicio)
        : [...prev, nombreServicio],
    );
  };

  const toggleServicioEdit = (nombreServicio) => {
    setEditServiciosIds((prev) =>
      prev.includes(nombreServicio)
        ? prev.filter((s) => s !== nombreServicio)
        : [...prev, nombreServicio],
    );
  };

  const handleCrearTurno = async (e) => {
    e.preventDefault();
    if (!nuevoFecha) {
      mostrarError("La fecha es obligatoria.");
      return;
    }
    if (!validarFechaNoAnterior(nuevoFecha)) return;

    const clienteIdFinal =
      nuevoClienteId && nuevoClienteId !== "OTRO"
        ? Number(nuevoClienteId)
        : null;
    const clienteNombreFinal =
      nuevoClienteId === "OTRO" ? nuevoClienteNombre : null;
    const autoIdFinal =
      nuevoAutoId && nuevoAutoId !== "OTRO" ? Number(nuevoAutoId) : null;
    const vehiculoContactoFinal =
      nuevoAutoId === "OTRO" ? nuevoVehiculoContacto : null;

    if (!clienteIdFinal && !clienteNombreFinal) {
      mostrarError("Debes indicar un cliente.");
      return;
    }

    const fechaHoraFinal = construirFechaHora(nuevoFecha, nuevoHora);
    const observacionesFinal = [
      ...nuevoServiciosIds,
      ...(nuevoObservaciones ? [nuevoObservaciones] : []),
    ].join(", ");

    try {
      const res = await fetch(ENDPOINT_TURNOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_hora: fechaHoraFinal,
          cliente_id: clienteIdFinal,
          auto_id: autoIdFinal,
          cliente_nombre: clienteNombreFinal,
          vehiculo_contacto: vehiculoContactoFinal,
          observaciones: observacionesFinal || null,
        }),
      });

      if (res.ok) {
        setNuevoFecha("");
        setNuevoHora("");
        setNuevoClienteId("");
        setNuevoClienteNombre("");
        setNuevoAutoId("");
        setNuevoVehiculoContacto("");
        setNuevoServiciosIds([]);
        setNuevoObservaciones("");
        await cargarDatos();
        mostrarExito("Turno agregado correctamente.");
      } else {
        const err = await res.json();
        mostrarError(err.error || "No se pudo crear el turno.");
      }
    } catch (error) {
      console.error("Error al crear turno:", error);
    }
  };

  const handleEliminarTurno = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este turno?")) return;
    try {
      const res = await fetch(`${ENDPOINT_TURNOS}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await cargarDatos();
        mostrarExito("Turno eliminado con éxito.");
      }
    } catch (error) {
      console.error("Error al eliminar turno:", error);
    }
  };

  const iniciarEdicion = (item) => {
    setEditId(item.id);
    if (item.fecha_hora) {
      const partes = item.fecha_hora.split("T");
      setEditFecha(partes[0] || "");
      setEditHora(partes[1] ? partes[1].slice(0, 5) : "");
    } else {
      setEditFecha("");
      setEditHora("");
    }

    if (item.cliente_id) {
      setEditClienteId(item.cliente_id.toString());
      setEditClienteNombre("");
    } else {
      setEditClienteId("OTRO");
      setEditClienteNombre(item.cliente_nombre || "");
    }

    if (item.auto_id) {
      setEditAutoId(item.auto_id.toString());
      setEditVehiculoContacto("");
    } else {
      setEditAutoId("OTRO");
      setEditVehiculoContacto(item.vehiculo_contacto || "");
    }

    const obsStr = item.observaciones || "";
    const serviciosEncontrados = servicios
      .map((s) => s.nombre)
      .filter((nombreServicio) => obsStr.includes(nombreServicio));
    setEditServiciosIds(serviciosEncontrados);
    setEditObservaciones(obsStr);
    setMenuServiciosEditAbierto(null);
  };

  const cancelarEdicion = () => setEditId(null);

  const handleGuardarEdicion = async (id) => {
    if (!editFecha) {
      mostrarError("La fecha es obligatoria.");
      return;
    }
    if (!validarFechaNoAnterior(editFecha)) return;

    const clienteIdFinal =
      editClienteId && editClienteId !== "OTRO" ? Number(editClienteId) : null;
    const clienteNombreFinal =
      editClienteId === "OTRO" ? editClienteNombre : null;
    const autoIdFinal =
      editAutoId && editAutoId !== "OTRO" ? Number(editAutoId) : null;
    const vehiculoContactoFinal =
      editAutoId === "OTRO" ? editVehiculoContacto : null;

    const fechaHoraFinal = construirFechaHora(editFecha, editHora);
    const observacionesFinal = [
      ...editServiciosIds,
      ...(editObservaciones && !editServiciosIds.includes(editObservaciones)
        ? [editObservaciones]
        : []),
    ].join(", ");

    try {
      const res = await fetch(`${ENDPOINT_TURNOS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha_hora: fechaHoraFinal,
          cliente_id: clienteIdFinal,
          auto_id: autoIdFinal,
          cliente_nombre: clienteNombreFinal,
          vehiculo_contacto: vehiculoContactoFinal,
          observaciones: observacionesFinal || null,
        }),
      });

      if (res.ok) {
        cancelarEdicion();
        await cargarDatos();
        mostrarExito("Turno actualizado con éxito.");
      } else {
        const err = await res.json();
        mostrarError(err.error || "No se pudo actualizar el turno.");
      }
    } catch (error) {
      console.error("Error al actualizar turno:", error);
    }
  };

  const turnosFiltrados = useMemo(() => {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const hoyStr = `${anio}-${mes}-${dia}`;

    return turnos
      .filter((t) => {
        if (t.fecha_hora) {
          const fechaTurnoStr = t.fecha_hora.split("T")[0];
          if (fechaTurnoStr < hoyStr) return false;
        }
        return true;
      })
      .filter((t) => {
        const textoBusqueda = busqueda.toLowerCase().trim();
        const clienteTxt = (
          t.cliente_nombre ||
          clientes.find((c) => c.id === t.cliente_id)?.nombre ||
          ""
        ).toLowerCase();
        const autoTxt = (
          t.vehiculo_contacto ||
          autos.find((a) => a.id === t.auto_id)?.marca_modelo ||
          ""
        ).toLowerCase();

        return (
          clienteTxt.includes(textoBusqueda) || autoTxt.includes(textoBusqueda)
        );
      })
      .sort((a, b) => {
        const fechaA = a.fecha_hora ? new Date(a.fecha_hora) : new Date(0);
        const fechaB = b.fecha_hora ? new Date(b.fecha_hora) : new Date(0);
        return ordenAsc ? fechaA - fechaB : fechaB - fechaA;
      });
  }, [turnos, busqueda, ordenAsc, clientes, autos]);

  const cambiarMes = (delta) => {
    setFechaCalendario(
      new Date(
        fechaCalendario.getFullYear(),
        fechaCalendario.getMonth() + delta,
        1,
      ),
    );
  };

  const nombreMesAnio = useMemo(() => {
    return fechaCalendario.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  }, [fechaCalendario]);

  const matrizDiasMes = useMemo(() => {
    const year = fechaCalendario.getFullYear();
    const month = fechaCalendario.getMonth();
    const primerDiaDelMes = new Date(year, month, 1);
    const ultimoDiaDelMes = new Date(year, month + 1, 0);

    let diaSemanaInicio = primerDiaDelMes.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

    const diasEnMes = ultimoDiaDelMes.getDate();
    const celdas = [];

    const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      celdas.push({
        fechaObj: new Date(year, month - 1, ultimoDiaMesAnterior - i),
        esMesActual: false,
      });
    }

    for (let i = 1; i <= diasEnMes; i++) {
      celdas.push({ fechaObj: new Date(year, month, i), esMesActual: true });
    }

    const totalCeldasRestantes = (7 - (celdas.length % 7)) % 7;
    for (let i = 1; i <= totalCeldasRestantes; i++) {
      celdas.push({
        fechaObj: new Date(year, month + 1, i),
        esMesActual: false,
      });
    }

    return celdas;
  }, [fechaCalendario]);

  // Autos disponibles en Alta (con deduplicación de IDs limpios)
  const autosDisponiblesAlta = useMemo(() => {
    if (!nuevoClienteId || nuevoClienteId === "OTRO") {
      return autos; // Si no hay cliente seleccionado, muestra todos o permite buscar libremente
    }
    const cId = Number(nuevoClienteId);
    const idsValidos = [
      ...new Set(
        clienteAutoRelaciones
          .filter((ca) => Number(ca.cliente_id) === cId)
          .map((ca) => Number(ca.auto_id)),
      ),
    ];
    return autos.filter((a) => idsValidos.includes(Number(a.id)));
  }, [autos, clienteAutoRelaciones, nuevoClienteId]);

  // Autos disponibles en Edición (con deduplicación de IDs limpios)
  const autosDisponiblesEdit = useMemo(() => {
    if (!editClienteId || editClienteId === "OTRO") {
      return autos;
    }
    const cId = Number(editClienteId);
    const idsValidos = [
      ...new Set(
        clienteAutoRelaciones
          .filter((ca) => Number(ca.cliente_id) === cId)
          .map((ca) => Number(ca.auto_id)),
      ),
    ];
    return autos.filter((a) => idsValidos.includes(Number(a.id)));
  }, [autos, clienteAutoRelaciones, editClienteId]);

  const ahoraIso = new Date();
  const hoyIso = `${ahoraIso.getFullYear()}-${String(ahoraIso.getMonth() + 1).padStart(2, "0")}-${String(ahoraIso.getDate()).padStart(2, "0")}`;

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Gestión de Turnos</h1>
        <div style={styles.viewToggle}>
          <button
            type="button"
            style={vista === "tabla" ? styles.btnPrimary : styles.btnSecondary}
            onClick={() => setVista("tabla")}
          >
            Vista Tabla
          </button>
          <button
            type="button"
            style={
              vista === "almanaque" ? styles.btnPrimary : styles.btnSecondary
            }
            onClick={() => setVista("almanaque")}
          >
            Vista Almanaque
          </button>
        </div>
      </div>

      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}
      {mensajeError && <div style={styles.toastError}>{mensajeError}</div>}

      {/* BARRA DE BÚSQUEDA */}
      <div style={styles.topBar}>
        <div style={{ width: "320px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar por cliente o vehículo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          type="button"
          onClick={() => setOrdenAsc(!ordenAsc)}
          style={styles.btnSecondary}
        >
          Ordenar por Fecha: {ordenAsc ? "Más próximo ▲" : "Más lejano ▼"}
        </button>
      </div>

      {/* FORMULARIO DE ALTA RÁPIDA */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 12px 0", color: "#334155" }}>
          Registrar Nuevo Turno
        </h3>

        <form
          onSubmit={handleCrearTurno}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            alignItems: "end",
          }}
        >
          <div>
            <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Fecha *
            </label>
            <input
              type="date"
              required
              min={hoyIso}
              value={nuevoFecha}
              onChange={(e) => setNuevoFecha(e.target.value)}
              style={styles.inputSmall}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Hora (Opcional)
            </label>
            <input
              type="time"
              value={nuevoHora}
              onChange={(e) => setNuevoHora(e.target.value)}
              style={styles.inputSmall}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Cliente *
            </label>
            <select
              value={nuevoClienteId}
              onChange={(e) => handleCambioClienteNuevo(e.target.value)}
              style={styles.selectSmall}
            >
              <option value="">-- Seleccionar cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
              <option value="OTRO">Otro (Escribir nombre)</option>
            </select>
            {nuevoClienteId === "OTRO" && (
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={nuevoClienteNombre}
                onChange={(e) => setNuevoClienteNombre(e.target.value)}
                style={styles.inputSmall}
              />
            )}
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Auto *
            </label>
            <select
              value={nuevoAutoId}
              onChange={(e) => handleCambioAutoNuevo(e.target.value)}
              style={styles.selectSmall}
            >
              <option value="">-- Seleccionar auto --</option>
              {autosDisponiblesAlta.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.marca_modelo} {a.patente ? `(${a.patente})` : ""}
                </option>
              ))}
              <option value="OTRO">Otro</option>
            </select>
            {nuevoAutoId === "OTRO" && (
              <input
                type="text"
                placeholder="Descripción del vehículo"
                value={nuevoVehiculoContacto}
                onChange={(e) => setNuevoVehiculoContacto(e.target.value)}
                style={styles.inputSmall}
              />
            )}
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Servicios
            </label>
            <div style={styles.dropdownSelectBox}>
              <button
                type="button"
                style={styles.dropdownToggleBtn}
                onClick={() =>
                  setMenuServiciosNuevoAbierto(!menuServiciosNuevoAbierto)
                }
              >
                <span>
                  {nuevoServiciosIds.length > 0
                    ? `${nuevoServiciosIds.length} servicio(s) seleccionado(s)`
                    : "-- Seleccionar servicios --"}
                </span>
                <span>▼</span>
              </button>
              {menuServiciosNuevoAbierto && (
                <div style={styles.dropdownList}>
                  {servicios.map((s) => {
                    const seleccionado = nuevoServiciosIds.includes(s.nombre);
                    return (
                      <div
                        key={s.id}
                        style={
                          seleccionado
                            ? styles.servicioTagItemActive
                            : styles.servicioTagItem
                        }
                        onClick={() => toggleServicioNuevo(s.nombre)}
                      >
                        {s.nombre}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {nuevoServiciosIds.length > 0 && (
              <div style={styles.selectedTagsContainer}>
                {nuevoServiciosIds.map((srv, idx) => (
                  <span key={idx} style={styles.miniPill}>
                    {srv}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <button type="submit" style={styles.btnSuccess}>
              + Agregar Turno
            </button>
          </div>
        </form>
      </div>

      {/* VISTA TABLA */}
      {vista === "tabla" && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha y Hora</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Vehículo</th>
                <th style={styles.th}>Servicio</th>
                <th
                  style={{ ...styles.th, textAlign: "center", width: "160px" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {turnosFiltrados.length > 0 ? (
                turnosFiltrados.map((item) => {
                  const enEdicion = editId === item.id;

                  const clienteObj = clientes.find(
                    (c) => c.id === item.cliente_id,
                  );
                  const autoObj = autos.find((a) => a.id === item.auto_id);

                  const nombreClienteMostrado =
                    item.cliente_nombre ||
                    (clienteObj ? clienteObj.nombre : "Sin cliente");
                  const vehiculoMostrado =
                    item.vehiculo_contacto ||
                    (autoObj
                      ? `${autoObj.marca_modelo} ${autoObj.patente ? `(${autoObj.patente})` : ""}`
                      : "Sin vehículo");

                  return (
                    <tr key={item.id}>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <div style={{ display: "flex", gap: "4px" }}>
                            <input
                              type="date"
                              required
                              min={hoyIso}
                              value={editFecha}
                              onChange={(e) => setEditFecha(e.target.value)}
                              style={styles.inputSmall}
                            />
                            <input
                              type="time"
                              value={editHora}
                              onChange={(e) => setEditHora(e.target.value)}
                              style={styles.inputSmall}
                            />
                          </div>
                        ) : (
                          <span>
                            {item.fecha_hora
                              ? new Date(item.fecha_hora).toLocaleString()
                              : "Sin horario fijo"}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <div>
                            <select
                              value={editClienteId}
                              onChange={(e) =>
                                handleCambioClienteEdit(e.target.value)
                              }
                              style={styles.selectSmall}
                            >
                              <option value="">
                                -- Seleccionar cliente --
                              </option>
                              {clientes.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nombre}
                                </option>
                              ))}
                              <option value="OTRO">Otro</option>
                            </select>
                            {editClienteId === "OTRO" && (
                              <input
                                type="text"
                                placeholder="Nombre"
                                value={editClienteNombre}
                                onChange={(e) =>
                                  setEditClienteNombre(e.target.value)
                                }
                                style={styles.inputSmall}
                              />
                            )}
                          </div>
                        ) : (
                          <span style={{ fontWeight: "500" }}>
                            {nombreClienteMostrado}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <div>
                            <select
                              value={editAutoId}
                              onChange={(e) =>
                                handleCambioAutoEdit(e.target.value)
                              }
                              style={styles.selectSmall}
                            >
                              <option value="">-- Seleccionar auto --</option>
                              {autosDisponiblesEdit.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.marca_modelo}{" "}
                                  {a.patente ? `(${a.patente})` : ""}
                                </option>
                              ))}
                              <option value="OTRO">Otro</option>
                            </select>
                            {editAutoId === "OTRO" && (
                              <input
                                type="text"
                                placeholder="Vehículo"
                                value={editVehiculoContacto}
                                onChange={(e) =>
                                  setEditVehiculoContacto(e.target.value)
                                }
                                style={styles.inputSmall}
                              />
                            )}
                          </div>
                        ) : (
                          <span>{vehiculoMostrado}</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <div>
                            <div style={styles.dropdownSelectBox}>
                              <button
                                type="button"
                                style={styles.dropdownToggleBtn}
                                onClick={() =>
                                  setMenuServiciosEditAbierto(
                                    menuServiciosEditAbierto === item.id
                                      ? null
                                      : item.id,
                                  )
                                }
                              >
                                <span>
                                  {editServiciosIds.length > 0
                                    ? `${editServiciosIds.length} servicio(s) seleccionado(s)`
                                    : "-- Seleccionar servicios --"}
                                </span>
                                <span>▼</span>
                              </button>
                              {menuServiciosEditAbierto === item.id && (
                                <div style={styles.dropdownList}>
                                  {servicios.map((s) => {
                                    const seleccionado =
                                      editServiciosIds.includes(s.nombre);
                                    return (
                                      <div
                                        key={s.id}
                                        style={
                                          seleccionado
                                            ? styles.servicioTagItemActive
                                            : styles.servicioTagItem
                                        }
                                        onClick={() =>
                                          toggleServicioEdit(s.nombre)
                                        }
                                      >
                                        {s.nombre}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {editServiciosIds.length > 0 && (
                              <div style={styles.selectedTagsContainer}>
                                {editServiciosIds.map((srv, idx) => (
                                  <span key={idx} style={styles.miniPill}>
                                    {srv}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#64748b" }}>
                            {item.observaciones || "Sin servicio"}
                          </span>
                        )}
                      </td>
                      <td style={{ ...styles.td, textAlign: "center" }}>
                        {enEdicion ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleGuardarEdicion(item.id)}
                              style={{
                                ...styles.btnSuccess,
                                padding: "6px 10px",
                                fontSize: "0.75rem",
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={cancelarEdicion}
                              style={{
                                ...styles.btnSecondary,
                                padding: "6px 10px",
                                fontSize: "0.75rem",
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "4px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => iniciarEdicion(item)}
                              style={{
                                ...styles.btnPrimary,
                                padding: "6px 10px",
                                fontSize: "0.75rem",
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEliminarTurno(item.id)}
                              style={{
                                ...styles.btnDanger,
                                padding: "6px 10px",
                                fontSize: "0.75rem",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No se encontraron turnos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VISTA ALMANAQUE (CALENDARIO) */}
      {vista === "almanaque" && (
        <div style={styles.card}>
          <div style={styles.calendarHeaderNav}>
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              style={styles.btnSecondary}
            >
              ◀ Mes Anterior
            </button>
            <h2
              style={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: "1.2rem",
                color: "#1e293b",
              }}
            >
              {nombreMesAnio}
            </h2>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              style={styles.btnSecondary}
            >
              Mes Siguiente ▶
            </button>
          </div>

          <table style={styles.calendarTable}>
            <thead>
              <tr>
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((dia, i) => (
                  <th key={i} style={styles.calendarTh}>
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(matrizDiasMes.length / 7) }).map(
                (_, semanaIdx) => (
                  <tr key={semanaIdx}>
                    {matrizDiasMes
                      .slice(semanaIdx * 7, (semanaIdx + 1) * 7)
                      .map((celda, diaIdx) => {
                        const fechaIso = `${celda.fechaObj.getFullYear()}-${String(celda.fechaObj.getMonth() + 1).padStart(2, "0")}-${String(celda.fechaObj.getDate()).padStart(2, "0")}`;
                        const esHoy = fechaIso === hoyIso;

                        const turnosDelDia = turnos.filter((t) => {
                          if (!t.fecha_hora) return false;
                          return t.fecha_hora.split("T")[0] === fechaIso;
                        });

                        let cellStyle = styles.calendarCell;
                        if (esHoy) {
                          cellStyle = styles.calendarCellToday;
                        } else if (!celda.esMesActual) {
                          cellStyle = styles.calendarCellOutside;
                        }

                        return (
                          <td key={diaIdx} style={cellStyle}>
                            <span style={styles.dayNumber}>
                              {celda.fechaObj.getDate()}
                            </span>
                            <div
                              style={{ maxHeight: "75px", overflowY: "auto" }}
                            >
                              {turnosDelDia.map((t) => {
                                const clienteObj = clientes.find(
                                  (c) => c.id === t.cliente_id,
                                );
                                const nombreCli =
                                  t.cliente_nombre ||
                                  (clienteObj ? clienteObj.nombre : "Turno");
                                const hora = t.fecha_hora
                                  ? t.fecha_hora.split("T")[1]?.slice(0, 5)
                                  : "";

                                return (
                                  <div
                                    key={t.id}
                                    style={styles.turnoBadge}
                                    onClick={() => iniciarEdicion(t)}
                                    title={`${hora} - ${nombreCli}`}
                                  >
                                    {hora ? `${hora} ` : ""}
                                    {nombreCli}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

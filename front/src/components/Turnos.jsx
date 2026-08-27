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
  formAlta: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr)) 140px",
    gap: "12px",
    alignItems: "end",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: "600",
    textTransform: "uppercase",
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
    userSelect: "none",
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle",
  },
  inputControl: {
    height: "38px",
    padding: "0 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#334155",
  },
  btnPrimary: {
    height: "38px",
    padding: "0 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSuccess: {
    height: "38px",
    padding: "0 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    height: "38px",
    padding: "0 12px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDanger: {
    height: "38px",
    padding: "0 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
  },
  dropdownToggleBtn: {
    width: "100%",
    height: "38px",
    padding: "0 10px",
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
    whiteSpace: "nowrap",
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
};

const ENDPOINT_TURNOS = "http://localhost:3000/api/turnos";
const ENDPOINT_CLIENTES = "http://localhost:3000/api/clientes";
const ENDPOINT_AUTOS = "http://localhost:3000/api/autos";
const ENDPOINT_CLIENTE_AUTO = "http://localhost:3000/api/turnos/cliente-auto";
const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";

const formatearFechaHora24hs = (fechaHoraStr) => {
  if (!fechaHoraStr) return "Sin horario fijo";
  const normalizado = fechaHoraStr.replace("T", " ");
  const [fechaPart, horaPart] = normalizado.split(" ");
  if (!fechaPart) return fechaHoraStr;

  const [anio, mes, dia] = fechaPart.split("-");
  const fechaFormateada = `${dia}/${mes}/${anio}`;

  if (!horaPart) return fechaFormateada;
  const horaMinutos = horaPart.slice(0, 5);

  return `${fechaFormateada}, ${horaMinutos} hs`;
};

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [clienteAutoRelaciones, setClienteAutoRelaciones] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [vista, setVista] = useState("tabla");
  const [busqueda, setBusqueda] = useState("");

  const [fechaCalendario, setFechaCalendario] = useState(new Date());

  const [menuServiciosNuevoAbierto, setMenuServiciosNuevoAbierto] =
    useState(false);
  const [menuServiciosEditAbierto, setMenuServiciosEditAbierto] =
    useState(null);

  // Formulario de alta
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

  useEffect(() => {
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

    cargarDatos();
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

  const construirFechaHora = (fecha, hora) => {
    if (!fecha) return null;
    if (hora) {
      return `${fecha} ${hora}:00`;
    }
    return `${fecha} 00:00:00`;
  };

  const handleCambioClienteNuevo = (valor) => {
    setNuevoClienteId(valor);
    if (valor === "OTRO") {
      setNuevoClienteNombre("");
      setNuevoAutoId("OTRO");
      setNuevoVehiculoContacto("");
      return;
    }
    setNuevoAutoId("");
    setNuevoVehiculoContacto("");
  };

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
      setNuevoClienteNombre("");
    }
  };

  const handleCambioClienteEdit = (valor) => {
    setEditClienteId(valor);
    if (valor === "OTRO") {
      setEditClienteNombre("");
      setEditAutoId("OTRO");
      setEditVehiculoContacto("");
      return;
    }
    setEditAutoId("");
    setEditVehiculoContacto("");
  };

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
      setEditClienteNombre("");
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

  const recargarTurnos = async () => {
    try {
      const resT = await fetch(ENDPOINT_TURNOS);
      if (resT.ok) setTurnos(await resT.json());
    } catch (error) {
      console.error("Error al recargar turnos:", error);
    }
  };

  const handleCrearTurno = async (e) => {
    e.preventDefault();
    if (!nuevoFecha) {
      mostrarError("La fecha es obligatoria.");
      return;
    }

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

    if (!autoIdFinal && !vehiculoContactoFinal) {
      mostrarError("Debes indicar un vehículo.");
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
        await recargarTurnos();
        mostrarExito("Turno agregado correctamente.");
      } else {
        const err = await res.json();
        mostrarError(err.error || "No se pudo crear el turno.");
      }
    } catch (error) {
      console.error("Error al crear turno:", error);
      mostrarError("Error de conexión al intentar crear el turno.");
    }
  };

  const handleEliminarTurno = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este turno?")) return;
    try {
      const res = await fetch(`${ENDPOINT_TURNOS}/${id}`, { method: "DELETE" });
      if (res.ok) {
        await recargarTurnos();
        mostrarExito("Turno eliminado con éxito.");
      }
    } catch (error) {
      console.error("Error al eliminar turno:", error);
    }
  };

  const iniciarEdicion = (item) => {
    setEditId(item.id);
    if (item.fecha_hora) {
      const normalizado = item.fecha_hora.replace("T", " ");
      const partes = normalizado.split(" ");
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

    const clienteIdFinal =
      editClienteId && editClienteId !== "OTRO" ? Number(editClienteId) : null;
    const clienteNombreFinal =
      editClienteId === "OTRO" ? editClienteNombre : null;
    const autoIdFinal =
      editAutoId && editAutoId !== "OTRO" ? Number(editAutoId) : null;
    const vehiculoContactoFinal =
      editAutoId === "OTRO" ? editVehiculoContacto : null;

    if (!clienteIdFinal && !clienteNombreFinal) {
      mostrarError("Debes indicar un cliente.");
      return;
    }

    if (!autoIdFinal && !vehiculoContactoFinal) {
      mostrarError("Debes indicar un vehículo.");
      return;
    }

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
        await recargarTurnos();
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
    const hoyIsoStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    return turnos
      .filter((t) => {
        if (!t.fecha_hora) return false;
        const normalizado = t.fecha_hora.replace("T", " ");
        const fechaTurnoStr = normalizado.split(" ")[0];

        // Filtramos para que no muestre turnos de días anteriores (comparación directa de strings YYYY-MM-DD)
        if (fechaTurnoStr < hoyIsoStr) return false;

        const textoBusqueda = busqueda.toLowerCase().trim();
        const clienteTxt = (
          t.cliente_nombre ||
          clientes.find((c) => Number(c.id) === Number(t.cliente_id))?.nombre ||
          ""
        ).toLowerCase();
        const autoTxt = (
          t.vehiculo_contacto ||
          autos.find((a) => Number(a.id) === Number(t.auto_id))?.marca_modelo ||
          ""
        ).toLowerCase();

        return (
          clienteTxt.includes(textoBusqueda) || autoTxt.includes(textoBusqueda)
        );
      })
      .sort((a, b) => {
        const normA = a.fecha_hora.replace("T", " ");
        const normB = b.fecha_hora.replace("T", " ");
        return normA.localeCompare(normB);
      });
  }, [turnos, busqueda, clientes, autos]);

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

  const autosDisponiblesAlta = useMemo(() => {
    let lista = autos;
    if (nuevoClienteId && nuevoClienteId !== "OTRO") {
      const cId = Number(nuevoClienteId);
      const idsValidos = clienteAutoRelaciones
        .filter((ca) => Number(ca.cliente_id) === cId)
        .map((ca) => Number(ca.auto_id));
      lista = autos.filter((a) => idsValidos.includes(Number(a.id)));
    }
    const unicosMap = new Map();
    lista.forEach((auto) => {
      const autoIdNum = Number(auto.id);
      if (!unicosMap.has(autoIdNum)) {
        unicosMap.set(autoIdNum, auto);
      }
    });
    return Array.from(unicosMap.values());
  }, [autos, clienteAutoRelaciones, nuevoClienteId]);

  const autosDisponiblesEdit = useMemo(() => {
    let lista = autos;
    if (editClienteId && editClienteId !== "OTRO") {
      const cId = Number(editClienteId);
      const idsValidos = clienteAutoRelaciones
        .filter((ca) => Number(ca.cliente_id) === cId)
        .map((ca) => Number(ca.auto_id));
      lista = autos.filter((a) => idsValidos.includes(Number(a.id)));
    }
    const unicosMap = new Map();
    lista.forEach((auto) => {
      const autoIdNum = Number(auto.id);
      if (!unicosMap.has(autoIdNum)) {
        unicosMap.set(autoIdNum, auto);
      }
    });
    return Array.from(unicosMap.values());
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

      <div style={styles.topBar}>
        <div style={{ width: "320px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar por cliente o vehículo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.inputControl}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: "0 0 12px 0", color: "#334155" }}>
          Registrar Nuevo Turno
        </h3>

        <form onSubmit={handleCrearTurno} style={styles.formAlta}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Fecha *</label>
            <input
              type="date"
              required
              min={hoyIso}
              value={nuevoFecha}
              onChange={(e) => setNuevoFecha(e.target.value)}
              style={styles.inputControl}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Hora</label>
            <input
              type="time"
              value={nuevoHora}
              onChange={(e) => setNuevoHora(e.target.value)}
              style={styles.inputControl}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Cliente *</label>
            <select
              value={nuevoClienteId}
              onChange={(e) => handleCambioClienteNuevo(e.target.value)}
              style={styles.inputControl}
            >
              <option value="">-- Seleccionar --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
              <option value="OTRO">Otro</option>
            </select>
            {nuevoClienteId === "OTRO" && (
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoClienteNombre}
                onChange={(e) => setNuevoClienteNombre(e.target.value)}
                style={{ ...styles.inputControl, marginTop: "6px" }}
              />
            )}
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Auto *</label>
            <select
              value={nuevoAutoId}
              onChange={(e) => handleCambioAutoNuevo(e.target.value)}
              style={styles.inputControl}
            >
              <option value="">-- Seleccionar --</option>
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
                placeholder="Vehículo"
                value={nuevoVehiculoContacto}
                onChange={(e) => setNuevoVehiculoContacto(e.target.value)}
                style={{ ...styles.inputControl, marginTop: "6px" }}
              />
            )}
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Servicios</label>
            <div style={styles.dropdownSelectBox}>
              <button
                type="button"
                style={styles.dropdownToggleBtn}
                onClick={() =>
                  setMenuServiciosNuevoAbierto(!menuServiciosNuevoAbierto)
                }
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {nuevoServiciosIds.length > 0
                    ? `${nuevoServiciosIds.length} sel.`
                    : "Seleccionar"}
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
          </div>
          <div style={styles.fieldGroup}>
            <button type="submit" style={styles.btnSuccess}>
              + Agregar
            </button>
          </div>
        </form>
      </div>

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
                    (c) => Number(c.id) === Number(item.cliente_id),
                  );
                  const autoObj = autos.find(
                    (a) => Number(a.id) === Number(item.auto_id),
                  );

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
                              style={styles.inputControl}
                            />
                            <input
                              type="time"
                              value={editHora}
                              onChange={(e) => setEditHora(e.target.value)}
                              style={styles.inputControl}
                            />
                          </div>
                        ) : (
                          <span>{formatearFechaHora24hs(item.fecha_hora)}</span>
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
                              style={styles.inputControl}
                            >
                              <option value="">-- Seleccionar --</option>
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
                                style={{
                                  ...styles.inputControl,
                                  marginTop: "4px",
                                }}
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
                              style={styles.inputControl}
                            >
                              <option value="">-- Seleccionar --</option>
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
                                style={{
                                  ...styles.inputControl,
                                  marginTop: "4px",
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <span>{vehiculoMostrado}</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
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
                                  ? `${editServiciosIds.length} sel.`
                                  : "Seleccionar"}
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
                                height: "32px",
                                padding: "0 10px",
                                fontSize: "0.75rem",
                                width: "auto",
                              }}
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={cancelarEdicion}
                              style={{
                                ...styles.btnSecondary,
                                height: "32px",
                                padding: "0 10px",
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
                                height: "32px",
                                padding: "0 10px",
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
                                height: "32px",
                                padding: "0 10px",
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
                        const fechaIso = `${celda.fechaObj.getFullYear()}-${String(
                          celda.fechaObj.getMonth() + 1,
                        ).padStart(
                          2,
                          "0",
                        )}-${String(celda.fechaObj.getDate()).padStart(2, "0")}`;
                        const esHoy = fechaIso === hoyIso;

                        const turnosDelDia = turnos.filter((t) => {
                          if (!t.fecha_hora) return false;
                          const normalizado = t.fecha_hora.replace("T", " ");
                          return normalizado.split(" ")[0] === fechaIso;
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
                                  (c) => Number(c.id) === Number(t.cliente_id),
                                );
                                const nombreCli =
                                  t.cliente_nombre ||
                                  (clienteObj ? clienteObj.nombre : "Turno");
                                const normalizado = t.fecha_hora.replace(
                                  "T",
                                  " ",
                                );
                                const partesFecha = normalizado.split(" ");
                                const hora = partesFecha[1]
                                  ? partesFecha[1].slice(0, 5)
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

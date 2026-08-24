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
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    width: "100%",
    boxSizing: "border-box",
  },
  inputSmall: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
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
  btnPercent: {
    padding: "4px 8px",
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  percentContainer: {
    display: "flex",
    gap: "4px",
    marginTop: "4px",
    flexWrap: "wrap",
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

const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Estados para nuevo servicio (Fila de alta rápida)
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  // Estados para edición en línea
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [precioBaseOriginal, setPrecioBaseOriginal] = useState(0);

  // Notificaciones
  const [mensajeNotificacion, setMensajeNotificacion] = useState("");

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        const res = await fetch(ENDPOINT_SERVICIOS);
        if (res.ok) {
          const data = await res.json();
          setServicios(data);
        }
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    cargarServicios();
  }, []);

  const mostrarExito = (mensaje) => {
    setMensajeNotificacion(mensaje);
    setTimeout(() => setMensajeNotificacion(""), 4000);
  };

  // Recargar servicios manualmente cuando sea necesario
  const recargarServicios = async () => {
    try {
      const res = await fetch(ENDPOINT_SERVICIOS);
      if (res.ok) {
        const data = await res.json();
        setServicios(data);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  // CREAR SERVICIO
  const handleCrearServicio = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoPrecio) return;

    try {
      const res = await fetch(ENDPOINT_SERVICIOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoNombre.trim(),
          precio: Number(nuevoPrecio),
        }),
      });

      if (res.ok) {
        setNuevoNombre("");
        setNuevoPrecio("");
        await recargarServicios();
        mostrarExito("✅ Servicio agregado correctamente.");
      } else {
        alert("No se pudo crear el servicio.");
      }
    } catch (error) {
      console.error("Error al crear servicio:", error);
    }
  };

  // INICIAR EDICIÓN
  const iniciarEdicion = (item) => {
    setEditId(item.id);
    setEditNombre(item.nombre);
    setEditPrecio(item.precio);
    setPrecioBaseOriginal(Number(item.precio));
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditNombre("");
    setEditPrecio("");
  };

  // APLICAR PORCENTAJE SOBRE EL PRECIO ORIGINAL DE ESA EDICIÓN
  const aplicarPorcentaje = (porcentaje) => {
    const aumento = precioBaseOriginal * (porcentaje / 100);
    const nuevoValorCalculado =
      Math.round((precioBaseOriginal + aumento) * 100) / 100;
    setEditPrecio(nuevoValorCalculado);
  };

  // GUARDAR EDICIÓN
  const handleGuardarEdicion = async (id) => {
    if (!editNombre.trim() || !editPrecio) return;

    try {
      const res = await fetch(`${ENDPOINT_SERVICIOS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editNombre.trim(),
          precio: Number(editPrecio),
        }),
      });

      if (res.ok) {
        cancelarEdicion();
        await recargarServicios();
        mostrarExito("✅ Servicio actualizado con éxito.");
      } else {
        alert("No se pudo actualizar el servicio.");
      }
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
    }
  };

  // FILTRADO Y ORDENAMIENTO
  const serviciosFiltrados = useMemo(() => {
    return servicios
      .filter((s) =>
        s.nombre.toLowerCase().includes(busqueda.toLowerCase().trim()),
      )
      .sort((a, b) => {
        const valA = a.nombre.toLowerCase();
        const valB = b.nombre.toLowerCase();
        if (valA < valB) return ordenAsc ? -1 : 1;
        if (valA > valB) return ordenAsc ? 1 : -1;
        return 0;
      });
  }, [servicios, busqueda, ordenAsc]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Gestión de Servicios</h1>

      {mensajeNotificacion && (
        <div style={styles.toastSuccess}>{mensajeNotificacion}</div>
      )}

      {/* BARRA SUPERIOR DE BÚSQUEDA */}
      <div style={styles.topBar}>
        <div style={{ width: "320px" }}>
          <input
            type="text"
            placeholder="🔍 Buscar servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* CONTENEDOR DE LA TABLA */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => setOrdenAsc(!ordenAsc)}>
                Servicio {ordenAsc ? "▲" : "▼"}
              </th>
              <th style={{ ...styles.th, width: "220px" }}>Precio ($)</th>
              <th style={{ ...styles.th, width: "140px", textAlign: "center" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {/* FILA RÁPIDA PARA AGREGAR NUEVO SERVICIO */}
            <tr style={{ backgroundColor: "#f8fafc" }}>
              <td style={styles.td}>
                <input
                  type="text"
                  placeholder="+ Agregar nuevo servicio..."
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  style={styles.inputSmall}
                />
              </td>
              <td style={styles.td}>
                <input
                  type="number"
                  placeholder="Precio ($)"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  style={styles.inputSmall}
                />
              </td>
              <td style={{ ...styles.td, textAlign: "center" }}>
                <button
                  type="button"
                  onClick={handleCrearServicio}
                  style={styles.btnSuccess}
                >
                  + Servicio
                </button>
              </td>
            </tr>

            {/* LISTADO DE SERVICIOS */}
            {serviciosFiltrados.length > 0 ? (
              serviciosFiltrados.map((item) => {
                const enEdicion = editId === item.id;

                return (
                  <tr key={item.id}>
                    {/* COLUMNA NOMBRE */}
                    <td style={styles.td}>
                      {enEdicion ? (
                        <input
                          type="text"
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                          style={styles.inputSmall}
                        />
                      ) : (
                        <span style={{ fontWeight: "500", color: "#1e293b" }}>
                          {item.nombre}
                        </span>
                      )}
                    </td>

                    {/* COLUMNA PRECIO Y BOTONES DE PORCENTAJE */}
                    <td style={styles.td}>
                      {enEdicion ? (
                        <div>
                          <input
                            type="number"
                            value={editPrecio}
                            onChange={(e) => setEditPrecio(e.target.value)}
                            style={styles.inputSmall}
                          />
                          <div style={styles.percentContainer}>
                            <button
                              type="button"
                              style={styles.btnPercent}
                              onClick={() => aplicarPorcentaje(5)}
                            >
                              +5%
                            </button>
                            <button
                              type="button"
                              style={styles.btnPercent}
                              onClick={() => aplicarPorcentaje(10)}
                            >
                              +10%
                            </button>
                            <button
                              type="button"
                              style={styles.btnPercent}
                              onClick={() => aplicarPorcentaje(15)}
                            >
                              +15%
                            </button>
                            <button
                              type="button"
                              style={styles.btnPercent}
                              onClick={() => aplicarPorcentaje(20)}
                            >
                              +20%
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontWeight: "bold", color: "#0f172a" }}>
                          ${Number(item.precio || 0).toLocaleString()}
                        </span>
                      )}
                    </td>

                    {/* COLUMNA ACCIONES */}
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {enEdicion ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleGuardarEdicion(item.id)}
                            style={styles.btnSuccess}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            style={styles.btnSecondary}
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => iniciarEdicion(item)}
                            style={styles.btnPrimary}
                          >
                            Editar
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
                  colSpan="3"
                  style={{
                    ...styles.td,
                    color: "#64748b",
                    textAlign: "center",
                  }}
                >
                  No se encontraron servicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

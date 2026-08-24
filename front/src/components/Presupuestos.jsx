import { useState, useEffect, useMemo } from "react";
import html2pdf from "html2pdf.js";

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
    marginBottom: "20px",
  },
  gridClientes: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "10px",
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
  selectSmall: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  btnPrimary: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
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
  totalContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
    gap: "20px",
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#0f172a",
  },
};

const ENDPOINT_CLIENTES = "http://localhost:3000/api/clientes";
const ENDPOINT_AUTOS = "http://localhost:3000/api/autos";
const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";

export default function Presupuesto() {
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [serviciosOriginales, setServiciosOriginales] = useState([]);

  // Búsqueda y ordenamiento
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Selección de cliente y auto
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [autoId, setAutoId] = useState("");
  const [vehiculoContacto, setVehiculoContacto] = useState("");

  // Mapa de servicios seleccionados para el presupuesto
  const [serviciosPresupuesto, setServiciosPresupuesto] = useState({});

  // Edición temporal de precio unitario dentro de la tabla
  const [editId, setEditId] = useState(null);
  const [tempPrecioInput, setTempPrecioInput] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resC, resA, resS] = await Promise.all([
          fetch(ENDPOINT_CLIENTES),
          fetch(ENDPOINT_AUTOS),
          fetch(ENDPOINT_SERVICIOS),
        ]);

        if (resC.ok) setClientes(await resC.json());
        if (resA.ok) setAutos(await resA.json());
        if (resS.ok) setServiciosOriginales(await resS.json());
      } catch (error) {
        console.error("Error al cargar datos para el presupuesto:", error);
      }
    };
    cargarDatos();
  }, []);

  // Lógica de clientes / autos
  const handleCambioCliente = (valor) => {
    setClienteId(valor);
    if (valor === "OTRO") {
      setClienteNombre("");
      setAutoId("OTRO");
      setVehiculoContacto("");
      return;
    }
    if (!valor) {
      setAutoId("");
      return;
    }
    const cId = Number(valor);
    const autosDelCliente = autos.filter((a) => Number(a.cliente_id) === cId);
    if (autosDelCliente.length === 1) {
      setAutoId(autosDelCliente[0].id.toString());
    } else {
      setAutoId("");
    }
  };

  const handleCambioAuto = (valor) => {
    setAutoId(valor);
    if (valor === "OTRO") {
      setVehiculoContacto("");
      return;
    }
    if (!valor) return;
    const aId = Number(valor);
    const autoEncontrado = autos.find((a) => Number(a.id) === aId);
    if (autoEncontrado && autoEncontrado.cliente_id) {
      setClienteId(autoEncontrado.cliente_id.toString());
    }
  };

  const autosDisponibles = useMemo(() => {
    if (!clienteId || clienteId === "OTRO") return autos;
    return autos.filter((a) => Number(a.cliente_id) === Number(clienteId));
  }, [autos, clienteId]);

  // Selección de servicios
  const toggleSeleccionServicio = (item) => {
    setServiciosPresupuesto((prev) => {
      const nuevo = { ...prev };
      if (nuevo[item.id]) {
        delete nuevo[item.id];
      } else {
        nuevo[item.id] = {
          ...item,
          precioPresupuesto: Number(item.precio),
          cantidad: 1,
          precioBaseOriginal: Number(item.precio),
        };
      }
      return nuevo;
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    const cantNum = Math.max(1, Number(cantidad));
    setServiciosPresupuesto((prev) => ({
      ...prev,
      [id]: { ...prev[id], cantidad: cantNum },
    }));
  };

  // Edición de precio temporal
  const iniciarEdicionPrecio = (item) => {
    const actual = serviciosPresupuesto[item.id];
    setEditId(item.id);
    setTempPrecioInput(actual ? actual.precioPresupuesto : item.precio);
  };

  const aplicarPorcentajeTemporal = (porcentaje) => {
    const servSeleccionado = serviciosPresupuesto[editId];
    if (!servSeleccionado) return;
    const base = servSeleccionado.precioBaseOriginal;
    const aumento = base * (porcentaje / 100);
    const calculado = Math.round((base + aumento) * 100) / 100;
    setTempPrecioInput(calculado);
  };

  const guardarPrecioTemporal = (id) => {
    setServiciosPresupuesto((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        precioPresupuesto: Number(tempPrecioInput) || 0,
      },
    }));
    setEditId(null);
  };

  // Filtrado y ordenamiento
  const serviciosFiltrados = useMemo(() => {
    return serviciosOriginales
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
  }, [serviciosOriginales, busqueda, ordenAsc]);

  const totalPresupuesto = useMemo(() => {
    return Object.values(serviciosPresupuesto).reduce(
      (acc, curr) => acc + curr.precioPresupuesto * curr.cantidad,
      0,
    );
  }, [serviciosPresupuesto]);

  // Textos para el documento
  const nombreClienteTexto = useMemo(() => {
    if (clienteId === "OTRO") return clienteNombre || "";
    const c = clientes.find((item) => Number(item.id) === Number(clienteId));
    return c ? c.nombre : "";
  }, [clienteId, clienteNombre, clientes]);

  const nombreAutoTexto = useMemo(() => {
    if (autoId === "OTRO") return vehiculoContacto || "";
    const a = autos.find((item) => Number(item.id) === Number(autoId));
    return a ? `${a.marca_modelo} ${a.patente ? `(${a.patente})` : ""}` : "";
  }, [autoId, vehiculoContacto, autos]);

  // FUNCIÓN PARA GENERAR Y DESCARGAR EL PDF CON EL NOMBRE PERSONALIZADO
  const descargarPDF = () => {
    const fechaActual = new Date().toLocaleDateString("es-AR");
    const fechaLimpia = fechaActual.replace(/\//g, "-");

    // Construcción del nombre del archivo según los datos disponibles
    let partesNombre = [];
    if (nombreClienteTexto.trim()) partesNombre.push(nombreClienteTexto.trim());
    if (nombreAutoTexto.trim()) partesNombre.push(nombreAutoTexto.trim());
    partesNombre.push(fechaLimpia);

    const nombreArchivo = `${partesNombre.join("-")}.pdf`;

    // Preparar el HTML opcional para el cliente y vehículo dentro del PDF
    let htmlClienteAuto = "";
    if (nombreClienteTexto) {
      htmlClienteAuto += `<p style="margin: 4px 0; font-size: 0.9rem;"><strong>Cliente:</strong> ${nombreClienteTexto}</p>`;
    }
    if (nombreAutoTexto) {
      htmlClienteAuto += `<p style="margin: 4px 0; font-size: 0.9rem;"><strong>Vehículo:</strong> ${nombreAutoTexto}</p>`;
    }
    if (!nombreClienteTexto && !nombreAutoTexto) {
      htmlClienteAuto = `<p style="margin: 4px 0; font-size: 0.9rem; color: #64748b;">Consumidor Final / Vehículo Genérico</p>`;
    }

    // Elemento HTML temporal para renderizar el contenido del PDF
    const contenedorTemp = document.createElement("div");
    contenedorTemp.style.padding = "20px";
    contenedorTemp.style.fontFamily = "Helvetica, Arial, sans-serif";
    contenedorTemp.style.color = "#1e293b";

    contenedorTemp.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
        <div>
          <h1 style="font-size: 1.4rem; font-weight: bold; color: #2563eb; margin: 0;">LUBRICENTRO EL NÚMERO UNO</h1>
          <p style="font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0;">Servicios y Mantenimiento Vehicular Integral</p>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0; font-size: 1.2rem; color: #0f172a;">PRESUPUESTO</h2>
          <p style="margin: 4px 0 0 0; font-size: 0.85rem; color: #475569;"><strong>Fecha:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 20px;">
        ${htmlClienteAuto}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="background-color: #f1f5f9; color: #334155; text-align: left; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1;">Servicio</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: center; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 60px;">Cant.</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: right; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 110px;">Precio Unit.</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: right; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 110px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(serviciosPresupuesto)
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem;">${item.nombre}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; text-align: center;">${item.cantidad}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; text-align: right;">$${item.precioPresupuesto.toLocaleString()}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; text-align: right;">$${(item.precioPresupuesto * item.cantidad).toLocaleString()}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <div style="font-size: 1.1rem; font-weight: bold; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; color: #16a34a;">
          TOTAL: $${totalPresupuesto.toLocaleString()}
        </div>
      </div>
    `;

    const opciones = {
      margin: 10,
      filename: nombreArchivo,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opciones).from(contenedorTemp).save();
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Generar Presupuesto</h1>

      {/* DATOS CLIENTE Y VEHÍCULO */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 16px 0", color: "#334155" }}>
          1. Datos del Cliente y Vehículo
        </h3>
        <div style={styles.gridClientes}>
          <div>
            <label
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => handleCambioCliente(e.target.value)}
              style={styles.selectSmall}
            >
              <option value="">-- Seleccionar cliente (Opcional) --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
              <option value="OTRO">Otro (Escribir nombre)</option>
            </select>
            {clienteId === "OTRO" && (
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                style={{ ...styles.inputSmall, marginTop: "8px" }}
              />
            )}
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
              Vehículo
            </label>
            <select
              value={autoId}
              onChange={(e) => handleCambioAuto(e.target.value)}
              style={styles.selectSmall}
            >
              <option value="">-- Seleccionar auto (Opcional) --</option>
              {autosDisponibles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.marca_modelo} {a.patente ? `(${a.patente})` : ""}
                </option>
              ))}
              <option value="OTRO">Otro (Vehículo libre)</option>
            </select>
            {autoId === "OTRO" && (
              <input
                type="text"
                placeholder="Descripción del vehículo"
                value={vehiculoContacto}
                onChange={(e) => setVehiculoContacto(e.target.value)}
                style={{ ...styles.inputSmall, marginTop: "8px" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* TABLA DE SERVICIOS */}
      <div style={styles.card}>
        <h3 style={{ margin: "0 0 16px 0", color: "#334155" }}>
          2. Seleccionar y Personalizar Servicios
        </h3>

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

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "50px", textAlign: "center" }}>
                Sel.
              </th>
              <th style={styles.th} onClick={() => setOrdenAsc(!ordenAsc)}>
                Servicio {ordenAsc ? "▲" : "▼"}
              </th>
              <th style={{ ...styles.th, width: "240px" }}>
                Precio Presupuesto ($)
              </th>
              <th style={{ ...styles.th, width: "100px", textAlign: "center" }}>
                Cantidad
              </th>
            </tr>
          </thead>
          <tbody>
            {serviciosFiltrados.length > 0 ? (
              serviciosFiltrados.map((item) => {
                const seleccionado = !!serviciosPresupuesto[item.id];
                const enEdicion = editId === item.id;
                const datosSeleccion = serviciosPresupuesto[item.id];

                return (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: seleccionado ? "#f8fafc" : "transparent",
                    }}
                  >
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => toggleSeleccionServicio(item)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: "500", color: "#1e293b" }}>
                        {item.nombre}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {seleccionado ? (
                        enEdicion ? (
                          <div>
                            <input
                              type="number"
                              value={tempPrecioInput}
                              onChange={(e) =>
                                setTempPrecioInput(e.target.value)
                              }
                              style={styles.inputSmall}
                            />
                            <div style={styles.percentContainer}>
                              <button
                                type="button"
                                style={styles.btnPercent}
                                onClick={() => aplicarPorcentajeTemporal(5)}
                              >
                                +5%
                              </button>
                              <button
                                type="button"
                                style={styles.btnPercent}
                                onClick={() => aplicarPorcentajeTemporal(10)}
                              >
                                +10%
                              </button>
                              <button
                                type="button"
                                style={styles.btnPercent}
                                onClick={() => aplicarPorcentajeTemporal(15)}
                              >
                                +15%
                              </button>
                              <button
                                type="button"
                                style={styles.btnPercent}
                                onClick={() => aplicarPorcentajeTemporal(20)}
                              >
                                +20%
                              </button>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                marginTop: "6px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => guardarPrecioTemporal(item.id)}
                                style={{
                                  ...styles.btnPrimary,
                                  padding: "4px 8px",
                                  fontSize: "0.8rem",
                                }}
                              >
                                OK
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditId(null)}
                                style={{
                                  ...styles.btnSecondary,
                                  padding: "4px 8px",
                                  fontSize: "0.8rem",
                                }}
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{ fontWeight: "bold", color: "#0f172a" }}
                            >
                              $
                              {Number(
                                datosSeleccion.precioPresupuesto || 0,
                              ).toLocaleString()}
                            </span>
                            <button
                              type="button"
                              onClick={() => iniciarEdicionPrecio(item)}
                              style={styles.btnSecondary}
                            >
                              Modificar
                            </button>
                          </div>
                        )
                      ) : (
                        <span style={{ fontWeight: "bold", color: "#94a3b8" }}>
                          ${Number(item.precio || 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      {seleccionado ? (
                        <input
                          type="number"
                          min="1"
                          value={datosSeleccion.cantidad}
                          onChange={(e) =>
                            cambiarCantidad(item.id, e.target.value)
                          }
                          style={{
                            ...styles.inputSmall,
                            width: "70px",
                            textAlign: "center",
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

        <div style={styles.totalContainer}>
          <span>Total Presupuesto:</span>
          <span style={{ color: "#16a34a" }}>
            ${totalPresupuesto.toLocaleString()}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={descargarPDF}
            style={styles.btnPrimary}
            disabled={Object.keys(serviciosPresupuesto).length === 0}
          >
            📥 Descargar Presupuesto PDF
          </button>
        </div>
      </div>
    </div>
  );
}
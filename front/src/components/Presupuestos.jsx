import { useState, useEffect, useMemo } from "react";
import html2pdf from "html2pdf.js";
import logoEmpresa from "../logo.jpg";

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
    marginBottom: "16px",
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
  accordionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
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
const ENDPOINT_CLIENTE_AUTO = "http://localhost:3000/api/turnos/cliente-auto";
const ENDPOINT_SERVICIOS = "http://localhost:3000/api/servicios";
const ENDPOINT_MERCADERIA = "http://localhost:3000/api/mercaderia";

export default function Presupuesto() {
  const [clientes, setClientes] = useState([]);
  const [autos, setAutos] = useState([]);
  const [clienteAutoRelaciones, setClienteAutoRelaciones] = useState([]);
  const [serviciosOriginales, setServiciosOriginales] = useState([]);
  const [mercaderiaOriginales, setMercaderiaOriginales] = useState([]);

  // Estados de visibilidad (Desplegables)
  const [seccionServiciosAbierta, setSeccionServiciosAbierta] = useState(false);
  const [seccionMercaderiaAbierta, setSeccionMercaderiaAbierta] =
    useState(false);

  // Búsqueda y ordenamiento
  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [ordenAscServicio, setOrdenAscServicio] = useState(true);

  const [busquedaMercaderia, setBusquedaMercaderia] = useState("");
  const [ordenAscMercaderia, setOrdenAscMercaderia] = useState(true);

  // Selección de cliente y auto
  const [clienteId, setClienteId] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [autoId, setAutoId] = useState("");
  const [vehiculoContacto, setVehiculoContacto] = useState("");

  // Elementos seleccionados para el presupuesto (Servicios y Mercadería combinados o separados por prefijo/ID único)
  const [itemsPresupuesto, setItemsPresupuesto] = useState({});

  // Edición temporal de precio unitario
  const [editKey, setEditKey] = useState(null); // 'serv_1' o 'merc_2'
  const [tempPrecioInput, setTempPrecioInput] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resC, resA, resCA, resS, resM] = await Promise.all([
          fetch(ENDPOINT_CLIENTES),
          fetch(ENDPOINT_AUTOS),
          fetch(ENDPOINT_CLIENTE_AUTO),
          fetch(ENDPOINT_SERVICIOS),
          fetch(ENDPOINT_MERCADERIA),
        ]);

        if (resC.ok) setClientes(await resC.json());
        if (resA.ok) setAutos(await resA.json());
        if (resCA.ok) setClienteAutoRelaciones(await resCA.json());
        if (resS.ok) setServiciosOriginales(await resS.json());
        if (resM.ok) setMercaderiaOriginales(await resM.json());
      } catch (error) {
        console.error("Error al cargar datos para el presupuesto:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleCambioCliente = (e) => {
    const valor = e.target.value;
    setClienteId(valor);

    if (valor === "OTRO") {
      setClienteNombre("");
      setAutoId("OTRO");
      setVehiculoContacto("");
      return;
    }

    if (!valor) {
      setAutoId("");
      setVehiculoContacto("");
      return;
    }

    const rel = clienteAutoRelaciones.find(
      (item) => Number(item.cliente_id) === Number(valor),
    );
    if (rel) {
      setAutoId(rel.auto_id.toString());
      setVehiculoContacto("");
    } else {
      setAutoId("");
      setVehiculoContacto("");
    }
  };

  const handleCambioAuto = (e) => {
    const valor = e.target.value;
    setAutoId(valor);

    if (valor === "OTRO") {
      setVehiculoContacto("");
      return;
    }

    if (!valor) return;

    const rel = clienteAutoRelaciones.find(
      (item) => Number(item.auto_id) === Number(valor),
    );
    if (rel) {
      setClienteId(rel.cliente_id.toString());
      setClienteNombre("");
    }
  };

  const autosDisponibles = useMemo(() => {
    if (!clienteId || clienteId === "OTRO") return autos;
    const idsAutosDelCliente = clienteAutoRelaciones
      .filter((item) => Number(item.cliente_id) === Number(clienteId))
      .map((item) => Number(item.auto_id));

    return autos.filter((a) => idsAutosDelCliente.includes(Number(a.id)));
  }, [autos, clienteAutoRelaciones, clienteId]);

  // Selección de ítem (Servicio o Mercadería)
  const toggleSeleccionItem = (item, tipo) => {
    const key = `${tipo}_${item.id}`;
    setItemsPresupuesto((prev) => {
      const nuevo = { ...prev };
      if (nuevo[key]) {
        delete nuevo[key];
      } else {
        nuevo[key] = {
          ...item,
          tipo,
          keyUnica: key,
          precioPresupuesto: Number(item.precio),
          cantidad: 1,
          precioBaseOriginal: Number(item.precio),
        };
      }
      return nuevo;
    });
  };

  const cambiarCantidad = (key, cantidad) => {
    const cantNum = Math.max(1, Number(cantidad));
    setItemsPresupuesto((prev) => ({
      ...prev,
      [key]: { ...prev[key], cantidad: cantNum },
    }));
  };

  // Edición de precio temporal
  const iniciarEdicionPrecio = (key, item) => {
    const actual = itemsPresupuesto[key];
    setEditKey(key);
    setTempPrecioInput(actual ? actual.precioPresupuesto : item.precio);
  };

  const aplicarPorcentajeTemporal = (porcentaje) => {
    const itemSeleccionado = itemsPresupuesto[editKey];
    if (!itemSeleccionado) return;
    const base = itemSeleccionado.precioBaseOriginal;
    const aumento = base * (porcentaje / 100);
    const calculado = Math.round((base + aumento) * 100) / 100;
    setTempPrecioInput(calculado);
  };

  const guardarPrecioTemporal = (key) => {
    setItemsPresupuesto((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        precioPresupuesto: Number(tempPrecioInput) || 0,
      },
    }));
    setEditKey(null);
  };

  // Filtrado y ordenamiento de Servicios
  const serviciosFiltrados = useMemo(() => {
    return serviciosOriginales
      .filter((s) =>
        s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase().trim()),
      )
      .sort((a, b) => {
        const valA = a.nombre.toLowerCase();
        const valB = b.nombre.toLowerCase();
        if (valA < valB) return ordenAscServicio ? -1 : 1;
        if (valA > valB) return ordenAscServicio ? 1 : -1;
        return 0;
      });
  }, [serviciosOriginales, busquedaServicio, ordenAscServicio]);

  // Filtrado y ordenamiento de Mercadería
  const mercaderiaFiltrada = useMemo(() => {
    return mercaderiaOriginales
      .filter((m) =>
        m.nombre
          .toLowerCase()
          .includes(busquedaMercaderia.toLowerCase().trim()),
      )
      .sort((a, b) => {
        const valA = a.nombre.toLowerCase();
        const valB = b.nombre.toLowerCase();
        if (valA < valB) return ordenAscMercaderia ? -1 : 1;
        if (valA > valB) return ordenAscMercaderia ? 1 : -1;
        return 0;
      });
  }, [mercaderiaOriginales, busquedaMercaderia, ordenAscMercaderia]);

  const totalPresupuesto = useMemo(() => {
    return Object.values(itemsPresupuesto).reduce(
      (acc, curr) => acc + curr.precioPresupuesto * curr.cantidad,
      0,
    );
  }, [itemsPresupuesto]);

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

  const descargarPDF = () => {
    const fechaActual = new Date().toLocaleDateString("es-AR");
    const fechaLimpia = fechaActual.replace(/\//g, "-");

    let partesNombre = [];
    if (nombreClienteTexto.trim()) partesNombre.push(nombreClienteTexto.trim());
    if (nombreAutoTexto.trim()) partesNombre.push(nombreAutoTexto.trim());
    partesNombre.push(fechaLimpia);

    const nombreArchivo = `${partesNombre.join("-")}.pdf`;

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

    const contenedorTemp = document.createElement("div");
    contenedorTemp.style.padding = "20px";
    contenedorTemp.style.fontFamily = "Helvetica, Arial, sans-serif";
    contenedorTemp.style.color = "#1e293b";

    contenedorTemp.innerHTML = `
      <!-- ENCABEZADO EXPORTADO EN PDF CON TÍTULO CENTRADO Y CONTACTO MEJORADO -->
      <div style="display: flex; justify-content: space-between; align-items: center; background-color: #000000; padding: 10px 16px; border-radius: 6px; margin-bottom: 10px; color: #ffffff;">
        <div style="display: flex; flex-direction: column;">
          <img src="${logoEmpresa}" alt="Logo" style="max-height: 75px; display: block; object-fit: contain; margin-bottom: 6px;" />
          <div style="font-size: 0.8rem; color: #e2e8f0; line-height: 1.3;">
            <p style="margin: 0;">📍 <strong>Dirección:</strong> Berra 651</p>
            <p style="margin: 2px 0 0 0;">📱 <strong>Celular:</strong> 2494018544</p>
          </div>
        </div>
        <div style="text-align: center; flex-grow: 1; padding: 0 15px;">
          <h2 style="margin: 0; font-size: 1.4rem; letter-spacing: 1px; color: #ffffff; text-transform: uppercase;">PRESUPUESTO</h2>
        </div>
        <div style="text-align: right; min-width: 100px;">
          <p style="margin: 0; font-size: 0.85rem; color: #cbd5e1;"><strong>Fecha:</strong> ${fechaActual}</p>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 20px;">
        ${htmlClienteAuto}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="background-color: #f1f5f9; color: #334155; text-align: left; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1;">Ítem (Servicio / Producto)</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: center; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 60px;">Cant.</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: right; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 110px;">Precio Unit.</th>
            <th style="background-color: #f1f5f9; color: #334155; text-align: right; padding: 8px; font-size: 0.85rem; border-bottom: 2px solid #cbd5e1; width: 110px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${Object.values(itemsPresupuesto)
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem;">${item.nombre} <span style="font-size: 0.75rem; color: #64748b;">(${item.tipo === "servicio" ? "Servicio" : "Mercadería"})</span></td>
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

      <!-- PIE DE PÁGINA CON LEYENDA -->
      <div style="margin-top: 40px; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 12px;">
        <p style="font-size: 0.8rem; color: #64748b; margin: 0; font-style: italic;">Comprobante válido por 7 días</p>
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
      {/* 1. DATOS CLIENTE Y VEHÍCULO */}
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
              onChange={handleCambioCliente}
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
              onChange={handleCambioAuto}
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

      {/* 2. SELECCIONAR SERVICIOS (DESPLEGABLE) */}
      <div style={styles.card}>
        <div
          style={styles.accordionHeader}
          onClick={() => setSeccionServiciosAbierta(!seccionServiciosAbierta)}
        >
          <h3 style={{ margin: 0, color: "#334155" }}>
            2. Seleccionar Servicios {seccionServiciosAbierta ? "▲" : "▼"}
          </h3>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            {seccionServiciosAbierta ? "Ocultar" : "Mostrar lista"}
          </span>
        </div>

        {seccionServiciosAbierta && (
          <div style={{ marginTop: "16px" }}>
            <div style={styles.topBar}>
              <div style={{ width: "320px" }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar servicio..."
                  value={busquedaServicio}
                  onChange={(e) => setBusquedaServicio(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={styles.th}
                    onClick={() => setOrdenAscServicio(!ordenAscServicio)}
                  >
                    Servicio {ordenAscServicio ? "▲" : "▼"}
                  </th>
                  <th style={{ ...styles.th, width: "240px" }}>
                    Precio Presupuesto ($)
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviciosFiltrados.length > 0 ? (
                  serviciosFiltrados.map((item) => {
                    const key = `servicio_${item.id}`;
                    const seleccionado = !!itemsPresupuesto[key];
                    const enEdicion = editKey === key;
                    const datosSeleccion = itemsPresupuesto[key];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleSeleccionItem(item, "servicio")}
                        style={{
                          backgroundColor: seleccionado
                            ? "#eff6ff"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <td style={styles.td}>
                          <span style={{ fontWeight: "500", color: "#1e293b" }}>
                            {item.nombre}
                          </span>
                        </td>
                        <td
                          style={styles.td}
                          onClick={(e) => e.stopPropagation()}
                        >
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
                                  {[5, 10, 15, 20].map((porc) => (
                                    <button
                                      key={porc}
                                      type="button"
                                      style={styles.btnPercent}
                                      onClick={() =>
                                        aplicarPorcentajeTemporal(porc)
                                      }
                                    >
                                      +{porc}%
                                    </button>
                                  ))}
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
                                    onClick={() => guardarPrecioTemporal(key)}
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
                                    onClick={() => setEditKey(null)}
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
                                  style={{
                                    fontWeight: "bold",
                                    color: "#0f172a",
                                  }}
                                >
                                  $
                                  {Number(
                                    datosSeleccion.precioPresupuesto || 0,
                                  ).toLocaleString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    iniciarEdicionPrecio(key, item)
                                  }
                                  style={styles.btnSecondary}
                                >
                                  Modificar
                                </button>
                              </div>
                            )
                          ) : (
                            <span
                              style={{ fontWeight: "bold", color: "#94a3b8" }}
                            >
                              ${Number(item.precio || 0).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td
                          style={{ ...styles.td, textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {seleccionado ? (
                            <input
                              type="number"
                              min="1"
                              value={datosSeleccion.cantidad}
                              onChange={(e) =>
                                cambiarCantidad(key, e.target.value)
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
        )}
      </div>

      {/* 3. SELECCIONAR MERCADERÍA (DESPLEGABLE) */}
      <div style={styles.card}>
        <div
          style={styles.accordionHeader}
          onClick={() => setSeccionMercaderiaAbierta(!seccionMercaderiaAbierta)}
        >
          <h3 style={{ margin: 0, color: "#334155" }}>
            3. Seleccionar Mercadería {seccionMercaderiaAbierta ? "▲" : "▼"}
          </h3>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
            {seccionMercaderiaAbierta ? "Ocultar" : "Mostrar lista"}
          </span>
        </div>

        {seccionMercaderiaAbierta && (
          <div style={{ marginTop: "16px" }}>
            <div style={styles.topBar}>
              <div style={{ width: "320px" }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar mercadería..."
                  value={busquedaMercaderia}
                  onChange={(e) => setBusquedaMercaderia(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th
                    style={styles.th}
                    onClick={() => setOrdenAscMercaderia(!ordenAscMercaderia)}
                  >
                    Mercadería {ordenAscMercaderia ? "▲" : "▼"}
                  </th>
                  <th style={{ ...styles.th, width: "240px" }}>
                    Precio Presupuesto ($)
                  </th>
                  <th
                    style={{
                      ...styles.th,
                      width: "100px",
                      textAlign: "center",
                    }}
                  >
                    Cantidad
                  </th>
                </tr>
              </thead>
              <tbody>
                {mercaderiaFiltrada.length > 0 ? (
                  mercaderiaFiltrada.map((item) => {
                    const key = `mercaderia_${item.id}`;
                    const seleccionado = !!itemsPresupuesto[key];
                    const enEdicion = editKey === key;
                    const datosSeleccion = itemsPresupuesto[key];

                    return (
                      <tr
                        key={item.id}
                        onClick={() => toggleSeleccionItem(item, "mercaderia")}
                        style={{
                          backgroundColor: seleccionado
                            ? "#eff6ff"
                            : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <td style={styles.td}>
                          <span style={{ fontWeight: "500", color: "#1e293b" }}>
                            {item.nombre}
                          </span>
                        </td>
                        <td
                          style={styles.td}
                          onClick={(e) => e.stopPropagation()}
                        >
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
                                  {[5, 10, 15, 20].map((porc) => (
                                    <button
                                      key={porc}
                                      type="button"
                                      style={styles.btnPercent}
                                      onClick={() =>
                                        aplicarPorcentajeTemporal(porc)
                                      }
                                    >
                                      +{porc}%
                                    </button>
                                  ))}
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
                                    onClick={() => guardarPrecioTemporal(key)}
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
                                    onClick={() => setEditKey(null)}
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
                                  style={{
                                    fontWeight: "bold",
                                    color: "#0f172a",
                                  }}
                                >
                                  $
                                  {Number(
                                    datosSeleccion.precioPresupuesto || 0,
                                  ).toLocaleString()}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    iniciarEdicionPrecio(key, item)
                                  }
                                  style={styles.btnSecondary}
                                >
                                  Modificar
                                </button>
                              </div>
                            )
                          ) : (
                            <span
                              style={{ fontWeight: "bold", color: "#94a3b8" }}
                            >
                              ${Number(item.precio || 0).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td
                          style={{ ...styles.td, textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {seleccionado ? (
                            <input
                              type="number"
                              min="1"
                              value={datosSeleccion.cantidad}
                              onChange={(e) =>
                                cambiarCantidad(key, e.target.value)
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
                      colSpan="3"
                      style={{
                        ...styles.td,
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      No se encontró mercadería registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TOTAL Y ACCIÓN */}
      <div style={styles.card}>
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
            disabled={Object.keys(itemsPresupuesto).length === 0}
          >
            📥 Descargar Presupuesto PDF
          </button>
        </div>
      </div>
    </div>
  );
}

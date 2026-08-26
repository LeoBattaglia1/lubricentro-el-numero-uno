import db from "../config/db.js";
console.log(
  "🔥 EL ARCHIVO CLIENTESCONTROLLER.JS SE HA CARGADO CORRECTAMENTE 🔥",
);

// Obtener todos los pagos (incluyendo pendientes)
export const getPagos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pagos ORDER BY fecha DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener proveedores
export const getProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM provedores ORDER BY nombre ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pagos a proveedores
export const getPagosProveedor = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pagosprovedor ORDER BY fecha DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un pago (ej. cobrar un pago pendiente)
export const updatePago = async (req, res) => {
  const { id } = req.params;
  const { tipo_pago, fecha, montoTotal, montoExtra } = req.body;
  try {
    await db.query(
      "UPDATE pagos SET tipo_pago = ?, fecha = ?, montoTotal = ?, montoExtra = ? WHERE id = ?",
      [tipo_pago, fecha, montoTotal, montoExtra, id],
    );
    res.json({ message: "Pago actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar pago a proveedor
export const createPagoProveedor = async (req, res) => {
  const { provedor_id, monto, fecha } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO pagosprovedor (provedor_id, monto, fecha) VALUES (?, ?, ?)",
      [provedor_id, monto, fecha],
    );
    res.status(201).json({ id: result.insertId, provedor_id, monto, fecha });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeudaClienteDetalle = async (req, res) => {
  const { id } = req.params; // id del cliente

  console.log("\n==================================================");
  console.log(
    `🔍 [PASO 0] Iniciando getDeudaClienteDetalle para Cliente ID: ${id}`,
  );

  try {
    // 1. Buscar en la tabla pagos los registros pendientes del cliente
    const [pagosPendientes] = await db.query(
      "SELECT * FROM pagos WHERE cliente_id = ? AND (tipo_pago = 'pendiente' OR tipo_pago = 'Pendiente')",
      [id],
    );

    console.log(
      `📦 [PASO 1] Pagos pendientes encontrados en tabla 'pagos':`,
      pagosPendientes,
    );

    if (pagosPendientes.length === 0) {
      console.log(
        `⚠️ [PASO 1.1] No hay pagos pendientes para este cliente. Deuda = 0.`,
      );
      return res.json({ deudaTotal: 0, pagosPendientes: [] });
    }

    // Obtener los autos vinculados al cliente por si el historial usa auto_id
    const [autosCliente] = await db.query(
      "SELECT auto_id FROM cliente_auto WHERE cliente_id = ?",
      [id],
    );
    const autoIds = autosCliente.map((a) => a.auto_id);
    console.log(`🚗 [PASO 1.2] Autos vinculados al cliente (IDs):`, autoIds);

    let deudaTotal = 0;
    const pagosConDetalle = [];

    // Por cada registro encontrado en pagos, tomamos cliente_id y fecha
    for (const pago of pagosPendientes) {
      console.log(`\n--------------------------------------------------`);
      console.log(
        `💳 Procesando Pago ID: ${pago.id} | Monto Extra: ${pago.montoExtra || pago.monto_extra || 0}`,
      );

      let fechaPago = null;
      if (pago.fecha) {
        if (typeof pago.fecha === "string") {
          fechaPago = pago.fecha.split("T")[0];
        } else if (pago.fecha instanceof Date) {
          fechaPago = pago.fecha.toISOString().split("T")[0];
        }
      }
      console.log(
        `📅 Fecha extraída del pago para buscar en historial:`,
        fechaPago,
      );

      let serviciosHistorial = [];
      let mercaderiaHistorial = [];

      if (fechaPago) {
        // 2. Con cliente_id (y opcionalmente auto_id) y la fecha, vamos a historial_servicios
        const queryServicios =
          autoIds.length > 0
            ? `SELECT * FROM historial_servicios WHERE (cliente_id = ? OR auto_id IN (?)) AND DATE(fecha) = ?`
            : `SELECT * FROM historial_servicios WHERE cliente_id = ? AND DATE(fecha) = ?`;
        const paramsServicios =
          autoIds.length > 0 ? [id, autoIds, fechaPago] : [id, fechaPago];

        const [sRows] = await db.query(queryServicios, paramsServicios);
        serviciosHistorial = sRows;
        console.log(
          `🛠️ [PASO 2 - Servicios] Registros en historial_servicios:`,
          serviciosHistorial,
        );

        // 3. Con cliente_id (y opcionalmente auto_id) y la fecha, vamos a historial_mercaderia
        const queryMercaderia =
          autoIds.length > 0
            ? `SELECT * FROM historial_mercaderia WHERE (cliente_id = ? OR auto_id IN (?)) AND DATE(fecha) = ?`
            : `SELECT * FROM historial_mercaderia WHERE cliente_id = ? AND DATE(fecha) = ?`;
        const paramsMercaderia =
          autoIds.length > 0 ? [id, autoIds, fechaPago] : [id, fechaPago];

        const [mRows] = await db.query(queryMercaderia, paramsMercaderia);
        mercaderiaHistorial = mRows;
        console.log(
          `📦 [PASO 3 - Mercadería] Registros en historial_mercaderia:`,
          mercaderiaHistorial,
        );
      }

      let subtotalServiciosYItems = 0;
      const serviciosNombres = [];
      const mercaderiaDetalle = [];

      // 4. Obtener servicio_id y buscar el precio en la tabla 'servicios'
      for (const s of serviciosHistorial) {
        let nombre = s.nombre_servicio || `Servicio #${s.servicio_id}`;
        let precio = Number(s.precio || 0);

        if (s.servicio_id) {
          const [catServ] = await db.query(
            "SELECT * FROM servicios WHERE id = ?",
            [s.servicio_id],
          );
          console.log(
            `🏷️ [Catálogo Servicios] Buscando ID ${s.servicio_id}:`,
            catServ,
          );
          if (catServ.length > 0) {
            nombre = catServ[0].nombre;
            precio = Number(catServ[0].precio || precio);
          }
        }
        subtotalServiciosYItems += precio;
        serviciosNombres.push(`${nombre} - $${precio}`);
      }

      // 5. Obtener mercaderia_id y buscar el precio en la tabla 'mercaderia'
      for (const m of mercaderiaHistorial) {
        let nombre = m.nombre_producto || `Producto #${m.mercaderia_id}`;
        let precioUnitario = Number(m.precio || 0);
        const cantidad = Number(m.cantidad || 1);

        if (m.mercaderia_id) {
          const [catMerc] = await db.query(
            "SELECT * FROM mercaderia WHERE id = ?",
            [m.mercaderia_id],
          );
          console.log(
            `🏷️ [Catálogo Mercadería] Buscando ID ${m.mercaderia_id}:`,
            catMerc,
          );
          if (catMerc.length > 0) {
            nombre = catMerc[0].nombre;
            precioUnitario = Number(catMerc[0].precio || precioUnitario);
          }
        }
        const subtotal = precioUnitario * cantidad;
        subtotalServiciosYItems += subtotal;
        mercaderiaDetalle.push({
          nombre_producto: nombre,
          cantidad,
          precio: precioUnitario,
          subtotal,
        });
      }

      // 6. Sumar todos esos precios + el montoExtra de la tabla pagos
      const montoExtra = Number(pago.montoExtra || pago.monto_extra || 0);
      let precioTotalCalculado = subtotalServiciosYItems + montoExtra;

      // Respaldo por si el historial viniera vacío pero la tabla pagos tiene montoTotal
      if (subtotalServiciosYItems === 0 && Number(pago.montoTotal || 0) > 0) {
        precioTotalCalculado = Number(pago.montoTotal);
        console.log(
          `💡 [Respaldo] Usando montoTotal directo de pagos:`,
          precioTotalCalculado,
        );
      }

      console.log(
        `💵 Subtotal items: ${subtotalServiciosYItems} | Monto Extra: ${montoExtra} | Total Calculado este pago: ${precioTotalCalculado}`,
      );

      deudaTotal += precioTotalCalculado;

      pagosConDetalle.push({
        ...pago,
        serviciosNombres,
        mercaderiaDetalle,
        montoExtra,
        precioTotalCalculado,
      });
    }

    console.log(`\n💰 [TOTAL FINAL] Deuda total del cliente: $${deudaTotal}`);
    console.log(`==================================================\n`);

    res.json({
      deudaTotal,
      pagosPendientes: pagosConDetalle,
    });
  } catch (error) {
    console.error(`❌ [ERROR CRÍTICO EN getDeudaClienteDetalle]:`, error);
    res.status(500).json({ error: error.message });
  }
};

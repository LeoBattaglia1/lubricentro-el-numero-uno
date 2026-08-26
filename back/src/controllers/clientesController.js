import db from "../config/db.js";

export const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes ORDER BY nombre ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  const { nombre, telefono } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)",
      [nombre, telefono],
    );
    res.status(201).json({ id: result.insertId, nombre, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono } = req.body;
  try {
    await db.query(
      "UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?",
      [nombre, telefono, id],
    );
    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM clientes WHERE id = ?", [id]);
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vincular auto a cliente
export const asociarAutoACliente = async (req, res) => {
  const { cliente_id, auto_id } = req.body;
  try {
    await db.query(
      "INSERT INTO cliente_auto (cliente_id, auto_id) VALUES (?, ?)",
      [cliente_id, auto_id],
    );
    res.status(201).json({ message: "Auto vinculado al cliente con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVA FUNCIÓN: Obtener deudas, historial y catálogos de un cliente paso a paso
export const getDeudaClienteDetalle = async (req, res) => {
  const { id } = req.params; // id del cliente

  try {
    // PASO 1: Buscar registros en la tabla pagos con ese id_cliente y tipo_pago pendiente
    const [pagosPendientes] = await db.query(
      "SELECT * FROM pagos WHERE cliente_id = ? AND (tipo_pago = 'pendiente' OR tipo_pago = 'Pendiente')",
      [id],
    );

    if (pagosPendientes.length === 0) {
      return res.json({ deudaTotal: 0, pagosPendientes: [] });
    }

    // Obtener los autos vinculados al cliente por si el historial está asociado al auto_id
    const [autosCliente] = await db.query(
      "SELECT auto_id FROM cliente_auto WHERE cliente_id = ?",
      [id],
    );
    const autoIds = autosCliente.map((a) => a.auto_id);

    let deudaTotal = 0;
    const pagosConDetalle = [];

    for (const pago of pagosPendientes) {
      // Tomar la fecha del registro pendiente (formato YYYY-MM-DD)
      let fechaPago = null;
      if (pago.fecha) {
        if (typeof pago.fecha === "string") {
          fechaPago = pago.fecha.split("T")[0];
        } else if (pago.fecha instanceof Date) {
          fechaPago = pago.fecha.toISOString().split("T")[0];
        }
      }

      let serviciosHistorial = [];
      let mercaderiaHistorial = [];

      if (fechaPago) {
        // PASO 2: Ir a las tablas de historial con el cliente_id / auto_id y la fecha
        const [sRows] = await db.query(
          `SELECT * FROM historial_servicios WHERE (cliente_id = ? ${autoIds.length ? "OR auto_id IN (?)" : ""}) AND DATE(fecha) = ?`,
          autoIds.length ? [id, autoIds, fechaPago] : [id, fechaPago],
        );
        serviciosHistorial = sRows;

        const [mRows] = await db.query(
          `SELECT * FROM historial_mercaderia WHERE (cliente_id = ? ${autoIds.length ? "OR auto_id IN (?)" : ""}) AND DATE(fecha) = ?`,
          autoIds.length ? [id, autoIds, fechaPago] : [id, fechaPago],
        );
        mercaderiaHistorial = mRows;
      }

      // PASO 3: Con los IDs de servicios y mercadería, ir a sus tablas para obtener nombres y precios
      let subtotalServiciosYItems = 0;
      const serviciosNombres = [];
      const mercaderiaDetalle = [];

      for (const s of serviciosHistorial) {
        let nombre = s.nombre_servicio || `Servicio #${s.servicio_id}`;
        let precio = Number(s.precio || 0);

        if (s.servicio_id) {
          const [catServ] = await db.query(
            "SELECT * FROM servicios WHERE id = ?",
            [s.servicio_id],
          );
          if (catServ.length > 0) {
            nombre = catServ[0].nombre;
            precio = Number(catServ[0].precio || precio);
          }
        }
        subtotalServiciosYItems += precio;
        serviciosNombres.push(`${nombre} - $${precio}`);
      }

      for (const m of mercaderiaHistorial) {
        let nombre = m.nombre_producto || `Producto #${m.mercaderia_id}`;
        let precioUnitario = Number(m.precio || 0);
        const cantidad = Number(m.cantidad || 1);

        if (m.mercaderia_id) {
          const [catMerc] = await db.query(
            "SELECT * FROM mercaderia WHERE id = ?",
            [m.mercaderia_id],
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

      const montoExtra = Number(pago.montoExtra || pago.monto_extra || 0);
      const precioTotalCalculado = subtotalServiciosYItems + montoExtra;
      deudaTotal += precioTotalCalculado;

      pagosConDetalle.push({
        ...pago,
        serviciosNombres,
        mercaderiaDetalle,
        montoExtra,
        precioTotalCalculado,
      });
    }

    res.json({
      deudaTotal,
      pagosPendientes: pagosConDetalle,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

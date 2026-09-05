import db from "../config/db.js";

// PAGOS DE CLIENTES
export const getPagos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS cliente_nombre 
      FROM pagos p 
      JOIN clientes c ON p.cliente_id = c.id 
      ORDER BY p.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPago = async (req, res) => {
  const { cliente_id, historial_servicio_id, monto, tipo_pago } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO pagos (cliente_id, historial_servicio_id, monto, tipo_pago) VALUES (?, ?, ?, ?)",
      [cliente_id, historial_servicio_id, monto, tipo_pago],
    );
    res.status(201).json({ id: result.insertId, monto, tipo_pago });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR / COBRAR PAGO (Conectado con handleEjecutarCobro de Caja.jsx)
export const updatePago = async (req, res) => {
  const { id } = req.params;
  const { tipo_pago, fecha, montoTotal, montoExtra } = req.body;
  try {
    await db.query(
      `UPDATE pagos 
       SET tipo_pago = COALESCE(?, tipo_pago), 
           fecha = COALESCE(?, fecha), 
           montoTotal = COALESCE(?, montoTotal), 
           montoExtra = COALESCE(?, montoExtra)
       WHERE id = ?`,
      [tipo_pago, fecha, montoTotal, montoExtra, id],
    );
    res.json({ message: "Pago actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DETALLE DE DEUDA DE CLIENTE PARA CLIENTES.JSX
export const getDeudaClienteDetalle = async (req, res) => {
  const { id } = req.params;
  try {
    const [pagosPendientesRows] = await db.query(
      `SELECT * FROM pagos WHERE cliente_id = ? AND (tipo_pago = 'pendiente' OR estado = 'pendiente' OR estado IS NULL) ORDER BY fecha DESC`,
      [id],
    );

    let deudaTotal = 0;
    const pagosPendientes = [];

    for (const pago of pagosPendientesRows) {
      const fechaPago = pago.fecha;

      const [serviciosRows] = await db.query(
        `SELECT hs.*, s.nombre AS nombre_servicio, s.precio AS precio_catalogo 
         FROM historial_servicios hs 
         LEFT JOIN servicios s ON hs.servicio_id = s.id 
         WHERE hs.cliente_id = ? AND DATE(hs.fecha) = DATE(?)`,
        [id, fechaPago],
      );

      const serviciosNombres = serviciosRows.map(
        (s) => s.nombre_servicio || s.nombre || `Servicio #${s.servicio_id}`,
      );

      const [mercaderiaRows] = await db.query(
        `SELECT hm.*, m.nombre AS nombre_producto, m.precio AS precio_catalogo 
         FROM historial_mercaderia hm 
         LEFT JOIN mercaderia m ON hm.mercaderia_id = m.id 
         WHERE hm.cliente_id = ? AND DATE(hm.fecha) = DATE(?)`,
        [id, fechaPago],
      );

      const mercaderiaDetalle = mercaderiaRows.map((m) => {
        const cantidad = Number(m.cantidad || 1);
        const subtotal =
          Number(m.subtotal || m.precio_catalogo || m.precio || 0) * cantidad;
        return {
          nombre_producto: m.nombre_producto || `Producto #${m.mercaderia_id}`,
          cantidad,
          subtotal,
        };
      });

      const montoExtra = Number(pago.montoExtra || pago.monto_extra || 0);
      const montoBase = Number(pago.montoTotal || pago.monto || 0);

      let precioTotalCalculado = montoBase;
      if (precioTotalCalculado === 0) {
        const subServicios = serviciosRows.reduce(
          (acc, s) => acc + Number(s.precio_catalogo || s.precio || 0),
          0,
        );
        const subMercaderia = mercaderiaDetalle.reduce(
          (acc, item) => acc + item.subtotal,
          0,
        );
        precioTotalCalculado = subServicios + subMercaderia + montoExtra;
      } else {
        precioTotalCalculado += montoExtra;
      }

      deudaTotal += precioTotalCalculado;

      pagosPendientes.push({
        id: pago.id,
        fecha: fechaPago,
        precioTotalCalculado,
        montoExtra,
        serviciosNombres,
        mercaderiaDetalle,
      });
    }

    res.json({
      deudaTotal,
      pagosPendientes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PAGOS A PROVEEDORES
export const getPagosProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pp.*, pr.nombre AS provedor_nombre 
      FROM pagosprovedores pp 
      JOIN provedores pr ON pp.provedor_id = pr.id 
      ORDER BY pp.fecha DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPagoProveedor = async (req, res) => {
  const { provedor_id, monto } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO pagosprovedores (provedor_id, monto) VALUES (?, ?)",
      [provedor_id, monto],
    );
    res.status(201).json({ id: result.insertId, provedor_id, monto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CAJA Y VENTAS DIARIAS
export const getVentas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ventas ORDER BY fecha DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarVentaDiaria = async (req, res) => {
  const { fecha, monto_efectivo, monto_cuenta_bancaria } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO ventas (fecha, monto_efectivo, monto_cuenta_bancaria) VALUES (?, ?, ?)",
      [
        fecha || new Date().toISOString().slice(0, 10),
        monto_efectivo || 0,
        monto_cuenta_bancaria || 0,
      ],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Caja del día guardada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

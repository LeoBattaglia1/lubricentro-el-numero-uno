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

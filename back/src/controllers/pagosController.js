import db from "../config/db.js";

// Obtener todos los pagos (ideal para la caja general)
export const getPagos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pagos ORDER BY fecha DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pagos de un cliente específico
export const getPagosByCliente = async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const [pagos] = await db.query(
      `SELECT * FROM pagos WHERE cliente_id = ? ORDER BY fecha DESC`,
      [cliente_id],
    );
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar un nuevo pago (soporta pendientes y pagos directos)
export const createPago = async (req, res) => {
  const { cliente_id, montoExtra, montoTotal, tipo_pago, fecha } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO pagos (cliente_id, montoExtra, montoTotal, tipo_pago, fecha) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        cliente_id || null,
        montoExtra !== undefined ? Number(montoExtra) : 0,
        montoTotal !== undefined ? Number(montoTotal) : 0,
        tipo_pago || "efectivo",
        fecha || new Date(),
      ],
    );

    res.status(201).json({
      id: result.insertId,
      message: "Registro de pago guardado con éxito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un registro de pago
export const deletePago = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM pagos WHERE id = ?", [id]);
    res.json({ message: "Pago eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

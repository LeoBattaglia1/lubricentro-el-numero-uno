import db from "../config/db.js";

// Obtener todos los pagos
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
    const [rows] = await db.query(
      "SELECT * FROM pagos WHERE cliente_id = ? ORDER BY fecha DESC",
      [cliente_id],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar un nuevo pago / deuda
export const createPago = async (req, res) => {
  const { cliente_id, monto, fecha, metodo_pago, nota } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO pagos (cliente_id, monto, fecha, metodo_pago, nota) VALUES (?, ?, ?, ?, ?)",
      [cliente_id, monto, fecha, metodo_pago, nota],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Pago registrado con éxito" });
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

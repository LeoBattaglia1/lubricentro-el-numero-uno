import db from "../config/db.js";

// Obtener todos los pagos a proveedores
export const getPagosProvedor = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pagosprovedor ORDER BY fecha DESC, id DESC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo pago a proveedor
export const createPagoProvedor = async (req, res) => {
  const { provedor_id, monto, fecha } = req.body;

  if (!provedor_id || !monto) {
    return res
      .status(400)
      .json({ error: "provedor_id y monto son requeridos" });
  }

  try {
    const fechaPago = fecha || new Date().toISOString().split("T")[0];

    const [result] = await db.query(
      "INSERT INTO pagosprovedor (provedor_id, monto, fecha) VALUES (?, ?, ?)",
      [provedor_id, monto, fechaPago],
    );

    res.status(201).json({
      id: result.insertId,
      provedor_id,
      monto,
      fecha: fechaPago,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un pago
export const deletePagoProvedor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM pagosprovedor WHERE id = ?", [id]);
    res.json({ message: "Pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

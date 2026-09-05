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
  const { provedor_id, numeroFactura, monto, totalFactura, fecha } = req.body;

  if (!provedor_id || !numeroFactura || !monto || !totalFactura) {
    return res.status(400).json({
      error: "provedor_id, numeroFactura, monto y totalFactura son requeridos",
    });
  }

  try {
    // Generar fecha y hora actual exacta (YYYY-MM-DD HH:MM:SS)
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");

    const fechaHoraActual =
      fecha || `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    const [result] = await db.query(
      "INSERT INTO pagosprovedor (provedor_id, numeroFactura, monto, totalFactura, fecha) VALUES (?, ?, ?, ?, ?)",
      [provedor_id, numeroFactura, monto, totalFactura, fechaHoraActual],
    );

    res.status(201).json({
      id: result.insertId,
      provedor_id,
      numeroFactura,
      monto,
      totalFactura,
      fecha: fechaHoraActual,
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

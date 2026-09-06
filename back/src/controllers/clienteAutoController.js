import db from "../config/db.js";

// Obtener todas las relaciones cliente - auto
export const getClienteAuto = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente_auto");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener cliente_auto:", error);
    res.status(500).json({ mensaje: "Error al obtener la tabla intermedia" });
  }
};

// Asignar un auto a un cliente
export const crearClienteAuto = async (req, res) => {
  const { cliente_id, auto_id } = req.body;

  try {
    await db.query(
      "INSERT INTO cliente_auto (cliente_id, auto_id) VALUES (?, ?)",
      [cliente_id, auto_id],
    );
    res
      .status(201)
      .json({ mensaje: "Relación cliente-auto guardada correctamente" });
  } catch (error) {
    console.error("Error al asociar cliente con auto:", error);
    res.status(500).json({ mensaje: "Error al guardar la relación" });
  }
};

// Eliminar (desvincular) una relación cliente-auto validando pagos pendientes con tipo_pago
export const eliminarClienteAuto = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener la relación para identificar al cliente asociado
    const [relacionRows] = await db.query(
      "SELECT * FROM cliente_auto WHERE id = ?",
      [id],
    );

    if (relacionRows.length === 0) {
      return res.status(404).json({ mensaje: "Relación no encontrada" });
    }

    const { cliente_id } = relacionRows[0];

    // 2. Verificar si el cliente tiene pagos pendientes usando tipo_pago
    const [pagosPendientes] = await db.query(
      "SELECT * FROM pagos WHERE cliente_id = ? AND (tipo_pago = 'pendiente' OR tipo_pago = 'Pendiente' OR tipo_pago IS NULL OR tipo_pago = '')",
      [cliente_id],
    );

    if (pagosPendientes.length > 0) {
      return res.status(400).json({
        mensaje:
          "No se puede desvincular el vehículo porque el cliente registra pagos pendientes.",
      });
    }

    // 3. Proceder con la desvinculación si no existen deudas
    await db.query("DELETE FROM cliente_auto WHERE id = ?", [id]);

    res.json({ mensaje: "Vehículo desvinculado correctamente del cliente" });
  } catch (error) {
    console.error("Error al desvincular cliente-auto:", error);
    res
      .status(500)
      .json({ mensaje: "Error al intentar desvincular el vehículo" });
  }
};

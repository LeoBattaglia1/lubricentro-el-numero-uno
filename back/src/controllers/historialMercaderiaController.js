import pool from "../config/db.js";

// Obtener historial de mercadería por auto
export const getHistorialMercaderiaByAuto = async (req, res) => {
  const { auto_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT hm.*, m.nombre as mercaderia_nombre 
       FROM historial_mercaderia hm
       LEFT JOIN mercaderia m ON hm.mercaderia_id = m.id
       WHERE hm.auto_id = ? ORDER BY hm.fecha DESC`,
      [auto_id],
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de mercadería por auto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener historial de mercadería por cliente
export const getHistorialMercaderiaByCliente = async (req, res) => {
  const { cliente_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT hm.*, m.nombre as mercaderia_nombre 
       FROM historial_mercaderia hm
       LEFT JOIN mercaderia m ON hm.mercaderia_id = m.id
       WHERE hm.cliente_id = ? ORDER BY hm.fecha DESC`,
      [cliente_id],
    );
    res.json(rows);
  } catch (error) {
    console.error(
      "Error al obtener historial de mercadería por cliente:",
      error,
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Registrar movimiento de mercadería de forma individual (Ruta tradicional POST /api/mercaderia)
export const registrarMovimientoMercaderia = async (req, res) => {
  const { auto_id, cliente_id, mercaderia_id, cantidad, fecha } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO historial_mercaderia (auto_id, cliente_id, mercaderia_id, cantidad, fecha) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        auto_id || null,
        cliente_id || null,
        mercaderia_id,
        cantidad || 1,
        fecha || new Date(),
      ],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Mercadería registrada correctamente",
    });
  } catch (error) {
    console.error("Error al registrar movimiento de mercadería:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para insertar dentro de una transacción global
export const registrarMercaderiaTransaccion = async (
  connection,
  autoId,
  mercaderiaId,
  cantidad,
  clienteId = null,
) => {
  if (!autoId && !clienteId) {
    throw new Error(
      "Se requiere al menos un auto_id o un cliente_id para registrar la mercadería.",
    );
  }
  if (!mercaderiaId) {
    throw new Error(
      "Falta el dato obligatorio (mercaderia_id) para registrar la mercadería.",
    );
  }

  const [result] = await connection.query(
    `INSERT INTO historial_mercaderia (auto_id, cliente_id, mercaderia_id, cantidad, fecha) 
     VALUES (?, ?, ?, ?, NOW())`,
    [autoId || null, clienteId || null, mercaderiaId, cantidad || 1],
  );
  return result.insertId;
};

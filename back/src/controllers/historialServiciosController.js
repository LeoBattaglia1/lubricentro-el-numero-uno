import pool from "../config/db.js";

// Obtener historial de servicios por auto
export const getHistorialByAuto = async (req, res) => {
  const { auto_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT hs.*, s.nombre as servicio_nombre 
       FROM historial_servicios hs
       LEFT JOIN servicios s ON hs.servicio_id = s.id
       WHERE hs.auto_id = ? ORDER BY hs.fecha DESC`,
      [auto_id],
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de servicios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Registrar un servicio de forma individual (Ruta tradicional)
export const registrarServicio = async (req, res) => {
  const {
    auto_id,
    servicio_id,
    kilometros_actuales,
    kilometros_proximo_cambio,
    fecha,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO historial_servicios (auto_id, servicio_id, kilometros_actuales, kilometros_proximo_cambio, fecha) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        auto_id,
        servicio_id,
        kilometros_actuales || null,
        kilometros_proximo_cambio || null,
        fecha || new Date(),
      ],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Servicio registrado correctamente",
    });
  } catch (error) {
    console.error("Error al registrar servicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * FUNCIÓN PURA PARA LA TRANSACCIÓN:
 * Se encarga EXCLUSIVAMENTE de insertar en la tabla historial_servicios.
 * Recibe la conexión activa, el auto ya resuelto, y los datos del servicio.
 */
export const registrarServicioTransaccion = async (
  connection,
  auto_id,
  servicio_id,
  kilometros_actuales = null,
  kilometros_proximo_cambio = null,
) => {
  if (!auto_id || !servicio_id) {
    throw new Error(
      "Faltan datos obligatorios (auto_id o servicio_id) para el historial de servicios.",
    );
  }

  const [result] = await connection.query(
    `INSERT INTO historial_servicios (auto_id, servicio_id, kilometros_actuales, kilometros_proximo_cambio, fecha) 
     VALUES (?, ?, ?, ?, NOW())`,
    [
      auto_id,
      servicio_id,
      kilometros_actuales !== undefined ? kilometros_actuales : null,
      kilometros_proximo_cambio !== undefined
        ? kilometros_proximo_cambio
        : null,
    ],
  );

  return result.insertId;
};

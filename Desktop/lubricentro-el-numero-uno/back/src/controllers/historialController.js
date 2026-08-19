import db from "../config/db.js";

export const getHistorialByAuto = async (req, res) => {
  const { auto_id } = req.params;
  try {
    const [rows] = await db.query(
      `
      SELECT hs.*, s.nombre AS servicio_nombre, s.precio 
      FROM historial_servicios hs 
      JOIN servicios s ON hs.servicio_id = s.id 
      WHERE hs.auto_id = ? 
      ORDER BY hs.fecha DESC
    `,
      [auto_id],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registrarServicioAAuto = async (req, res) => {
  const {
    auto_id,
    servicio_id,
    kilometros_actuales,
    kilometros_proximo_cambio,
    mercaderias,
  } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [hsResult] = await connection.query(
      "INSERT INTO historial_servicios (auto_id, servicio_id, kilometros_actuales, kilometros_proximo_cambio) VALUES (?, ?, ?, ?)",
      [auto_id, servicio_id, kilometros_actuales, kilometros_proximo_cambio],
    );

    const historial_servicio_id = hsResult.insertId;

    if (mercaderias && mercaderias.length > 0) {
      for (const item of mercaderias) {
        await connection.query(
          "INSERT INTO historial_mercaderia (historial_servicio_id, mercaderia_id, cantidad) VALUES (?, ?, ?)",
          [historial_servicio_id, item.mercaderia_id, item.cantidad || 1],
        );
      }
    }

    await connection.commit();
    res.status(201).json({
      id: historial_servicio_id,
      message: "Servicio registrado correctamente",
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

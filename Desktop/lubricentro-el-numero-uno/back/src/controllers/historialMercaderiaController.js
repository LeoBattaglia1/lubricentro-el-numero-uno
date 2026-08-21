import db from "../config/db.js";

export const getHistorialMercaderia = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT hm.id, hm.historial_servicio_id, hm.mercaderia_id, hm.cantidad, m.nombre AS producto
       FROM historial_mercaderia hm
       LEFT JOIN mercaderia m ON hm.mercaderia_id = m.id`,
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener historial de mercadería:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener historial de mercadería" });
  }
};

export const registrarMovimientoMercaderia = async (req, res) => {
  const { historial_servicio_id, mercaderia_id, cantidad } = req.body;

  try {
    await db.query(
      `INSERT INTO historial_mercaderia (historial_servicio_id, mercaderia_id, cantidad) 
       VALUES (?, ?, ?)`,
      [historial_servicio_id, mercaderia_id, cantidad],
    );

    res
      .status(201)
      .json({ mensaje: "Movimiento de mercadería registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar mercadería en servicio:", error);
    res.status(500).json({ mensaje: "Error al registrar mercadería" });
  }
};

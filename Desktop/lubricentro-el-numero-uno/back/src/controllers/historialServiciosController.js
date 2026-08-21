import db from "../config/db.js";

// 1. Obtener historial de servicios e insumos por auto
export const getHistorialByAuto = async (req, res) => {
  const { auto_id } = req.params;

  try {
    // Usamos DATE_FORMAT para dar formato dd/mm/aaaa a la fecha desde MySQL
    const [servicios] = await db.query(
      `SELECT 
        hs.id, 
        hs.auto_id, 
        DATE_FORMAT(hs.fecha, '%d/%m/%Y') AS fecha, 
        hs.kilometros_actuales, 
        hs.kilometros_proximo_cambio,
        COALESCE(s.nombre, 'Servicio General') AS servicio
       FROM historial_servicios hs
       LEFT JOIN servicios s ON hs.servicio_id = s.id
       WHERE hs.auto_id = ?
       ORDER BY hs.fecha DESC`,
      [auto_id],
    );

    if (servicios.length === 0) {
      return res.json([]);
    }

    // Consulta a historial_mercaderia con JOIN a mercaderia
    const historialCompleto = await Promise.all(
      servicios.map(async (servicio) => {
        const [items] = await db.query(
          `SELECT 
            hm.cantidad, 
            m.nombre AS nombre_producto,
            m.precio
           FROM historial_mercaderia hm
           INNER JOIN mercaderia m ON hm.mercaderia_id = m.id
           WHERE hm.historial_servicio_id = ?`,
          [servicio.id],
        );

        return {
          ...servicio,
          mercaderia: items,
        };
      }),
    );

    res.json(historialCompleto);
  } catch (error) {
    console.error("Error al obtener historial del auto:", error);
    res
      .status(500)
      .json({ mensaje: "Error al consultar el historial del vehículo" });
  }
};

// 2. Registrar un nuevo servicio
export const registrarServicio = async (req, res) => {
  const {
    auto_id,
    servicio_id,
    fecha,
    kilometros_actuales,
    kilometros_proximo_cambio,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO historial_servicios 
        (auto_id, servicio_id, fecha, kilometros_actuales, kilometros_proximo_cambio) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        auto_id,
        servicio_id,
        fecha || new Date(),
        kilometros_actuales || 0,
        kilometros_proximo_cambio || 0,
      ],
    );

    res.status(201).json({
      mensaje: "Servicio registrado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error al registrar el servicio:", error);
    res.status(500).json({ mensaje: "Error al registrar el servicio" });
  }
};

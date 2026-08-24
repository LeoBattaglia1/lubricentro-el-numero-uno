import db from "../config/db.js";

export const getEscasesStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.id AS escasez_id,
        e.mercaderia_id,
        DATE_FORMAT(e.fecha_listado, '%d/%m/%Y') AS fecha_listado,
        e.observacion,
        m.nombre AS producto, 
        m.precio 
      FROM escasesdestock e 
      INNER JOIN mercaderia m ON e.mercaderia_id = m.id 
      ORDER BY e.fecha_listado DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener escasez:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createEscasesStock = async (req, res) => {
  const { mercaderia_id, observacion } = req.body;

  if (!mercaderia_id) {
    return res
      .status(400)
      .json({ error: "El campo mercaderia_id es obligatorio." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO escasesdestock (mercaderia_id, observacion, fecha_listado) VALUES (?, ?, NOW())",
      [mercaderia_id, observacion || ""],
    );

    res.status(201).json({
      id: result.insertId,
      mercaderia_id,
      message: "Ítem agregado correctamente a la lista de escasez",
    });
  } catch (error) {
    console.error("Error al insertar escasez:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateObservacionEscasesStock = async (req, res) => {
  const { id } = req.params;
  const { observacion } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE escasesdestock SET observacion = ? WHERE id = ?",
      [observacion || "", id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el registro para actualizar." });
    }

    res.json({ message: "Observación actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar observación:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEscasesStock = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM escasesdestock WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el registro a eliminar." });
    }

    res.json({ message: "Ítem quitado de la lista de escasez" });
  } catch (error) {
    console.error("Error al eliminar escasez:", error);
    res.status(500).json({ error: error.message });
  }
};

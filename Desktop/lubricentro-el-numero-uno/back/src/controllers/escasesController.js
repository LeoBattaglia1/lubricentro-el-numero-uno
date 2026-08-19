import db from "../config/db.js";

export const getEscasesStock = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, m.nombre AS producto, m.precio 
      FROM escasesdestock e 
      JOIN mercaderia m ON e.mercaderia_id = m.id 
      ORDER BY e.fecha_listado DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEscasesStock = async (req, res) => {
  const { mercaderia_id, observacion } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO escasesdestock (mercaderia_id, observacion) VALUES (?, ?)",
      [mercaderia_id, observacion || null],
    );
    res.status(201).json({ id: result.insertId, mercaderia_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEscasesStock = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM escasesdestock WHERE id = ?", [id]);
    res.json({ message: "Ítem quitado de la lista de escasez" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

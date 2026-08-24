import db from "../config/db.js";

export const getAutos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, c.id AS cliente_id, c.nombre AS cliente_nombre 
      FROM autos a 
      LEFT JOIN cliente_auto ca ON a.id = ca.auto_id 
      LEFT JOIN clientes c ON ca.cliente_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAuto = async (req, res) => {
  const { marca_modelo, patente } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO autos (marca_modelo, patente) VALUES (?, ?)",
      [marca_modelo, patente],
    );
    res.status(201).json({ id: result.insertId, marca_modelo, patente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAuto = async (req, res) => {
  const { id } = req.params;
  const { marca_modelo, patente } = req.body;
  try {
    await db.query(
      "UPDATE autos SET marca_modelo = ?, patente = ? WHERE id = ?",
      [marca_modelo, patente, id],
    );
    res.json({ message: "Vehículo actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAuto = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM autos WHERE id = ?", [id]);
    res.json({ message: "Vehículo eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

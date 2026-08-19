import db from "../config/db.js";

export const getServicios = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM servicios ORDER BY nombre ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createServicio = async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO servicios (nombre, precio) VALUES (?, ?)",
      [nombre, precio],
    );
    res.status(201).json({ id: result.insertId, nombre, precio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;
  try {
    await db.query("UPDATE servicios SET nombre = ?, precio = ? WHERE id = ?", [
      nombre,
      precio,
      id,
    ]);
    res.json({ message: "Servicio actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteServicio = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM servicios WHERE id = ?", [id]);
    res.json({ message: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

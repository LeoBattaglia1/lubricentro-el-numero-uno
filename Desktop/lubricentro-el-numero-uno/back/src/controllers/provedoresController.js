import db from "../config/db.js";

// Obtener todos los proveedores
export const getProvedores = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM provedores ORDER BY nombre ASC",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un proveedor
export const createProvedor = async (req, res) => {
  const { nombre, telefono } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO provedores (nombre, telefono) VALUES (?, ?)",
      [nombre, telefono],
    );
    res.status(201).json({ id: result.insertId, nombre, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un proveedor
export const updateProvedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono } = req.body;
  try {
    await db.query(
      "UPDATE provedores SET nombre = ?, telefono = ? WHERE id = ?",
      [nombre, telefono, id],
    );
    res.json({ message: "Proveedor actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un proveedor
export const deleteProvedor = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM provedores WHERE id = ?", [id]);
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import db from "../config/db.js";

// Obtener toda la mercadería con el nombre del proveedor
export const getMercaderia = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, p.nombre AS provedor_nombre 
      FROM mercaderia m 
      LEFT JOIN provedores p ON m.provedor_id = p.id 
      ORDER BY m.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo producto
export const createMercaderia = async (req, res) => {
  const { nombre, precio, provedor_id } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO mercaderia (nombre, precio, provedor_id) VALUES (?, ?, ?)",
      [nombre, precio, provedor_id || null],
    );
    res.status(201).json({ id: result.insertId, nombre, precio, provedor_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un producto
export const updateMercaderia = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, provedor_id } = req.body;
  try {
    await db.query(
      "UPDATE mercaderia SET nombre = ?, precio = ?, provedor_id = ? WHERE id = ?",
      [nombre, precio, provedor_id || null, id],
    );
    res.json({ message: "Mercadería actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un producto
export const deleteMercaderia = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM mercaderia WHERE id = ?", [id]);
    res.json({ message: "Mercadería eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import db from "../config/db.js";

export const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes ORDER BY nombre ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  const { nombre, telefono } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)",
      [nombre, telefono],
    );
    res.status(201).json({ id: result.insertId, nombre, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono } = req.body;
  try {
    await db.query(
      "UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?",
      [nombre, telefono, id],
    );
    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM clientes WHERE id = ?", [id]);
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vincular auto a cliente
export const asociarAutoACliente = async (req, res) => {
  const { cliente_id, auto_id } = req.body;
  try {
    await db.query(
      "INSERT INTO cliente_auto (cliente_id, auto_id) VALUES (?, ?)",
      [cliente_id, auto_id],
    );
    res.status(201).json({ message: "Auto vinculado al cliente con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import db from "../config/db.js";

export const getTurnos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.nombre AS cliente_registrado, a.patente 
      FROM turnos t 
      LEFT JOIN clientes c ON t.cliente_id = c.id 
      LEFT JOIN autos a ON t.auto_id = a.id 
      ORDER BY t.fecha_hora ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTurno = async (req, res) => {
  const {
    fecha_hora,
    cliente_id,
    auto_id,
    cliente_nombre,
    vehiculo_contacto,
    observaciones,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO turnos (fecha_hora, cliente_id, auto_id, cliente_nombre, vehiculo_contacto, observaciones) VALUES (?, ?, ?, ?, ?, ?)",
      [
        fecha_hora,
        cliente_id || null,
        auto_id || null,
        cliente_nombre || null,
        vehiculo_contacto || null,
        observaciones || null,
      ],
    );
    res.status(201).json({ id: result.insertId, fecha_hora });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTurno = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM turnos WHERE id = ?", [id]);
    res.json({ message: "Turno cancelado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

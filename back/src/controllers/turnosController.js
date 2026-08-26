import db from "../config/db.js";

export const obtenerTurnos = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.*,
        c.nombre AS cliente_nombre_db,
        a.marca_modelo AS auto_marca_modelo_db,
        a.patente AS auto_patente_db
      FROM turnos t
      LEFT JOIN clientes c ON t.cliente_id = c.id
      LEFT JOIN autos a ON t.auto_id = a.id
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVO: Endpoint para proveer la relación entre clientes y autos al frontend
export const obtenerClienteAuto = async (req, res) => {
  try {
    const query = `SELECT cliente_id, auto_id FROM cliente_auto`;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearTurno = async (req, res) => {
  try {
    const {
      fecha_hora,
      cliente_id,
      auto_id,
      cliente_nombre,
      vehiculo_contacto,
      observaciones,
    } = req.body;

    if (fecha_hora) {
      const hoyStr = new Date().toISOString().split("T")[0];
      const fechaTurnoStr = fecha_hora.split("T")[0];
      if (fechaTurnoStr < hoyStr) {
        return res.status(400).json({
          error:
            "No se puede cargar un turno con una fecha anterior a la de hoy.",
        });
      }
    }

    const query = `
      INSERT INTO turnos (fecha_hora, cliente_id, auto_id, cliente_nombre, vehiculo_contacto, observaciones) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [resultado] = await db.query(query, [
      fecha_hora || null,
      cliente_id || null,
      auto_id || null,
      cliente_nombre || null,
      vehiculo_contacto || null,
      observaciones || null,
    ]);

    res
      .status(201)
      .json({ id: resultado.insertId, message: "Turno creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_hora,
      cliente_id,
      auto_id,
      cliente_nombre,
      vehiculo_contacto,
      observaciones,
    } = req.body;

    if (fecha_hora) {
      const hoyStr = new Date().toISOString().split("T")[0];
      const fechaTurnoStr = fecha_hora.split("T")[0];
      if (fechaTurnoStr < hoyStr) {
        return res.status(400).json({
          error:
            "No se puede actualizar un turno con una fecha anterior a la de hoy.",
        });
      }
    }

    const query = `
      UPDATE turnos 
      SET fecha_hora = ?, cliente_id = ?, auto_id = ?, cliente_nombre = ?, vehiculo_contacto = ?, observaciones = ? 
      WHERE id = ?
    `;
    await db.query(query, [
      fecha_hora || null,
      cliente_id || null,
      auto_id || null,
      cliente_nombre || null,
      vehiculo_contacto || null,
      observaciones || null,
      id,
    ]);

    res.json({ message: "Turno actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM turnos WHERE id = ?", [id]);
    res.json({ message: "Turno eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

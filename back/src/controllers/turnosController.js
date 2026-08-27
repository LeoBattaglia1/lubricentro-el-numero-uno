import db from "../config/db.js";

// 1. Obtener todos los turnos
export const obtenerTurnos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM turnos");
    console.log("📥 [obtenerTurnos] Datos leídos de la BD:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error en obtenerTurnos:", error);
    res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

// 2. Obtener las relaciones entre clientes y autos (Tabla intermedia)
export const obtenerClienteAuto = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente_auto");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error en obtenerClienteAuto:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las relaciones de cliente y auto" });
  }
};

// 3. Crear un turno
export const crearTurno = async (req, res) => {
  try {
    console.log("📥 [crearTurno] req.body recibido:", req.body);
    let {
      fecha_hora,
      cliente_id,
      auto_id,
      cliente_nombre,
      vehiculo_contacto,
      observaciones,
    } = req.body;

    console.log("🔍 [crearTurno] fecha_hora original del cliente:", fecha_hora);

    if (fecha_hora) {
      const limpio = fecha_hora.replace("Z", "").replace("T", " ");
      const [fechaPart, horaPart] = limpio.split(" ");
      const horaFinal = horaPart ? horaPart.slice(0, 8) : "00:00:00";
      fecha_hora = `${fechaPart} ${horaFinal}`;
    }

    console.log(
      "💾 [crearTurno] fecha_hora final a insertar en BD:",
      fecha_hora,
    );

    const [resultado] = await db.query(
      `INSERT INTO turnos (fecha_hora, cliente_id, auto_id, cliente_nombre, vehiculo_contacto, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fecha_hora || null,
        cliente_id || null,
        auto_id || null,
        cliente_nombre || null,
        vehiculo_contacto || null,
        observaciones || null,
      ],
    );

    console.log("✅ Turno creado con ID:", resultado.insertId);
    res
      .status(201)
      .json({ id: resultado.insertId, message: "Turno creado con éxito" });
  } catch (error) {
    console.error("❌ Error al crear turno en DB:", error);
    res.status(500).json({ error: "Error interno al crear el turno" });
  }
};

// 4. Actualizar un turno
export const actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 [actualizarTurno ID: ${id}] req.body recibido:`, req.body);
    let {
      fecha_hora,
      cliente_id,
      auto_id,
      cliente_nombre,
      vehiculo_contacto,
      observaciones,
    } = req.body;

    console.log("🔍 [actualizarTurno] fecha_hora original:", fecha_hora);

    if (fecha_hora) {
      const limpio = fecha_hora.replace("Z", "").replace("T", " ");
      const [fechaPart, horaPart] = limpio.split(" ");
      const horaFinal = horaPart ? horaPart.slice(0, 8) : "00:00:00";
      fecha_hora = `${fechaPart} ${horaFinal}`;
    }

    console.log(
      "💾 [actualizarTurno] fecha_hora final a actualizar en BD:",
      fecha_hora,
    );

    await db.query(
      `UPDATE turnos SET fecha_hora = ?, cliente_id = ?, auto_id = ?, cliente_nombre = ?, vehiculo_contacto = ?, observaciones = ? 
       WHERE id = ?`,
      [
        fecha_hora || null,
        cliente_id || null,
        auto_id || null,
        cliente_nombre || null,
        vehiculo_contacto || null,
        observaciones || null,
        id,
      ],
    );

    res.json({ message: "Turno actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar turno:", error);
    res.status(500).json({ error: "Error al actualizar el turno" });
  }
};

// 5. Eliminar un turno
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM turnos WHERE id = ?", [id]);
    res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar turno:", error);
    res.status(500).json({ error: "Error al eliminar el turno" });
  }
};

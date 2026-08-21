import db from "../config/db.js";

// Obtener todas las relaciones cliente - auto
export const getClienteAuto = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente_auto");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener cliente_auto:", error);
    res.status(500).json({ mensaje: "Error al obtener la tabla intermedia" });
  }
};

// Asignar un auto a un cliente
export const crearClienteAuto = async (req, res) => {
  const { cliente_id, auto_id } = req.body;

  try {
    await db.query(
      "INSERT INTO cliente_auto (cliente_id, auto_id) VALUES (?, ?)",
      [cliente_id, auto_id],
    );
    res
      .status(201)
      .json({ mensaje: "Relación cliente-auto guardada correctamente" });
  } catch (error) {
    console.error("Error al asociar cliente con auto:", error);
    res.status(500).json({ mensaje: "Error al guardar la relación" });
  }
};

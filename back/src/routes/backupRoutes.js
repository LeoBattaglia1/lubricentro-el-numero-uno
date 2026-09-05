import express from "express";
import path from "path";
import fs from "fs";
import { generarRespaldoSQL } from "../services/backupService.js";

const router = express.Router();

router.get("/guardar-pendrive", async (req, res) => {
  const letraPendrive = "E:/ResguardosTaller"; // Ajusta la letra si es necesario

  // Verificar si el pendrive está conectado
  if (!fs.existsSync(letraPendrive)) {
    return res.status(400).json({
      success: false,
      error: "El pendrive no está conectado en la unidad E:",
    });
  }

  try {
    // Nombre fijo para que se sobrescriba siempre el mismo archivo sin acumular copias
    const nombreArchivo = "respaldo_taller.sql";
    const rutaDestino = path.join(letraPendrive, nombreArchivo);

    const resultado = await generarRespaldoSQL(rutaDestino);

    if (!resultado.success) {
      return res
        .status(500)
        .json({ success: false, error: "No se pudo generar el respaldo" });
    }

    res.json({
      success: true,
      message: "Respaldo guardado con éxito en el pendrive.",
    });
  } catch (error) {
    console.error("Error al guardar en el pendrive:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno en el servidor" });
  }
});

export default router;

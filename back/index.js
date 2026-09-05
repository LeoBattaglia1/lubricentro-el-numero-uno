import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import { generarRespaldoSQL } from "./src/services/backupService.js";

// Importación de rutas
import provedoresRoutes from "./src/routes/provedoresRoutes.js";
import mercaderiaRoutes from "./src/routes/mercaderiaRoutes.js";
import clientesRoutes from "./src/routes/clientesRoutes.js";
import autosRoutes from "./src/routes/autosRoutes.js";
import serviciosRoutes from "./src/routes/serviciosRoutes.js";
import turnosRoutes from "./src/routes/turnosRoutes.js";
import escasesRoutes from "./src/routes/escasesRoutes.js";
import finanzasRoutes from "./src/routes/finanzasRoutes.js";
import historialServiciosRouter from "./src/routes/historialServiciosRouter.js";
import historialMercaderiaRouter from "./src/routes/historialMercaderiaRouter.js";
import pagosRouter from "./src/routes/pagosRouter.js";
import clienteAutoRouter from "./src/routes/clienteAutoRouter.js";
import pagosProvedorRouter from "./src/routes/pagosProvedorRoutes.js";
import trabajosRouter from "./src/routes/trabajosRouter.js";
import backupRoutes from "./src/routes/backupRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoints de la API
app.use("/api/provedores", provedoresRoutes);
app.use("/api/mercaderia", mercaderiaRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/autos", autosRoutes);
app.use("/api/servicios", serviciosRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/escasesdestock", escasesRoutes);
app.use("/api/finanzas", finanzasRoutes);
app.use("/api/historial-servicios", historialServiciosRouter);
app.use("/api/historial-mercaderia", historialMercaderiaRouter);
app.use("/api/pagos", pagosRouter);
app.use("/api/cliente-auto", clienteAutoRouter);
app.use("/api/pagosprovedor", pagosProvedorRouter);
app.use("/api/trabajos-realizados", trabajosRouter);
app.use("/api/backup", backupRoutes);

// Endpoint de verificación del estado del servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API Lubricentro El Número Uno operativa",
  });
});

// RESPALDO AUTOMÁTICO PROGRAMADO (Todos los días a las 11:30 y 20:00 hs)
cron.schedule("45 11,20 * * *", async () => {
  const letraPendrive = "E:/ResguardosTaller"; // Ajusta la letra si difiere en otra PC

  if (!fs.existsSync(letraPendrive)) {
    return; // Sale silenciosamente si no está conectado el pendrive
  }

  try {
    const rutaDestino = path.join(letraPendrive, "respaldo_taller.sql");

    const resultado = await generarRespaldoSQL(rutaDestino);
    if (resultado.success) {
      console.log(
        "✅ Respaldo automático programado guardado con éxito en el pendrive.",
      );
    }
  } catch (error) {
    console.error(
      "❌ Error al generar el respaldo automático programado:",
      error,
    );
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend completo corriendo en http://localhost:${PORT}`);
});

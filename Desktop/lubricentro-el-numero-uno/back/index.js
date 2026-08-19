import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importación de rutas
import provedoresRoutes from "./src/routes/provedoresRoutes.js";
import mercaderiaRoutes from "./src/routes/mercaderiaRoutes.js";
import clientesRoutes from "./src/routes/clientesRoutes.js";
import autosRoutes from "./src/routes/autosRoutes.js";
import serviciosRoutes from "./src/routes/serviciosRoutes.js";
import historialRoutes from "./src/routes/historialRoutes.js";
import turnosRoutes from "./src/routes/turnosRoutes.js";
import escasesRoutes from "./src/routes/escasesRoutes.js";
import finanzasRoutes from "./src/routes/finanzasRoutes.js";

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
app.use("/api/historial", historialRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/escases", escasesRoutes);
app.use("/api/finanzas", finanzasRoutes);

// Endpoint de verificación del estado del servidor
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API Lubricentro El Número Uno operativa",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend completo corriendo en http://localhost:${PORT}`);
});

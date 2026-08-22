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
import historialServiciosRouter from "./src/routes/historialServiciosRouter.js";
import historialMercaderiaRouter from "./src/routes/historialMercaderiaRouter.js";
import pagosRouter from "./src/routes/pagosRouter.js";
import clienteAutoRouter from "./src/routes/clienteAutoRouter.js";
import pagosProvedorRouter from "./src/routes/pagosProvedorRoutes.js";

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
app.use("/api/escasesdestock", escasesRoutes);
app.use("/api/finanzas", finanzasRoutes);
app.use("/api/historial-servicios", historialServiciosRouter);
app.use("/api/historial-mercaderia", historialMercaderiaRouter);
app.use("/api/pagos", pagosRouter);
app.use("/api/cliente-auto", clienteAutoRouter);
app.use("/api/pagosprovedor", pagosProvedorRouter);

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

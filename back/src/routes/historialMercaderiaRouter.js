import { Router } from "express";
import {
  getHistorialMercaderiaByAuto,
  getHistorialMercaderiaByCliente,
  registrarMovimientoMercaderia,
} from "../controllers/historialMercaderiaController.js";

const router = Router();

router.get("/auto/:auto_id", getHistorialMercaderiaByAuto);
router.get("/cliente/:cliente_id", getHistorialMercaderiaByCliente);
router.post("/", registrarMovimientoMercaderia);

export default router;

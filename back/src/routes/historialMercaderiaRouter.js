import { Router } from "express";
import {
  getHistorialMercaderiaByAuto,
  registrarMovimientoMercaderia,
} from "../controllers/historialMercaderiaController.js";

const router = Router();

router.get("/auto/:auto_id", getHistorialMercaderiaByAuto);
router.post("/", registrarMovimientoMercaderia);

export default router;

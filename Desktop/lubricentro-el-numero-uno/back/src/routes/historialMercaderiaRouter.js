import { Router } from "express";
import {
  getHistorialMercaderia,
  registrarMovimientoMercaderia,
} from "../controllers/historialMercaderiaController.js";

const router = Router();

router.get("/", getHistorialMercaderia);
router.post("/", registrarMovimientoMercaderia);

export default router;

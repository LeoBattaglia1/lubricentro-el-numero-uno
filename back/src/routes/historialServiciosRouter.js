import { Router } from "express";
import {
  getHistorialByAuto,
  getHistorialByCliente,
  registrarServicio,
} from "../controllers/historialServiciosController.js";

const router = Router();

router.get("/auto/:auto_id", getHistorialByAuto);
router.get("/cliente/:cliente_id", getHistorialByCliente);
router.post("/", registrarServicio);

export default router;

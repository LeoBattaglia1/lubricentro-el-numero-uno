import { Router } from "express";
import {
  getHistorialByAuto,
  registrarServicio,
} from "../controllers/historialServiciosController.js";

const router = Router();

router.get("/auto/:auto_id", getHistorialByAuto);
router.post("/", registrarServicio);

export default router;

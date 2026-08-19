import { Router } from "express";
import {
  getHistorialByAuto,
  registrarServicioAAuto,
} from "../controllers/historialController.js";

const router = Router();
router.get("/auto/:auto_id", getHistorialByAuto);
router.post("/", registrarServicioAAuto);

export default router;

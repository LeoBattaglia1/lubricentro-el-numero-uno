import { Router } from "express";
import {
  obtenerTurnos,
  obtenerClienteAuto,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from "../controllers/turnosController.js";

const router = Router();

router.get("/", obtenerTurnos);
router.get("/cliente-auto", obtenerClienteAuto);
router.post("/", crearTurno);
router.put("/:id", actualizarTurno);
router.delete("/:id", eliminarTurno);

export default router;

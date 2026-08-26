import { Router } from "express";
import {
  obtenerTurnos,
  obtenerClienteAuto,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from "../controllers/turnosController.js";

const router = Router();

router.get("/turnos", obtenerTurnos);
router.get("/cliente_auto", obtenerClienteAuto); // <--- IMPORTANTE
router.post("/turnos", crearTurno);
router.put("/turnos/:id", actualizarTurno);
router.delete("/turnos/:id", eliminarTurno);

export default router;

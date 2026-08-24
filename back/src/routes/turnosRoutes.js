import express from "express";
import {
  obtenerTurnos,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} from "../controllers/turnosController.js";

const router = express.Router();

router.get("/", obtenerTurnos);
router.post("/", crearTurno);
router.put("/:id", actualizarTurno);
router.delete("/:id", eliminarTurno);

export default router;

import { Router } from "express";
import {
  getTurnos,
  createTurno,
  deleteTurno,
} from "../controllers/turnosController.js";

const router = Router();
router.get("/", getTurnos);
router.post("/", createTurno);
router.delete("/:id", deleteTurno);

export default router;

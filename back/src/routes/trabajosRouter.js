import { Router } from "express";
import { registrarTrabajoCompleto } from "../controllers/trabajosController.js";

const router = Router();

router.post("/", registrarTrabajoCompleto);

export default router;

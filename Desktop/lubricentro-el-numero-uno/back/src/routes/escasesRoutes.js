import { Router } from "express";
import {
  getEscasesStock,
  createEscasesStock,
  updateObservacionEscasesStock,
  deleteEscasesStock,
} from "../controllers/escasesController.js";

const router = Router();

router.get("/", getEscasesStock);
router.post("/", createEscasesStock);
router.put("/:id", updateObservacionEscasesStock);
router.delete("/:id", deleteEscasesStock);

export default router;

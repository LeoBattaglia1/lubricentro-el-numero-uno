import { Router } from "express";
import {
  getEscasesStock,
  createEscasesStock,
  deleteEscasesStock,
} from "../controllers/escasesController.js";

const router = Router();
router.get("/", getEscasesStock);
router.post("/", createEscasesStock);
router.delete("/:id", deleteEscasesStock);

export default router;

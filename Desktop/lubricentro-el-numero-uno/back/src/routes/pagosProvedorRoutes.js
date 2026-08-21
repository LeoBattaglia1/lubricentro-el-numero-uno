import { Router } from "express";
import {
  getPagosProvedor,
  createPagoProvedor,
  deletePagoProvedor,
} from "../controllers/pagosProvedorController.js";

const router = Router();

router.get("/", getPagosProvedor);
router.post("/", createPagoProvedor);
router.delete("/:id", deletePagoProvedor);

export default router;

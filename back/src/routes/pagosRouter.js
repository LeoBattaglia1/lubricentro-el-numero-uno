import { Router } from "express";
import {
  getPagos,
  getPagosByCliente,
  createPago,
  deletePago,
} from "../controllers/pagosController.js";

const router = Router();

router.get("/", getPagos);
router.get("/cliente/:cliente_id", getPagosByCliente);
router.post("/", createPago);
router.delete("/:id", deletePago);

export default router;

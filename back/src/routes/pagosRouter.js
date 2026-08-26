import { Router } from "express";
import {
  getPagos,
  getProveedores,
  getPagosProveedor,
  updatePago,
  createPagoProveedor,
} from "../controllers/pagosController.js";

const router = Router();

// Rutas de pagos y proveedores
router.get("/", getPagos);
router.put("/:id", updatePago);
router.get("/provedores", getProveedores);
router.get("/pagosprovedor", getPagosProveedor);
router.post("/pagosprovedor", createPagoProveedor);

export default router;

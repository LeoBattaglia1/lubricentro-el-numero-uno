import { Router } from "express";
import {
  getPagos,
  createPago,
  getPagosProveedores,
  createPagoProveedor,
  getVentas,
  registrarVentaDiaria,
} from "../controllers/finanzasController.js";

const router = Router();

router.get("/pagos-clientes", getPagos);
router.post("/pagos-clientes", createPago);

router.get("/pagos-proveedores", getPagosProveedores);
router.post("/pagos-proveedores", createPagoProveedor);

router.get("/ventas", getVentas);
router.post("/ventas", registrarVentaDiaria);

export default router;

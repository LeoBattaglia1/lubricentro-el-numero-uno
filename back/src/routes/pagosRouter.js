import { Router } from "express";
import {
  getPagos,
  createPago,
  updatePago,
  getPagosProveedores,
  createPagoProveedor,
  getVentas,
  registrarVentaDiaria,
  getDeudaClienteDetalle,
} from "../controllers/pagosController.js";

const router = Router();

router.get("/", getPagos);
router.post("/", createPago);
router.put("/:id", updatePago); // <- Esencial para que Caja.jsx pueda actualizar el pago pendiente
router.get("/clientes/:id/deuda-detalle", getDeudaClienteDetalle);

router.get("/pagosprovedor", getPagosProveedores);
router.post("/pagosprovedor", createPagoProveedor);

router.get("/ventas", getVentas);
router.post("/ventas", registrarVentaDiaria);

export default router;

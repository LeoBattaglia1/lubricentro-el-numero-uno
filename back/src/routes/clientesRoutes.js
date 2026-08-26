import { Router } from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  asociarAutoACliente,
  getDeudaClienteDetalle,
} from "../controllers/clientesController.js";

const router = Router();

router.get("/", getClientes);
router.get("/:id/deuda-detalle", getDeudaClienteDetalle); // Ruta correcta bajo /api/clientes/:id/deuda-detalle
router.post("/", createCliente);
router.post("/vincular-auto", asociarAutoACliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;

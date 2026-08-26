import { Router } from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  asociarAutoACliente,
  getDeudaClienteDetalle, // 1. Importar la nueva función
} from "../controllers/clientesController.js";

const router = Router();

router.get("/", getClientes);
router.get("/:id/deuda-detalle", getDeudaClienteDetalle); // 2. Registrar la ruta para obtener deudas e historial
router.post("/", createCliente);
router.post("/vincular-auto", asociarAutoACliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;

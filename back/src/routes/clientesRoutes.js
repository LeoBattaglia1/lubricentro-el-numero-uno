import { Router } from "express";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  asociarAutoACliente,
} from "../controllers/clientesController.js";

const router = Router();
router.get("/", getClientes);
router.post("/", createCliente);
router.post("/vincular-auto", asociarAutoACliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;

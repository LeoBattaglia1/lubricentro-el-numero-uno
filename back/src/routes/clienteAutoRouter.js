import { Router } from "express";
import {
  getClienteAuto,
  crearClienteAuto,
  eliminarClienteAuto,
} from "../controllers/clienteAutoController.js";

const router = Router();

router.get("/", getClienteAuto);
router.post("/", crearClienteAuto);
router.delete("/:id", eliminarClienteAuto);

export default router;

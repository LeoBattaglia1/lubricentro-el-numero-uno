import { Router } from "express";
import {
  getClienteAuto,
  crearClienteAuto,
} from "../controllers/clienteAutoController.js";

const router = Router();

router.get("/", getClienteAuto);
router.post("/", crearClienteAuto);

export default router;

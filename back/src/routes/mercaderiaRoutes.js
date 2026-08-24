import { Router } from "express";
import {
  getMercaderia,
  createMercaderia,
  updateMercaderia,
  deleteMercaderia,
} from "../controllers/mercaderiaController.js";

const router = Router();

router.get("/", getMercaderia);
router.post("/", createMercaderia);
router.put("/:id", updateMercaderia);
router.delete("/:id", deleteMercaderia);

export default router;

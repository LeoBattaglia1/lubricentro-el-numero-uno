import { Router } from "express";
import {
  getAutos,
  createAuto,
  updateAuto,
  deleteAuto,
} from "../controllers/autosController.js";

const router = Router();
router.get("/", getAutos);
router.post("/", createAuto);
router.put("/:id", updateAuto);
router.delete("/:id", deleteAuto);

export default router;

import { Router } from "express";
import {
  getProvedores,
  createProvedor,
  updateProvedor,
  deleteProvedor,
} from "../controllers/provedoresController.js";

const router = Router();

router.get("/", getProvedores);
router.post("/", createProvedor);
router.put("/:id", updateProvedor);
router.delete("/:id", deleteProvedor);

export default router;

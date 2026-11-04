import { Router } from "express";
import {
  listProducts,
  listCities,
  getProduct,
  recordView,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", listProducts);
router.get("/cities", listCities);
router.get("/:id", getProduct);
router.post("/:id/view", recordView);
router.post("/", requireAdmin, createProduct);
router.put("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;

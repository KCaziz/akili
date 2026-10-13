import { Router } from "express";
import { listServices, createService, updateService, deleteService } from "../controllers/servicesController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", listServices);
router.post("/", requireAdmin, createService);
router.put("/:id", requireAdmin, updateService);
router.delete("/:id", requireAdmin, deleteService);

export default router;

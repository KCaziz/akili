import { Router } from "express";
import { createAlert, listAlerts, updateAlert, deleteAlert } from "../controllers/alertsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/", createAlert);
router.get("/", requireAdmin, listAlerts);
router.patch("/:id", requireAdmin, updateAlert);
router.delete("/:id", requireAdmin, deleteAlert);

export default router;

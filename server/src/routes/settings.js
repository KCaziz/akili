import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAdmin, updateSettings);

export default router;

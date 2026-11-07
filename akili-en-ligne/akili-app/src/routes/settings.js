import { Router } from "express";
import { getSettings, updateSettings, sendTestEmail } from "../controllers/settingsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAdmin, updateSettings);
router.post("/test-email", requireAdmin, sendTestEmail);

export default router;

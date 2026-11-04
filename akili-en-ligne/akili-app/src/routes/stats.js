import { Router } from "express";
import { getStats } from "../controllers/statsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", requireAdmin, getStats);

export default router;

import { Router } from "express";
import { login, logout, me, changePassword } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);
router.post("/change-password", requireAdmin, changePassword);

export default router;

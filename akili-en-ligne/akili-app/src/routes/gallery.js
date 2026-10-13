import { Router } from "express";
import { listMedia, createMedia, deleteMedia } from "../controllers/galleryController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", listMedia);
router.post("/", requireAdmin, createMedia);
router.delete("/:id", requireAdmin, deleteMedia);

export default router;

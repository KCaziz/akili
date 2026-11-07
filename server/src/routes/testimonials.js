import { Router } from "express";
import {
  listPublishedTestimonials,
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.get("/", listPublishedTestimonials);
router.get("/all", requireAdmin, listAllTestimonials);
router.post("/", requireAdmin, createTestimonial);
router.put("/:id", requireAdmin, updateTestimonial);
router.delete("/:id", requireAdmin, deleteTestimonial);

export default router;

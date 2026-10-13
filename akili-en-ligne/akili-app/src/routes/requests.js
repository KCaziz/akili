import { Router } from "express";
import { createRequest, listRequests, updateRequestStatus } from "../controllers/requestsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/", createRequest);
router.get("/", requireAdmin, listRequests);
router.patch("/:id", requireAdmin, updateRequestStatus);

export default router;

import { Router } from "express";
import { createSellOffer, listSellOffers, updateSellOfferStatus } from "../controllers/sellOffersController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.post("/", createSellOffer);
router.get("/", requireAdmin, listSellOffers);
router.patch("/:id", requireAdmin, updateSellOfferStatus);

export default router;

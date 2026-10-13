import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

export default router;

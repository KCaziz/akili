import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", uptime: process.uptime(), database: "connected" });
  } catch {
    res.status(503).json({ status: "degraded", uptime: process.uptime(), database: "unavailable" });
  }
});

export default router;

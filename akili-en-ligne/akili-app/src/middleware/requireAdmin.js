import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAdmin(req, res, next) {
  const token = req.cookies?.akili_admin_token;
  if (!token) {
    return res.status(401).json({ error: "Non authentifié" });
  }
  try {
    req.admin = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: "Session invalide ou expirée" });
  }
}

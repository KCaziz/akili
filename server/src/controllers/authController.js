import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";

const COOKIE_NAME = "akili_admin_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function login(req, res, next) {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: "Identifiant et mot de passe requis" });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    // Comparaison factice si l'admin n'existe pas, pour ne pas révéler par le timing si le compte existe.
    const passwordHash = admin?.passwordHash ?? "$2a$10$invalidsaltinvalidsaltinvalidsaltinval";
    const valid = await bcrypt.compare(password, passwordHash);

    if (!admin || !valid) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign({ sub: admin.id, username: admin.username }, env.jwtSecret, {
      expiresIn: "7d",
    });
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    res.json({ username: admin.username });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ username: req.admin.username });
}

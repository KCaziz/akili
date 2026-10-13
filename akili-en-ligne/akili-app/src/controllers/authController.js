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

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Mot de passe actuel et nouveau mot de passe requis" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères" });
    }

    const admin = await prisma.admin.findUnique({ where: { id: req.admin.sub } });
    const valid = admin && (await bcrypt.compare(currentPassword, admin.passwordHash));
    if (!valid) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

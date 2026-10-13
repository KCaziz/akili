import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env.js";

// Prisma 7 nécessite un driver adapter explicite pour se connecter.
// PrismaMariaDb fonctionne aussi bien contre MariaDB que contre MySQL (protocole compatible) —
// c'est le choix adapté à un hébergement mutualisé cPanel qui n'offre que MySQL/MariaDB.
const adapter = new PrismaMariaDb(env.databaseUrl);

export const prisma = new PrismaClient({ adapter });

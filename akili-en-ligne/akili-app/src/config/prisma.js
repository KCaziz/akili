import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "./env.js";

// Réglages du pool de connexions pour un hébergement mutualisé (cPanel). Par défaut, le driver
// garde ses connexions inactives 30 min, alors que MySQL les coupe bien avant (wait_timeout) :
// une requête qui tombe sur une connexion coupée peut rester bloquée. On les referme donc plus
// tôt, et on borne les délais pour qu’une base qui ne répond pas échoue vite au lieu de figer
// le site. Le nombre de connexions reste celui du driver (10) : le réduire ralentit chaque page.
// Chaque réglage peut être remplacé en l’ajoutant à DATABASE_URL (ex. ?connectionLimit=5).
const POOL_DEFAULTS = {
  idleTimeout: "45", // (secondes) referme une connexion inactive avant que MySQL ne la coupe
  connectTimeout: "5000", // (ms) échec rapide si la base ne répond pas
  socketTimeout: "30000", // (ms) coupe une connexion bloquée au lieu d’attendre indéfiniment
  keepAliveDelay: "20000", // (ms) maintient le lien TCP actif
};

function withPoolDefaults(databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    for (const [key, value] of Object.entries(POOL_DEFAULTS)) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
}

// Prisma 7 nécessite un driver adapter explicite pour se connecter.
// PrismaMariaDb fonctionne aussi bien contre MariaDB que contre MySQL (protocole compatible) —
// c'est le choix adapté à un hébergement mutualisé cPanel qui n'offre que MySQL/MariaDB.
const adapter = new PrismaMariaDb(withPoolDefaults(env.databaseUrl));

export const prisma = new PrismaClient({ adapter });

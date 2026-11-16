import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import { UPLOADS_DIR } from "./middleware/upload.js";
import healthRouter from "./routes/health.js";
import productsRouter from "./routes/products.js";
import servicesRouter from "./routes/services.js";
import requestsRouter from "./routes/requests.js";
import sellOffersRouter from "./routes/sellOffers.js";
import galleryRouter from "./routes/gallery.js";
import authRouter from "./routes/auth.js";
import uploadsRouter from "./routes/uploads.js";
import testimonialsRouter from "./routes/testimonials.js";
import settingsRouter from "./routes/settings.js";
import alertsRouter from "./routes/alerts.js";
import statsRouter from "./routes/stats.js";
import compression from "compression";
import { seoFilesRouter, seoApiRouter } from "./routes/seo.js";
import { buildSeo, renderHtml, siteUrl, preferredLang } from "./seo/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const app = express();

// crossOriginResourcePolicy "cross-origin" : nécessaire quand front (Vite dev, :5173) et API
// (:4000) tournent sur des ports différents. Sans impact en production (même origine).
// img-src élargi à "https:" : le catalogue/galerie affichent des photos de démonstration
// hébergées sur Unsplash (domaine externe) — le CSP par défaut d'Helmet ("img-src 'self'
// data:") les bloquerait silencieusement côté navigateur une fois que ce serveur sert aussi
// la page HTML (en dev, Vite sert la page donc ce CSP ne s'appliquait jamais).
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "https:"],
        "media-src": ["'self'", "https:"],
        // Vidéos de visite hébergées sur YouTube/Vimeo, intégrées en iframe sur la fiche d'un bien.
        "frame-src": ["'self'", "https://www.youtube-nocookie.com", "https://player.vimeo.com"],
        // Google Analytics 4 (chargé seulement si un identifiant est configuré et que le visiteur accepte).
        "script-src": ["'self'", "https://www.googletagmanager.com"],
        "connect-src": ["'self'", "https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com"],
      },
    },
  }),
);

// Une seule adresse officielle pour Google : https + domaine sans « www » (celui de PUBLIC_URL).
// Derrière l'hébergement (Passenger/Apache), le protocole d'origine arrive dans X-Forwarded-Proto.
app.set("trust proxy", true);
if (env.nodeEnv === "production" && process.env.PUBLIC_URL) {
  const canonical = new URL(process.env.PUBLIC_URL);
  app.use((req, res, next) => {
    const host = (req.get("host") || "").toLowerCase();
    const wrongHost = host === `www.${canonical.host}`;
    const insecure = canonical.protocol === "https:" && req.protocol === "http" && host === canonical.host;
    if ((wrongHost || insecure) && ["GET", "HEAD"].includes(req.method)) {
      return res.redirect(301, `${canonical.origin}${req.originalUrl}`);
    }
    next();
  });
}

app.use(compression());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// Les fichiers envoyés ne changent jamais (nom unique) : cache navigateur long.
app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "1y", immutable: true }));

app.use(seoFilesRouter);
app.use("/api/seo", seoApiRouter);

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/sell-offers", sellOffersRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/auth", authRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/testimonials", testimonialsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/stats", statsRouter);

// Sert le frontend React buildé (client/dist copié dans server/public au déploiement) sur le
// même serveur Node que l'API — nécessaire sur un hébergement mutualisé cPanel, qui n'autorise
// généralement qu'une seule application Node par domaine/sous-domaine. En dev, ce dossier
// n'existe pas (le frontend tourne séparément via `npm run dev` sur :5173) : on ne l'active
// que s'il est présent, donc aucun impact sur le flux de développement local.
if (fs.existsSync(PUBLIC_DIR)) {
  // Fichiers du build avec empreinte dans le nom (assets/index-AbC123.js) : cache d'un an.
  // index.html n'est jamais servi tel quel ici (index: false) : il passe par le rendu SEO ci-dessous.
  app.use(
    "/assets",
    express.static(path.join(PUBLIC_DIR, "assets"), { maxAge: "1y", immutable: true }),
  );
  app.use(express.static(PUBLIC_DIR, { index: false, maxAge: "7d" }));

  const indexHtml = fs.readFileSync(path.join(PUBLIC_DIR, "index.html"), "utf8");
  app.get(/^\/(?!api\/|uploads\/).*/, async (req, res, next) => {
    try {
      // Pages de l'admin : pas de référencement, l'application s'occupe de tout.
      if (req.path === "/admin" || req.path.startsWith("/admin/")) {
        return res.set("X-Robots-Tag", "noindex").type("html").send(indexHtml);
      }
      const base = siteUrl(req);
      const seo = await buildSeo({ pathname: req.path, query: req.query, base });
      const qs = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
      if (seo.parsed?.root) return res.redirect(302, `/${preferredLang(req)}${qs}`);
      if (seo.parsed?.redirect) return res.redirect(301, `${seo.parsed.redirect}${qs}`);

      res.status(seo.status).set("Cache-Control", "no-cache").type("html").send(renderHtml(indexHtml, seo));
    } catch (err) {
      next(err);
    }
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

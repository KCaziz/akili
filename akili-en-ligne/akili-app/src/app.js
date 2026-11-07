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
      },
    },
  }),
);
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/uploads", express.static(UPLOADS_DIR));

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
  app.use(express.static(PUBLIC_DIR));
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

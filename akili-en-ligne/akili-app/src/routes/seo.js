import { Router } from "express";
import { buildSeo, buildSitemap, siteUrl } from "../seo/seo.js";

// Routes publiques hors /api : robots.txt et sitemap.xml.
export const seoFilesRouter = Router();

seoFilesRouter.get("/robots.txt", (req, res) => {
  const base = siteUrl(req);
  res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${base}/sitemap.xml\n`);
});

seoFilesRouter.get("/sitemap.xml", async (req, res, next) => {
  try {
    res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(await buildSitemap(siteUrl(req)));
  } catch (err) {
    next(err);
  }
});

// /api/seo?path=/fr/produits/... : titre et description à jour quand on navigue dans le site
// sans recharger la page (même source que le HTML envoyé aux moteurs de recherche).
export const seoApiRouter = Router();

seoApiRouter.get("/", async (req, res, next) => {
  try {
    const raw = typeof req.query.path === "string" ? req.query.path : "/";
    const url = new URL(raw, "http://local");
    const seo = await buildSeo({ pathname: url.pathname, query: Object.fromEntries(url.searchParams), base: siteUrl(req) });
    if (!seo.title) return res.json({ redirect: seo.parsed?.redirect ?? null });
    res.json({
      title: seo.title,
      description: seo.description,
      canonical: seo.canonical,
      robots: seo.robots,
      lang: seo.lang,
      dir: seo.dir,
      status: seo.status,
    });
  } catch (err) {
    next(err);
  }
});

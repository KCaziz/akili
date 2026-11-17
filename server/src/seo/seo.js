import { prisma } from "../config/prisma.js";
import { readSettings } from "../controllers/settingsController.js";
import { LANGS, DEFAULT_LANG, TEXTS } from "./texts.js";

// Pages publiques : clé interne → segment d'URL (identique dans toutes les langues).
export const PAGES = {
  home: "",
  services: "services",
  products: "produits",
  gallery: "galerie",
  contact: "contact",
  sell: "vendre",
  request: "demande",
  simulator: "simulateur",
  favorites: "favoris",
};
const SEGMENT_TO_PAGE = Object.fromEntries(Object.entries(PAGES).map(([key, segment]) => [segment, key]));
const NOINDEX_PAGES = new Set(["favorites"]);

const DEFAULT_IMAGE = "/og-image.jpg";

// Grande photo de l'accueil (même URL que client/src/pages/HomePage.jsx) : préchargée pour l'afficher plus vite.
const HERO = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80";
const HERO_PRELOAD = {
  href: `${HERO}&w=1800`,
  srcset: `${HERO}&w=800 800w, ${HERO}&w=1200 1200w, ${HERO}&w=1800 1800w`,
  sizes: "100vw",
};

export function siteUrl(req) {
  const fromEnv = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return `${req.protocol}://${req.get("host")}`;
}

// ---------------------------------------------------------------- URLs des biens

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function productSegment(product) {
  const slug = slugify(`${product.title} ${product.city}`);
  return slug ? `${slug}-${product.id}` : product.id;
}

// Le dernier morceau après le dernier tiret est l'identifiant (les identifiants n'ont pas de tiret).
export function productIdFromSegment(segment) {
  return segment.split("-").pop();
}

export function langPath(lang, ...segments) {
  const rest = segments.filter((part) => part !== "" && part !== undefined && part !== null).join("/");
  return rest ? `/${lang}/${rest}` : `/${lang}`;
}

// ---------------------------------------------------------------- Analyse d'une URL publique

// Renvoie { lang, page, segment } ou { redirect } (anciennes URL sans langue) ou null (pas une page publique).
export function parsePublicPath(pathname) {
  const parts = pathname.split("/").filter(Boolean).map((part) => decodeURIComponent(part));
  if (parts[0] === "admin" || parts[0] === "api" || parts[0] === "uploads") return null;

  if (parts.length === 0) return { root: true };

  if (!LANGS[parts[0]]) {
    // Anciennes adresses (/produits/xxx, /contact…) : redirection permanente vers la version française.
    if (SEGMENT_TO_PAGE[parts[0]] !== undefined) return { redirect: `/${DEFAULT_LANG}/${parts.join("/")}` };
    return { lang: DEFAULT_LANG, page: "notFound" };
  }

  const [lang, first = "", second, ...extra] = parts;
  if (extra.length) return { lang, page: "notFound" };
  if (first === "produits" && second) return { lang, page: "product", segment: second };
  if (second) return { lang, page: "notFound" };
  const page = SEGMENT_TO_PAGE[first];
  return page === undefined ? { lang, page: "notFound" } : { lang, page };
}

// Langue préférée du visiteur pour la racine « / » (l'arabe si le navigateur le demande en premier).
export function preferredLang(req) {
  const header = (req.get("accept-language") || "").toLowerCase();
  const first = header.split(",")[0]?.trim().slice(0, 2);
  if (first === "ar") return "ar";
  if (first === "en") return "en";
  return DEFAULT_LANG;
}

// ---------------------------------------------------------------- Construction des métadonnées

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function truncate(text, max = 158) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function formatAmount(value) {
  return new Intl.NumberFormat("fr-FR").format(value).replace(/\s/g, " ");
}

function priceLabel(product, t) {
  if (!product.priceValue) return product.price;
  const amount = `${formatAmount(product.priceValue)} DZD`;
  return product.type === "LOCATION" ? `${amount} ${t.perMonth}` : amount;
}

function absolute(base, url) {
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function alternatesFor(base, pathForLang) {
  const links = Object.keys(LANGS).map((lang) => ({ hreflang: lang, href: `${base}${pathForLang(lang)}` }));
  links.push({ hreflang: "x-default", href: `${base}${pathForLang(DEFAULT_LANG)}` });
  return links;
}

function agencySchema(base, settings, t) {
  const sameAs = [settings.facebookUrl, settings.instagramUrl].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${base}/#agency`,
    name: t.siteName,
    url: `${base}/`,
    logo: `${base}/icon-512.png`,
    image: `${base}${DEFAULT_IMAGE}`,
    ...(settings.whatsappNumber ? { telephone: `+${settings.whatsappNumber}` } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings.address ? { address: { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "DZ" } } : {}),
    areaServed: { "@type": "Country", name: "Algérie" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

function breadcrumb(base, lang, t, items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: t.nav.home, path: langPath(lang) }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

function navLinksHtml(lang, t) {
  const links = ["home", "products", "services", "sell", "request", "simulator", "gallery", "contact"]
    .map((page) => `<a href="${langPath(lang, PAGES[page])}">${escapeHtml(t.nav[page])}</a>`)
    .join(" · ");
  return `<nav class="seo-nav">${links}</nav>`;
}

function productListHtml(lang, products, t) {
  if (!products.length) return "";
  const items = products
    .map(
      (product) =>
        `<li><a href="${langPath(lang, PAGES.products, productSegment(product))}">${escapeHtml(product.title)}</a> — ${escapeHtml(product.city)} — ${escapeHtml(priceLabel(product, t))}</li>`,
    )
    .join("");
  return `<ul>${items}</ul>`;
}

const LIST_SELECT = { id: true, title: true, city: true, type: true, price: true, priceValue: true, image: true, status: true };

// Point d'entrée : toutes les infos SEO d'une URL publique.
export async function buildSeo({ pathname, query = {}, base }) {
  const parsed = parsePublicPath(pathname);
  if (!parsed || parsed.root || parsed.redirect) return { parsed };

  const { lang } = parsed;
  const t = TEXTS[lang];
  const settings = await readSettings();
  const agency = agencySchema(base, settings, t);
  const seo = {
    parsed,
    lang,
    dir: LANGS[lang].dir,
    locale: LANGS[lang].locale,
    status: 200,
    robots: "index, follow",
    image: absolute(base, DEFAULT_IMAGE),
    type: "website",
    jsonLd: [agency],
    siteName: t.siteName,
  };

  const pageSeo = (page, pathForLang) => {
    const texts = t.pages[page];
    seo.title = texts.title;
    seo.description = texts.description;
    seo.h1 = texts.h1;
    seo.canonical = `${base}${pathForLang(lang)}`;
    seo.alternates = alternatesFor(base, pathForLang);
  };

  switch (parsed.page) {
    case "home": {
      pageSeo("home", (l) => langPath(l));
      seo.preloadImage = HERO_PRELOAD;
      const featured = await prisma.product.findMany({ where: { status: "DISPONIBLE" }, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }], take: 12, select: LIST_SELECT });
      seo.jsonLd.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${base}/#website`, name: t.siteName, url: `${base}/`, inLanguage: lang, publisher: { "@id": `${base}/#agency` } });
      seo.bodyHtml = `<p>${escapeHtml(t.pages.home.description)}</p>${productListHtml(lang, featured, t)}`;
      break;
    }

    case "products": {
      // Pages « biens à vendre à Alger » : seuls type et ville font partie de l'URL canonique.
      const type = ["VENTE", "LOCATION"].includes(query.type) ? query.type : null;
      const city = typeof query.city === "string" && query.city.trim() ? query.city.trim().slice(0, 80) : null;
      const params = new URLSearchParams();
      if (type) params.set("type", type);
      if (city) params.set("city", city);
      const qs = params.toString() ? `?${params}` : "";
      pageSeo("products", (l) => `${langPath(l, PAGES.products)}${qs}`);

      const where = { ...(type ? { type } : {}), ...(city ? { city: { contains: city } } : {}) };
      const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, take: 100, select: LIST_SELECT });
      if (type || city) {
        const what = type === "LOCATION" ? t.rent : type === "VENTE" ? t.sale : `${t.sale} / ${t.rent}`;
        seo.title = `${t.listingIn(what, city)} | ${t.siteName}`;
        seo.description = truncate(t.listingDescription(what, city));
        seo.h1 = t.listingIn(what, city);
        // Une combinaison sans aucun bien ne mérite pas d'être indexée.
        if (!products.length) seo.robots = "noindex, follow";
      }
      seo.jsonLd.push(breadcrumb(base, lang, t, [{ name: t.nav.products, path: langPath(lang, PAGES.products) }]));
      if (products.length) {
        seo.jsonLd.push({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.slice(0, 30).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${base}${langPath(lang, PAGES.products, productSegment(product))}`,
            name: product.title,
          })),
        });
      }
      seo.bodyHtml = `<p>${escapeHtml(seo.description)}</p>${productListHtml(lang, products, t)}`;
      break;
    }

    case "product": {
      const id = productIdFromSegment(parsed.segment);
      const product = await prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { position: "asc" } } } });
      if (!product) return notFound(seo, base, t, lang);

      const segment = productSegment(product);
      // Ancienne URL ou titre modifié : une seule adresse officielle par bien.
      if (segment !== parsed.segment) return { parsed: { redirect: `${langPath(lang, PAGES.products, segment)}` } };

      const what = product.type === "VENTE" ? t.sale : t.rent;
      const price = priceLabel(product, t);
      const pathForLang = (l) => langPath(l, PAGES.products, segment);
      const facts = [product.surface, product.rooms ? `${product.rooms} ${t.rooms}` : null].filter(Boolean).join(", ");
      const images = (product.images.length ? product.images.map((image) => image.url) : [product.image]).filter(Boolean).map((url) => absolute(base, url));

      seo.title = truncate(`${product.title} ${what} ${t.in} ${product.city} — ${price} | ${t.siteName}`, 110);
      seo.description = truncate(
        product.description ? `${price}. ${facts ? `${facts}. ` : ""}${product.description}` : `${product.title} ${what} ${t.in} ${product.city}. ${price}. ${facts ? `${facts}. ` : ""}${t.productCta}`,
      );
      seo.h1 = product.title;
      seo.canonical = `${base}${pathForLang(lang)}`;
      seo.alternates = alternatesFor(base, pathForLang);
      seo.type = "article";
      if (images[0]) seo.image = images[0];

      const available = product.status === "DISPONIBLE";
      seo.jsonLd.push({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: product.title,
        description: truncate(product.description || seo.description, 500),
        url: seo.canonical,
        datePosted: product.createdAt.toISOString(),
        image: images,
        contentLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...(product.address ? { streetAddress: product.address } : {}),
            addressLocality: product.city,
            addressCountry: "DZ",
          },
          ...(product.latitude != null && product.longitude != null
            ? { geo: { "@type": "GeoCoordinates", latitude: product.latitude, longitude: product.longitude } }
            : {}),
        },
        ...(product.priceValue
          ? {
              offers: {
                "@type": "Offer",
                price: product.priceValue,
                priceCurrency: "DZD",
                availability: available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                businessFunction: product.type === "LOCATION" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
                seller: { "@id": `${base}/#agency` },
              },
            }
          : {}),
      });
      seo.jsonLd.push(
        breadcrumb(base, lang, t, [
          { name: t.nav.products, path: langPath(lang, PAGES.products) },
          { name: product.title, path: pathForLang(lang) },
        ]),
      );
      seo.bodyHtml = `
        ${images[0] ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(product.title)}" width="800" style="max-width:100%;height:auto">` : ""}
        <p><strong>${escapeHtml(price)}</strong> — ${escapeHtml(product.type === "VENTE" ? t.saleNoun : t.rentNoun)} — ${escapeHtml(product.city)}${facts ? ` — ${escapeHtml(facts)}` : ""}</p>
        ${available ? "" : `<p>${escapeHtml(t.soldOut)}</p>`}
        ${product.description ? `<p>${escapeHtml(product.description)}</p>` : ""}
        <p>${escapeHtml(t.productCta)}</p>`;
      break;
    }

    case "services": {
      pageSeo("services", (l) => langPath(l, PAGES.services));
      const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
      seo.jsonLd.push(breadcrumb(base, lang, t, [{ name: t.nav.services, path: langPath(lang, PAGES.services) }]));
      seo.bodyHtml = `<p>${escapeHtml(seo.description)}</p>${services
        .map((service) => `<h2>${escapeHtml(service.title)}</h2>${service.description ? `<p>${escapeHtml(service.description)}</p>` : ""}`)
        .join("")}`;
      break;
    }

    case "notFound":
      return notFound(seo, base, t, lang);

    default: {
      const page = parsed.page;
      pageSeo(page, (l) => langPath(l, PAGES[page]));
      if (NOINDEX_PAGES.has(page)) seo.robots = "noindex, follow";
      seo.jsonLd.push(breadcrumb(base, lang, t, [{ name: t.nav[page] || seo.h1, path: langPath(lang, PAGES[page]) }]));
      seo.bodyHtml = `<p>${escapeHtml(seo.description)}</p>`;
    }
  }

  seo.navHtml = navLinksHtml(lang, t);
  return seo;
}

function notFound(seo, base, t, lang) {
  seo.status = 404;
  seo.robots = "noindex, follow";
  seo.title = t.pages.notFound.title;
  seo.description = t.pages.notFound.description;
  seo.h1 = t.pages.notFound.h1;
  seo.canonical = null;
  seo.alternates = [];
  seo.bodyHtml = `<p>${escapeHtml(seo.description)}</p>`;
  seo.navHtml = navLinksHtml(lang, t);
  return seo;
}

// ---------------------------------------------------------------- Injection dans index.html

export function renderHtml(template, seo) {
  const head = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="robots" content="${seo.robots}" />`,
    seo.preloadImage
      ? `<link rel="preload" as="image" href="${escapeHtml(seo.preloadImage.href)}" imagesrcset="${escapeHtml(seo.preloadImage.srcset)}" imagesizes="${seo.preloadImage.sizes}" fetchpriority="high" />`
      : "",
    seo.canonical ? `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />` : "",
    ...(seo.alternates || []).map((alt) => `<link rel="alternate" hreflang="${alt.hreflang}" href="${escapeHtml(alt.href)}" />`),
    `<meta property="og:site_name" content="${escapeHtml(seo.siteName)}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    seo.canonical ? `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />` : "",
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    `<meta property="og:locale" content="${seo.locale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
    ...seo.jsonLd.map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");

  // Contenu lisible sans JavaScript (moteurs de recherche, aperçus) ; React le remplace au chargement.
  const body = `<div class="seo-prerender container"><h1>${escapeHtml(seo.h1)}</h1>${seo.bodyHtml || ""}${seo.navHtml || ""}</div>`;

  return template
    .replace(/<html[^>]*>/, `<html lang="${seo.lang}" dir="${seo.dir}">`)
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

// ---------------------------------------------------------------- Sitemap

export async function buildSitemap(base) {
  const [products, cityRows] = await Promise.all([
    prisma.product.findMany({ select: { id: true, title: true, city: true, updatedAt: true } }),
    prisma.product.findMany({ where: { status: "DISPONIBLE" }, distinct: ["city", "type"], select: { city: true, type: true } }),
  ]);

  const entries = [];
  const add = (pathForLang, lastmod, priority) => entries.push({ pathForLang, lastmod, priority });

  for (const [page, segment] of Object.entries(PAGES)) {
    if (NOINDEX_PAGES.has(page)) continue;
    add((l) => langPath(l, segment), null, page === "home" ? "1.0" : page === "products" ? "0.9" : "0.6");
  }
  for (const { city, type } of cityRows) {
    const qs = `?${new URLSearchParams({ type, city })}`;
    add((l) => `${langPath(l, PAGES.products)}${qs}`, null, "0.7");
  }
  for (const product of products) {
    add((l) => langPath(l, PAGES.products, productSegment(product)), product.updatedAt, "0.8");
  }

  const xmlEscape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const urls = entries.flatMap(({ pathForLang, lastmod, priority }) =>
    Object.keys(LANGS).map((lang) => {
      const alternates = Object.keys(LANGS)
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(base + pathForLang(l))}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(base + pathForLang(DEFAULT_LANG))}"/>`)
        .join("\n");
      return `  <url>\n    <loc>${xmlEscape(base + pathForLang(lang))}</loc>\n${lastmod ? `    <lastmod>${lastmod.toISOString()}</lastmod>\n` : ""}    <priority>${priority}</priority>\n${alternates}\n  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

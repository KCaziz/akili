// Adresses publiques : la langue est le premier segment (/fr/produits, /ar/contact…), ce qui
// permet à Google d'indexer chaque langue séparément. Mêmes règles que server/src/seo/seo.js.

export const LANG_CODES = ["fr", "ar", "en", "tzm"];
export const DEFAULT_LANG = "fr";

// Segments des pages publiques (identiques dans toutes les langues).
export const PAGE_SEGMENTS = ["services", "produits", "galerie", "contact", "vendre", "demande", "simulateur", "favoris"];

export function isLang(value) {
  return LANG_CODES.includes(value);
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function productSegment(product) {
  const slug = slugify(`${product.title} ${product.city}`);
  return slug ? `${slug}-${product.id}` : product.id;
}

export function productPath(product) {
  return `/produits/${productSegment(product)}`;
}

// « appartement-f4-vue-mer-alger-cmabc123 » → « cmabc123 » (les identifiants n'ont pas de tiret).
export function productIdFromSegment(segment) {
  return String(segment || "").split("-").pop();
}

// « /produits » + « ar » → « /ar/produits » ; les liens externes et l'admin sont laissés tels quels.
export function localizePath(path, lang) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("//")) return path;
  const [first] = path.split(/[/?#]/).filter(Boolean);
  if (isLang(first)) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// Même page dans une autre langue : « /fr/produits?type=VENTE » → « /ar/produits?type=VENTE ».
export function switchLangInPath(pathWithSearch, lang) {
  const match = pathWithSearch.match(/^\/([^/?#]+)(.*)$/);
  if (match && isLang(match[1])) return `/${lang}${match[2]}`;
  return localizePath(pathWithSearch, lang);
}

const NEW_PRODUCT_DAYS = 30;

// Séparateur de milliers insécable (U+00A0) et non une espace normale : en arabe (RTL), une
// espace normale découpe « 18 500 000 » en trois nombres réordonnés (« 000 500 18 »).
export function formatAmount(value) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(value)).replace(/ /g, " ");
}

// Prix affiché, traduit (« / mois » selon la langue). Repli sur l'ancien libellé texte.
export function formatProductPrice(product, t) {
  if (!product.priceValue) return product.price;
  const amount = `${formatAmount(product.priceValue)} ${t("common.currency")}`;
  return product.type === "LOCATION" ? `${amount} ${t("common.perMonth")}` : amount;
}

export function isNewProduct(product) {
  const ageMs = Date.now() - new Date(product.createdAt).getTime();
  return ageMs < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

export function productImages(product) {
  if (product.images?.length) return product.images.map((image) => image.url);
  return product.image ? [product.image] : [];
}

// Convertit un lien YouTube/Vimeo en URL d'intégration ; null pour un fichier vidéo direct.
export function videoEmbedUrl(url) {
  if (!url) return null;
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

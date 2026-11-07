// Extrait le montant d'un libellé de prix libre ("18 500 000 DZD", "45 000 DZD / mois").
export function parsePriceValue(label) {
  if (typeof label !== "string") return null;
  const digits = label.replace(/\D/g, "");
  if (!digits || digits.length > 9) return null;
  return Number(digits);
}

export function formatPriceLabel(value, type) {
  const amount = new Intl.NumberFormat("fr-FR").format(value).replace(/ | /g, " ");
  return type === "LOCATION" ? `${amount} DZD / mois` : `${amount} DZD`;
}

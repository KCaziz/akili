const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

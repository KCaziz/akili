// Les photos prises au téléphone pèsent souvent 3 à 8 Mo : on les réduit dans le navigateur avant
// l'envoi (1600 px maximum, format WebP). Pages plus rapides, donc meilleur référencement mobile.
// Aucune dépendance serveur : rien à installer sur l'hébergement.

const MAX_SIDE = 1600;
const QUALITY = 0.82;

export async function compressImage(file) {
  if (!file.type.startsWith("image/") || ["image/gif", "image/svg+xml"].includes(file.type)) return file;
  if (typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    // Navigateur sans WebP, ou image déjà légère : on garde l'original.
    if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}

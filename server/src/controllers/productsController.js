import { prisma } from "../config/prisma.js";

const MEDIA_INCLUDE = { media: { orderBy: { position: "asc" } } };

export async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, include: MEDIA_INCLUDE });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: MEDIA_INCLUDE });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

function validateProductPayload(body) {
  const { title, type, city, price, media } = body ?? {};
  if (!title || !type || !city || !price) {
    return "Titre, type, ville et prix sont requis";
  }
  if (!["VENTE", "LOCATION"].includes(type)) {
    return "Type de bien invalide";
  }
  if (media !== undefined) {
    if (!Array.isArray(media) || media.length > 40) {
      return "Liste de médias invalide (40 maximum)";
    }
    const invalid = media.some(
      (item) => !item || !["PHOTO", "VIDEO"].includes(item.type) || typeof item.url !== "string" || !item.url.trim()
    );
    if (invalid) return "Média invalide";
  }
  return null;
}

function buildProductData(body) {
  const { title, description, type, city, price, surface, rooms } = body;
  const media = (body.media ?? []).map((item, index) => ({ type: item.type, url: item.url.trim(), position: index }));
  const cover = media.find((item) => item.type === "PHOTO");
  return {
    data: { title, description, type, city, price, surface, rooms: rooms ? Number(rooms) : null, image: cover ? cover.url : null },
    media,
  };
}

export async function createProduct(req, res, next) {
  try {
    const error = validateProductPayload(req.body);
    if (error) return res.status(400).json({ error });

    const { data, media } = buildProductData(req.body);
    const product = await prisma.product.create({
      data: { ...data, media: { create: media } },
      include: MEDIA_INCLUDE,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const error = validateProductPayload(req.body);
    if (error) return res.status(400).json({ error });

    const { data, media } = buildProductData(req.body);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...data, media: { deleteMany: {}, create: media } },
      include: MEDIA_INCLUDE,
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

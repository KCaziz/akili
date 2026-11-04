import { prisma } from "../config/prisma.js";
import { formatPriceLabel } from "../utils/price.js";
import { isNonEmptyString } from "../utils/validators.js";

const PRODUCT_INCLUDE = { images: { orderBy: { position: "asc" } } };
const STATUSES = ["DISPONIBLE", "VENDU", "LOUE"];
const SORTS = {
  newest: { createdAt: "desc" },
  price_asc: { priceValue: "asc" },
  price_desc: { priceValue: "desc" },
};

function toPositiveInt(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function buildListQuery(query) {
  const where = {};
  if (["VENTE", "LOCATION"].includes(query.type)) where.type = query.type;
  if (typeof query.city === "string" && query.city.trim()) where.city = { contains: query.city.trim() };

  const minPrice = toPositiveInt(query.minPrice);
  const maxPrice = toPositiveInt(query.maxPrice);
  if (minPrice !== null || maxPrice !== null) {
    where.priceValue = {};
    if (minPrice !== null) where.priceValue.gte = minPrice;
    if (maxPrice !== null) where.priceValue.lte = maxPrice;
  }

  const minRooms = toPositiveInt(query.minRooms);
  if (minRooms) where.rooms = { gte: minRooms };

  if (query.featured === "1") where.isFeatured = true;

  if (typeof query.ids === "string" && query.ids) {
    where.id = { in: query.ids.split(",").slice(0, 100) };
  }

  const orderBy = SORTS[query.sort] || SORTS.newest;
  const take = toPositiveInt(query.limit) || undefined;
  return { where, orderBy, take };
}

export async function listProducts(req, res, next) {
  try {
    const { where, orderBy, take } = buildListQuery(req.query);
    const products = await prisma.product.findMany({ where, orderBy, take, include: PRODUCT_INCLUDE });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function listCities(req, res, next) {
  try {
    const rows = await prisma.product.findMany({ distinct: ["city"], select: { city: true }, orderBy: { city: "asc" } });
    res.json(rows.map((row) => row.city));
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: PRODUCT_INCLUDE });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function recordView(req, res, next) {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { views: { increment: 1 } } });
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Produit introuvable" });
    next(err);
  }
}

function toOptionalNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

function parseProductPayload(body) {
  const { title, description, type, city, surface, rooms, status, videoUrl } = body ?? {};

  if (!isNonEmptyString(title, { maxLength: 191 })) return { error: "Le titre est requis" };
  if (!["VENTE", "LOCATION"].includes(type)) return { error: "Type de bien invalide" };
  if (!isNonEmptyString(city, { maxLength: 191 })) return { error: "La ville est requise" };

  const priceValue = toPositiveInt(body.priceValue);
  if (!priceValue || priceValue > 2_000_000_000) return { error: "Le prix doit être un montant en DZD (nombre entier positif)" };

  const roomCount = toOptionalNumber(rooms);
  if (Number.isNaN(roomCount) || (roomCount !== null && (!Number.isInteger(roomCount) || roomCount < 0))) {
    return { error: "Le nombre de pièces doit être un entier positif" };
  }

  const latitude = toOptionalNumber(body.latitude);
  const longitude = toOptionalNumber(body.longitude);
  if (Number.isNaN(latitude) || Number.isNaN(longitude) || (latitude === null) !== (longitude === null)) {
    return { error: "Position invalide : latitude et longitude doivent être renseignées ensemble" };
  }
  if (latitude !== null && (Math.abs(latitude) > 90 || Math.abs(longitude) > 180)) {
    return { error: "Position hors limites" };
  }

  const finalStatus = status ?? "DISPONIBLE";
  if (!STATUSES.includes(finalStatus)) return { error: "Statut invalide" };

  const images = Array.isArray(body.images) ? body.images.filter((url) => isNonEmptyString(url, { maxLength: 2000 })) : [];

  return {
    data: {
      title: title.trim(),
      description: typeof description === "string" ? description : null,
      type,
      city: city.trim(),
      priceValue,
      price: formatPriceLabel(priceValue, type),
      surface: typeof surface === "string" && surface.trim() ? surface.trim() : null,
      rooms: roomCount,
      status: finalStatus,
      isExclusive: Boolean(body.isExclusive),
      isFeatured: Boolean(body.isFeatured),
      latitude,
      longitude,
      videoUrl: isNonEmptyString(videoUrl, { maxLength: 2000 }) ? videoUrl.trim() : null,
      image: images[0] ?? null,
    },
    images,
  };
}

function imageRows(images) {
  return images.map((url, position) => ({ url, position }));
}

export async function createProduct(req, res, next) {
  try {
    const { error, data, images } = parseProductPayload(req.body);
    if (error) return res.status(400).json({ error });

    const product = await prisma.product.create({
      data: { ...data, images: { create: imageRows(images) } },
      include: PRODUCT_INCLUDE,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { error, data, images } = parseProductPayload(req.body);
    if (error) return res.status(400).json({ error });

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...data, images: { deleteMany: {}, create: imageRows(images) } },
      include: PRODUCT_INCLUDE,
    });
    res.json(product);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Produit introuvable" });
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

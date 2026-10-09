import { prisma } from "../config/prisma.js";

export async function listProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ error: "Produit introuvable" });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

function validateProductPayload(body) {
  const { title, type, city, price } = body ?? {};
  if (!title || !type || !city || !price) {
    return "Titre, type, ville et prix sont requis";
  }
  if (!["VENTE", "LOCATION"].includes(type)) {
    return "Type de bien invalide";
  }
  return null;
}

export async function createProduct(req, res, next) {
  try {
    const error = validateProductPayload(req.body);
    if (error) return res.status(400).json({ error });

    const { title, description, type, city, price, surface, rooms, image } = req.body;
    const product = await prisma.product.create({
      data: { title, description, type, city, price, surface, rooms: rooms ? Number(rooms) : null, image },
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

    const { title, description, type, city, price, surface, rooms, image } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { title, description, type, city, price, surface, rooms: rooms ? Number(rooms) : null, image },
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

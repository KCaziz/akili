import { prisma } from "../config/prisma.js";

export async function createSellOffer(req, res, next) {
  try {
    const { name, phone, propertyType, city, surface, price, description } = req.body ?? {};
    if (!name || !phone || !propertyType || !city) {
      return res.status(400).json({ error: "Nom, téléphone, type de bien et ville sont requis" });
    }
    const offer = await prisma.sellOffer.create({
      data: { name, phone, propertyType, city, surface, price, description },
    });
    res.status(201).json(offer);
  } catch (err) {
    next(err);
  }
}

export async function listSellOffers(req, res, next) {
  try {
    const offers = await prisma.sellOffer.findMany({ orderBy: { createdAt: "desc" } });
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

export async function updateSellOfferStatus(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!["EN_ATTENTE", "TRAITE"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }
    const offer = await prisma.sellOffer.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(offer);
  } catch (err) {
    next(err);
  }
}

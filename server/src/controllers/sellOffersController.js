import { prisma } from "../config/prisma.js";
import { isNonEmptyString, isValidNationalId, isValidAlgerianPhone } from "../utils/validators.js";

export async function createSellOffer(req, res, next) {
  try {
    const { name, nationalId, phone, propertyType, city, surface, price, description } = req.body ?? {};
    if (!isNonEmptyString(name, { maxLength: 191 })) {
      return res.status(400).json({ error: "Le nom complet est requis" });
    }
    if (!isValidNationalId(nationalId)) {
      return res.status(400).json({ error: "Le numéro d'identification national doit comporter exactement 18 chiffres" });
    }
    if (!isValidAlgerianPhone(phone)) {
      return res.status(400).json({ error: "Le téléphone doit être un numéro algérien valide (ex. 0551234567)" });
    }
    if (!isNonEmptyString(propertyType, { maxLength: 191 }) || !isNonEmptyString(city, { maxLength: 191 })) {
      return res.status(400).json({ error: "Le type de bien et la ville sont requis" });
    }
    const offer = await prisma.sellOffer.create({
      data: {
        name: name.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        propertyType,
        city: city.trim(),
        surface: surface || null,
        price: price || null,
        description: description || null,
      },
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

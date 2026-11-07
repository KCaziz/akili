import { prisma } from "../config/prisma.js";
import { isNonEmptyString, isValidContact } from "../utils/validators.js";

function toOptionalPositiveInt(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : NaN;
}

export async function createAlert(req, res, next) {
  try {
    const { name, contact, type, city } = req.body ?? {};
    if (!isNonEmptyString(name, { maxLength: 191 })) return res.status(400).json({ error: "Le nom est requis" });
    if (!isValidContact(contact)) {
      return res.status(400).json({ error: "Le contact doit être un numéro algérien (ex. 0551234567) ou un e-mail valide" });
    }
    if (type && !["VENTE", "LOCATION"].includes(type)) return res.status(400).json({ error: "Type invalide" });

    const maxBudget = toOptionalPositiveInt(req.body.maxBudget);
    const minRooms = toOptionalPositiveInt(req.body.minRooms);
    if (Number.isNaN(maxBudget) || Number.isNaN(minRooms)) {
      return res.status(400).json({ error: "Budget et nombre de pièces doivent être des nombres entiers positifs" });
    }

    const alert = await prisma.searchAlert.create({
      data: {
        name: name.trim(),
        contact: contact.trim(),
        type: type || null,
        city: isNonEmptyString(city, { maxLength: 191 }) ? city.trim() : null,
        maxBudget,
        minRooms,
      },
    });
    res.status(201).json({ id: alert.id });
  } catch (err) {
    next(err);
  }
}

// Biens publiés après la création de l'alerte et correspondant à ses critères.
function matchWhere(alert) {
  const where = { createdAt: { gt: alert.createdAt }, status: "DISPONIBLE" };
  if (alert.type) where.type = alert.type;
  if (alert.city) where.city = { contains: alert.city };
  if (alert.maxBudget) where.priceValue = { lte: alert.maxBudget };
  if (alert.minRooms) where.rooms = { gte: alert.minRooms };
  return where;
}

export async function listAlerts(req, res, next) {
  try {
    const alerts = await prisma.searchAlert.findMany({ orderBy: { createdAt: "desc" } });
    const withMatches = await Promise.all(
      alerts.map(async (alert) => ({
        ...alert,
        matches: alert.isActive
          ? await prisma.product.findMany({
              where: matchWhere(alert),
              select: { id: true, title: true, city: true, price: true },
              orderBy: { createdAt: "desc" },
              take: 10,
            })
          : [],
      })),
    );
    res.json(withMatches);
  } catch (err) {
    next(err);
  }
}

export async function updateAlert(req, res, next) {
  try {
    const { isActive } = req.body ?? {};
    if (typeof isActive !== "boolean") return res.status(400).json({ error: "isActive doit être un booléen" });
    res.json(await prisma.searchAlert.update({ where: { id: req.params.id }, data: { isActive } }));
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Alerte introuvable" });
    next(err);
  }
}

export async function deleteAlert(req, res, next) {
  try {
    await prisma.searchAlert.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

import { prisma } from "../config/prisma.js";
import { isNonEmptyString, isValidNationalId, isValidContact } from "../utils/validators.js";

export async function createRequest(req, res, next) {
  try {
    const { name, nationalId, contact, type, details } = req.body ?? {};
    if (!isNonEmptyString(name, { maxLength: 191 })) {
      return res.status(400).json({ error: "Le nom complet est requis" });
    }
    if (!isValidNationalId(nationalId)) {
      return res.status(400).json({ error: "Le numéro d'identification national doit comporter exactement 18 chiffres" });
    }
    if (!isValidContact(contact)) {
      return res.status(400).json({ error: "Le contact doit être un numéro de téléphone algérien (ex. 0551234567) ou une adresse e-mail valide" });
    }
    if (!["PRODUIT", "SERVICE"].includes(type)) {
      return res.status(400).json({ error: "Type de demande invalide" });
    }
    if (!isNonEmptyString(details, { maxLength: 5000 })) {
      return res.status(400).json({ error: "Le détail de la demande est requis (5000 caractères maximum)" });
    }
    const request = await prisma.clientRequest.create({
      data: { name: name.trim(), nationalId: nationalId.trim(), contact: contact.trim(), type, details: details.trim() },
    });
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function listRequests(req, res, next) {
  try {
    const requests = await prisma.clientRequest.findMany({ orderBy: { createdAt: "desc" } });
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

export async function updateRequestStatus(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!["EN_ATTENTE", "TRAITE"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }
    const request = await prisma.clientRequest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(request);
  } catch (err) {
    next(err);
  }
}

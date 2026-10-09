import { prisma } from "../config/prisma.js";

export async function createRequest(req, res, next) {
  try {
    const { name, contact, type, details } = req.body ?? {};
    if (!name || !contact || !type || !details) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    if (!["PRODUIT", "SERVICE"].includes(type)) {
      return res.status(400).json({ error: "Type de demande invalide" });
    }
    const request = await prisma.clientRequest.create({
      data: { name, contact, type, details },
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

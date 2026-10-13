import { prisma } from "../config/prisma.js";

export async function listServices(req, res, next) {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const { title, description } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: "Titre requis" });
    }
    const service = await prisma.service.create({ data: { title, description } });
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const { title, description } = req.body ?? {};
    if (!title) {
      return res.status(400).json({ error: "Titre requis" });
    }
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { title, description },
    });
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    await prisma.service.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

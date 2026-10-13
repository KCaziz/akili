import { prisma } from "../config/prisma.js";

export async function listMedia(req, res, next) {
  try {
    const media = await prisma.galleryMedia.findMany({ orderBy: { createdAt: "desc" } });
    res.json(media);
  } catch (err) {
    next(err);
  }
}

export async function createMedia(req, res, next) {
  try {
    const { type, url, caption } = req.body ?? {};
    if (!type || !url) {
      return res.status(400).json({ error: "Type et URL requis" });
    }
    if (!["PHOTO", "VIDEO"].includes(type)) {
      return res.status(400).json({ error: "Type de média invalide" });
    }
    const media = await prisma.galleryMedia.create({ data: { type, url, caption } });
    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    await prisma.galleryMedia.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

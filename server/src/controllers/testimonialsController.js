import { prisma } from "../config/prisma.js";
import { isNonEmptyString } from "../utils/validators.js";

export async function listPublishedTestimonials(req, res, next) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(testimonials);
  } catch (err) {
    next(err);
  }
}

export async function listAllTestimonials(req, res, next) {
  try {
    res.json(await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }));
  } catch (err) {
    next(err);
  }
}

function parseTestimonial(body) {
  const { name, city, text, rating, isPublished } = body ?? {};
  if (!isNonEmptyString(name, { maxLength: 191 })) return { error: "Le nom est requis" };
  if (!isNonEmptyString(text, { maxLength: 2000 })) return { error: "Le texte de l'avis est requis (2000 caractères maximum)" };
  const score = Number(rating ?? 5);
  if (!Number.isInteger(score) || score < 1 || score > 5) return { error: "La note doit être comprise entre 1 et 5" };
  return {
    data: {
      name: name.trim(),
      city: isNonEmptyString(city, { maxLength: 191 }) ? city.trim() : null,
      text: text.trim(),
      rating: score,
      isPublished: isPublished !== false,
    },
  };
}

export async function createTestimonial(req, res, next) {
  try {
    const { error, data } = parseTestimonial(req.body);
    if (error) return res.status(400).json({ error });
    res.status(201).json(await prisma.testimonial.create({ data }));
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req, res, next) {
  try {
    const { error, data } = parseTestimonial(req.body);
    if (error) return res.status(400).json({ error });
    res.json(await prisma.testimonial.update({ where: { id: req.params.id }, data }));
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Avis introuvable" });
    next(err);
  }
}

export async function deleteTestimonial(req, res, next) {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

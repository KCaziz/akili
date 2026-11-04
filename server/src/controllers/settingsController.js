import { prisma } from "../config/prisma.js";

// Seules ces clés sont lisibles publiquement et modifiables depuis l'admin.
const SETTINGS = {
  yearsExperience: /^\d{0,4}$/,
  propertiesSold: /^\d{0,7}$/,
  clientsServed: /^\d{0,7}$/,
  whatsappNumber: /^(\d{8,15})?$/,
};

async function readSettings() {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(SETTINGS) } } });
  const settings = Object.fromEntries(Object.keys(SETTINGS).map((key) => [key, ""]));
  for (const row of rows) settings[row.key] = row.value;
  return settings;
}

export async function getSettings(req, res, next) {
  try {
    res.json(await readSettings());
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updates = [];
    for (const [key, pattern] of Object.entries(SETTINGS)) {
      if (!(key in (req.body ?? {}))) continue;
      const value = String(req.body[key] ?? "").replace(/[\s+]/g, "");
      if (!pattern.test(value)) {
        return res.status(400).json({ error: `Valeur invalide pour « ${key} »` });
      }
      updates.push(prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } }));
    }
    await prisma.$transaction(updates);
    res.json(await readSettings());
  } catch (err) {
    next(err);
  }
}

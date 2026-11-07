import { prisma } from "../config/prisma.js";
import { agencyAddress, mailEnabled, sendMail, verifyMailer } from "../services/mailer.js";

// Seules ces clés sont lisibles publiquement et modifiables depuis l'admin.
const SETTINGS = {
  yearsExperience: /^\d{0,4}$/,
  propertiesSold: /^\d{0,7}$/,
  clientsServed: /^\d{0,7}$/,
  whatsappNumber: /^(\d{8,15})?$/,
  contactEmail: /^([^\s@]+@[^\s@]+\.[^\s@]+)?$/,
};

// Valeur utilisée tant que la clé n’a jamais été enregistrée (une valeur vide enregistrée reste vide).
const DEFAULTS = { contactEmail: "contact@akili-immobilier.com" };

// Clés numériques : on retire espaces et « + » saisis par confort (« +213 55… »).
const NUMERIC_KEYS = new Set(["yearsExperience", "propertiesSold", "clientsServed", "whatsappNumber"]);

async function readSettings() {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: Object.keys(SETTINGS) } } });
  const settings = Object.fromEntries(Object.keys(SETTINGS).map((key) => [key, DEFAULTS[key] ?? ""]));
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
      const raw = String(req.body[key] ?? "");
      const value = NUMERIC_KEYS.has(key) ? raw.replace(/[\s+]/g, "") : raw.trim();
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

// Vérifie la configuration SMTP depuis l'admin (pas d'accès terminal sur l'hébergement).
export async function sendTestEmail(req, res) {
  if (!mailEnabled) {
    return res.status(400).json({
      error: "L'envoi d'e-mails n'est pas configuré sur le serveur (variables SMTP_HOST, SMTP_USER, SMTP_PASS manquantes).",
    });
  }
  try {
    await verifyMailer();
    await sendMail({
      to: agencyAddress,
      subject: "Akili Immobilier — e-mail de test",
      text: "Si vous lisez ce message, l'envoi d'e-mails du site fonctionne : vous recevrez ici les nouvelles demandes, offres de vente et alertes.",
    });
    res.json({ sentTo: agencyAddress });
  } catch (err) {
    res.status(502).json({ error: `Échec de l'envoi : ${err.message}` });
  }
}

import { prisma } from "../config/prisma.js";
import { agencyAddress, mailEnabled, sendMail, verifyMailer } from "../services/mailer.js";

// Seules ces clés sont lisibles publiquement et modifiables depuis l'admin.
const SETTINGS = {
  yearsExperience: /^\d{0,4}$/,
  propertiesSold: /^\d{0,7}$/,
  clientsServed: /^\d{0,7}$/,
  whatsappNumber: /^(\d{8,15})?$/,
  contactEmail: /^([^\s@]+@[^\s@]+\.[^\s@]+)?$/,
  // Adresse de l'agence (référencement local : Google, données structurées, page Contact).
  address: /^[^<>]{0,300}$/,
  facebookUrl: /^(https:\/\/(www\.|m\.|web\.)?facebook\.com\/\S{1,200})?$/,
  instagramUrl: /^(https:\/\/(www\.)?instagram\.com\/\S{1,200})?$/,
  // Identifiant de mesure Google Analytics 4 (« G-XXXXXXXXXX »).
  gaMeasurementId: /^(G-[A-Z0-9]{4,15})?$/,
};

// Libellés des erreurs affichées dans l'admin.
const LABELS = {
  yearsExperience: "années d'expérience (nombre)",
  propertiesSold: "biens vendus (nombre)",
  clientsServed: "clients accompagnés (nombre)",
  whatsappNumber: "numéro WhatsApp (8 à 15 chiffres, ex. 213551234567)",
  contactEmail: "adresse e-mail",
  address: "adresse de l'agence (300 caractères maximum)",
  facebookUrl: "page Facebook (lien https://www.facebook.com/…)",
  instagramUrl: "compte Instagram (lien https://www.instagram.com/…)",
  gaMeasurementId: "identifiant Google Analytics (format G-XXXXXXXXXX)",
};

// Valeur utilisée tant que la clé n’a jamais été enregistrée (une valeur vide enregistrée reste vide).
const DEFAULTS = { contactEmail: "contact@akili-immobilier.com" };

// Clés numériques : on retire espaces et « + » saisis par confort (« +213 55… »).
const NUMERIC_KEYS = new Set(["yearsExperience", "propertiesSold", "clientsServed", "whatsappNumber"]);

export async function readSettings() {
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
      let value = NUMERIC_KEYS.has(key) ? raw.replace(/[\s+]/g, "") : raw.trim();
      if (key === "gaMeasurementId") value = value.toUpperCase();
      if (!pattern.test(value)) {
        return res.status(400).json({ error: `Valeur invalide : ${LABELS[key] || key}` });
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

import { agencyAddress, sendInBackground } from "./mailer.js";
import { isValidEmail } from "../utils/validators.js";

const SITE_URL = (process.env.PUBLIC_URL || process.env.CORS_ORIGIN || "").replace(/\/$/, "");
const CONTACT_PREFIX = "[Message de contact]";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function layout(innerHtml, dir = "ltr") {
  return `<!doctype html><html dir="${dir}"><body style="margin:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1d2b2c">
<div style="max-width:560px;margin:0 auto;padding:24px">
  <div style="background:#0f3d3e;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;font-size:20px;font-weight:bold">
    Akili <span style="color:#e3a846">Immobilier</span>
  </div>
  <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;line-height:1.55">${innerHtml}</div>
</div></body></html>`;
}

// ---------------------------------------------------------------- Notifications agence (français)

function fieldsTable(fields) {
  const rows = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#5b6b6c;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%">${rows}</table>`;
}

function fieldsText(fields) {
  return fields
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([label, value]) => `${label} : ${value}`)
    .join("\n");
}

function notifyAgency({ subject, intro, fields, adminPath, replyTo }) {
  const adminUrl = SITE_URL ? `${SITE_URL}${adminPath}` : "";
  const button = adminUrl
    ? `<p style="margin-top:22px"><a href="${adminUrl}" style="background:#e3a846;color:#1d2b2c;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Ouvrir dans l'admin</a></p>`
    : "";
  sendInBackground(subject, {
    to: agencyAddress,
    subject,
    replyTo,
    text: `${intro}\n\n${fieldsText(fields)}${adminUrl ? `\n\nAdmin : ${adminUrl}` : ""}`,
    html: layout(`<p style="margin-top:0"><strong>${escapeHtml(intro)}</strong></p>${fieldsTable(fields)}${button}
      ${replyTo ? `<p style="color:#5b6b6c;font-size:13px;margin-top:18px">Répondez directement à cet e-mail pour écrire à ${escapeHtml(replyTo)}.</p>` : ""}`),
  });
}

// ---------------------------------------------------------------- Accusés de réception (langue du visiteur)

const ACK = {
  fr: {
    subject: "Nous avons bien reçu votre {{what}}",
    what: { request: "demande", contact: "message", offer: "proposition de vente", alert: "alerte" },
    hello: "Bonjour {{name}},",
    body: {
      request: "Merci pour votre demande. Un conseiller Akili l'étudie et vous recontacte rapidement.",
      contact: "Merci pour votre message. Nous vous répondrons dans les meilleurs délais.",
      offer: "Merci d'avoir proposé votre bien. Un conseiller Akili vous recontacte pour en parler et organiser une estimation.",
      alert: "Votre alerte est enregistrée : nous vous préviendrons dès qu'un bien correspondant à votre recherche sera publié.",
    },
    summary: "Votre message :",
    signature: "L'équipe Akili Immobilier",
    noReply: "Pour toute précision, répondez simplement à cet e-mail.",
  },
  en: {
    subject: "We have received your {{what}}",
    what: { request: "request", contact: "message", offer: "property listing", alert: "alert" },
    hello: "Hello {{name}},",
    body: {
      request: "Thank you for your request. An Akili advisor is reviewing it and will get back to you shortly.",
      contact: "Thank you for your message. We will reply as soon as possible.",
      offer: "Thank you for offering your property. An Akili advisor will contact you to discuss it and arrange a valuation.",
      alert: "Your alert has been saved: we will let you know as soon as a matching property is listed.",
    },
    summary: "Your message:",
    signature: "The Akili Immobilier team",
    noReply: "If you have any questions, simply reply to this email.",
  },
  ar: {
    subject: "لقد استلمنا {{what}}",
    what: { request: "طلبك", contact: "رسالتك", offer: "عرض البيع الخاص بك", alert: "تنبيهك" },
    hello: "مرحباً {{name}}،",
    body: {
      request: "شكراً على طلبك. يقوم أحد مستشاري أكيلي بدراسته وسيتواصل معك قريباً.",
      contact: "شكراً على رسالتك. سنرد عليك في أقرب وقت ممكن.",
      offer: "شكراً لعرض عقارك. سيتواصل معك أحد مستشاري أكيلي لمناقشته وتحديد موعد للتقييم.",
      alert: "تم تسجيل تنبيهك: سنعلمك فور نشر عقار يطابق بحثك.",
    },
    summary: "رسالتك:",
    signature: "فريق أكيلي العقارية",
    noReply: "لأي استفسار، يكفي الرد على هذا البريد.",
  },
  tzm: {
    subject: "Nermes {{what}}",
    what: { request: "asuter-ik", contact: "izen-ik", offer: "asumer-ik n uznuz", alert: "alɣu-ik" },
    hello: "Azul {{name}},",
    body: {
      request: "Tanemmirt ɣef usuter-ik. Yiwen seg imeswaḍen n Akili ad t-yesmuqel, ad k-id-yessiwel s zzerb.",
      contact: "Tanemmirt ɣef yizen-ik. Ad k-d-nerr s zzerb.",
      offer: "Tanemmirt imi d-tessumreḍ axxam-ik. Yiwen seg imeswaḍen n Akili ad k-id-yessiwel akken ad tmeslayem fell-as.",
      alert: "Alɣu-ik yettwasekles : ad k-nessaɣ mi ara d-yeffeɣ wexxam i yemṣadan d unadi-ik.",
    },
    summary: "Izen-ik :",
    signature: "Tarbaɛt n Akili Immobilier",
    noReply: "I yal asteqsi, err kan ɣef yimayl-a.",
  },
};

function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");
}

function acknowledge({ to, name, kind, lang, summary }) {
  if (!isValidEmail(to)) return;
  const t = ACK[lang] || ACK.fr;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const subject = `Akili Immobilier — ${fill(t.subject, { what: t.what[kind] })}`;
  const hello = fill(t.hello, { name });
  const summaryHtml = summary
    ? `<p style="color:#5b6b6c;margin-bottom:4px">${escapeHtml(t.summary)}</p>
       <blockquote style="margin:0;padding:10px 14px;background:#f4f1ea;border-radius:8px;white-space:pre-wrap">${escapeHtml(summary)}</blockquote>`
    : "";
  const site = SITE_URL ? `<p><a href="${SITE_URL}" style="color:#0f3d3e">${escapeHtml(SITE_URL.replace(/^https?:\/\//, ""))}</a></p>` : "";

  sendInBackground(`accusé ${kind}`, {
    to: to.trim(),
    subject,
    text: `${hello}\n\n${t.body[kind]}\n\n${summary ? `${t.summary}\n${summary}\n\n` : ""}${t.noReply}\n\n${t.signature}${SITE_URL ? `\n${SITE_URL}` : ""}`,
    html: layout(
      `<p style="margin-top:0">${escapeHtml(hello)}</p><p>${escapeHtml(t.body[kind])}</p>${summaryHtml}
       <p style="margin-top:18px">${escapeHtml(t.noReply)}</p><p><strong>${escapeHtml(t.signature)}</strong></p>${site}`,
      dir,
    ),
  });
}

// ---------------------------------------------------------------- Points d'entrée

export function onNewRequest(request, lang) {
  const isContact = request.details.startsWith(CONTACT_PREFIX);
  const details = isContact ? request.details.slice(CONTACT_PREFIX.length).trim() : request.details;
  const replyTo = isValidEmail(request.contact) ? request.contact : undefined;

  notifyAgency({
    subject: isContact ? `Nouveau message de contact — ${request.name}` : `Nouvelle demande (${request.type === "PRODUIT" ? "bien" : "service"}) — ${request.name}`,
    intro: isContact ? "Un visiteur a envoyé un message depuis la page Contact." : "Une nouvelle demande a été envoyée depuis le site.",
    fields: [
      ["Nom", request.name],
      ["Contact", request.contact],
      ["NIN", request.nationalId],
      ["Type", request.type === "PRODUIT" ? "Bien" : "Service"],
      ["Message", details],
    ],
    adminPath: "/admin/demandes",
    replyTo,
  });

  acknowledge({ to: request.contact, name: request.name, kind: isContact ? "contact" : "request", lang, summary: details });
}

export function onNewSellOffer(offer, lang) {
  notifyAgency({
    subject: `Nouvelle offre de vente — ${offer.propertyType} à ${offer.city}`,
    intro: "Un propriétaire propose un bien via la page « Vendre ».",
    fields: [
      ["Nom", offer.name],
      ["Téléphone", offer.phone],
      ["E-mail", offer.email],
      ["NIN", offer.nationalId],
      ["Type de bien", offer.propertyType],
      ["Ville", offer.city],
      ["Surface", offer.surface],
      ["Prix souhaité", offer.price],
      ["Description", offer.description],
    ],
    adminPath: "/admin/offres",
    replyTo: offer.email || undefined,
  });

  acknowledge({ to: offer.email, name: offer.name, kind: "offer", lang, summary: `${offer.propertyType} — ${offer.city}` });
}

export function onNewAlert(alert, lang) {
  const criteria = [
    alert.type === "VENTE" ? "Vente" : alert.type === "LOCATION" ? "Location" : null,
    alert.city,
    alert.maxBudget ? `budget max ${alert.maxBudget} DZD` : null,
    alert.minRooms ? `${alert.minRooms} pièces min.` : null,
  ]
    .filter(Boolean)
    .join(" · ") || "Tous les biens";

  notifyAgency({
    subject: `Nouvelle alerte visiteur — ${alert.name}`,
    intro: "Un visiteur souhaite être prévenu des nouveaux biens correspondant à sa recherche.",
    fields: [
      ["Nom", alert.name],
      ["Contact", alert.contact],
      ["Critères", criteria],
    ],
    adminPath: "/admin/alertes",
    replyTo: isValidEmail(alert.contact) ? alert.contact : undefined,
  });

  acknowledge({ to: alert.contact, name: alert.name, kind: "alert", lang });
}

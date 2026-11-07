import "dotenv/config";
import nodemailer from "nodemailer";

// Envoi d'e-mails via le SMTP de la boîte cPanel (ex. contact@akili-immobilier.com).
// Variables (.env ou UI cPanel) :
//   SMTP_HOST   ex. mail.akili-immobilier.com
//   SMTP_PORT   465 (SSL, par défaut) ou 587 (STARTTLS)
//   SMTP_USER   adresse complète de la boîte
//   SMTP_PASS   mot de passe de la boîte
//   MAIL_TO     destinataire des notifications (par défaut : SMTP_USER)
// Sans SMTP_HOST/SMTP_USER/SMTP_PASS, les e-mails sont simplement désactivés : le site
// fonctionne comme avant (les demandes restent visibles dans l'admin).

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const port = Number(process.env.SMTP_PORT) || 465;

export const mailEnabled = Boolean(host && user && pass);
export const agencyAddress = process.env.MAIL_TO || user;

const transporter = mailEnabled
  ? nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    })
  : null;

if (!mailEnabled) {
  console.log("[mail] SMTP non configuré (SMTP_HOST/SMTP_USER/SMTP_PASS) : envoi d'e-mails désactivé.");
}

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (!transporter) return false;
  await transporter.sendMail({
    from: { name: "Akili Immobilier", address: user },
    to,
    subject,
    text,
    html,
    replyTo,
  });
  return true;
}

// Les e-mails partent en arrière-plan : une panne SMTP ne doit jamais faire échouer
// l'enregistrement d'une demande (elle est déjà en base et visible dans l'admin).
export function sendInBackground(label, message) {
  if (!transporter) return;
  sendMail(message).catch((err) => console.error(`[mail] échec « ${label} » : ${err.message}`));
}

export async function verifyMailer() {
  if (!transporter) return false;
  await transporter.verify();
  return true;
}

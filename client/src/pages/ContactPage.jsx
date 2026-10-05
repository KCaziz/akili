import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

const WHATSAPP_NUMBER = "213000000000"; // placeholder — à remplacer par le vrai numéro de l'agence

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // Squelette uniquement : aucun envoi réel n'est fait pour le moment (Phase 2).
    setSubmitted(true);
  }

  return (
    <Container className="section">
      <h1>Contactez-nous</h1>
      <p className="lead">Une question ? Écrivez-nous ou contactez-nous directement sur WhatsApp.</p>

      <div className="contact-grid">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Nom complet
            <input type="text" name="name" required />
          </label>
          <label>
            E-mail
            <input type="email" name="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required />
          </label>
          <Button type="submit">Envoyer</Button>
          {submitted && (
            <p className="notice">
              Ceci est un squelette de démonstration : le message n'est pas encore envoyé réellement.
              L'envoi par e-mail sera activé en Phase 2.
            </p>
          )}
        </form>

        <div className="whatsapp-box">
          <h3>Discuter sur WhatsApp</h3>
          <p>Contactez directement un conseiller Akili.</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
          >
            Ouvrir WhatsApp
          </a>
        </div>
      </div>
    </Container>
  );
}

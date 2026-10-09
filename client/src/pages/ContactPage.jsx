import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createClientRequest } from "../lib/api";

const WHATSAPP_NUMBER = "213783940376";

const initialState = { name: "", email: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      await createClientRequest({
        name: form.name,
        contact: form.email,
        type: "SERVICE",
        details: `[Message de contact] ${form.message}`,
      });
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>Contactez-nous</h1>
      <p className="lead">Une question ? Écrivez-nous ou contactez-nous directement sur WhatsApp.</p>

      <div className="contact-grid">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Nom complet
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            E-mail
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
          </label>
          <Button type="submit">{status === "loading" ? "Envoi…" : "Envoyer"}</Button>
          {status === "success" && (
            <p className="notice">
              Votre message a bien été envoyé et sera traité par un conseiller Akili. (Notification
              par e-mail à l'équipe non encore activée — un fournisseur d'envoi reste à choisir.)
            </p>
          )}
          {status === "error" && <p className="error">{error}</p>}
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

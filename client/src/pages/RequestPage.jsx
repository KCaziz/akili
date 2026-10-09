import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createClientRequest } from "../lib/api";

const initialState = { name: "", contact: "", type: "", details: "" };

export default function RequestPage() {
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
      await createClientRequest(form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>Formuler une demande</h1>
      <p className="lead">
        Vous recherchez un bien ou un service particulier ? Décrivez votre besoin, un conseiller
        Akili vous recontactera.
      </p>

      <form className="form form-wide" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nom complet
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Téléphone ou e-mail
            <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Type de demande
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="" disabled>Choisir un type</option>
            <option value="PRODUIT">Un produit (bien immobilier)</option>
            <option value="SERVICE">Un service de l'agence</option>
          </select>
        </label>

        <label>
          Détail de la demande
          <textarea
            name="details"
            rows={6}
            value={form.details}
            onChange={handleChange}
            placeholder="Ex : je recherche un F3 à Alger, budget max 20 000 000 DZD"
            required
          />
        </label>

        <Button type="submit">{status === "loading" ? "Envoi…" : "Envoyer ma demande"}</Button>

        {status === "success" && (
          <p className="notice">Votre demande a bien été envoyée. Un conseiller Akili vous recontactera prochainement.</p>
        )}
        {status === "error" && <p className="error">{error}</p>}
      </form>
    </Container>
  );
}

import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createSellOffer } from "../lib/api";

const initialState = { name: "", phone: "", propertyType: "", city: "", surface: "", price: "", description: "" };

export default function SellPage() {
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
      await createSellOffer(form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>Vendre un bien</h1>
      <p className="lead">
        Vous souhaitez proposer un bien à la vente ? Remplissez ce formulaire, un conseiller
        Akili vous recontactera.
      </p>

      <form className="form form-wide" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nom complet
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Téléphone
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Type de bien
          <select name="propertyType" value={form.propertyType} onChange={handleChange} required>
            <option value="" disabled>Choisir un type</option>
            <option value="Appartement">Appartement</option>
            <option value="Villa">Villa</option>
            <option value="Terrain">Terrain</option>
            <option value="Local commercial">Local commercial</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Ville
            <input type="text" name="city" value={form.city} onChange={handleChange} required />
          </label>
          <label>
            Surface (m²)
            <input type="text" name="surface" value={form.surface} onChange={handleChange} />
          </label>
        </div>

        <label>
          Prix souhaité
          <input type="text" name="price" value={form.price} onChange={handleChange} placeholder="Ex : 12 000 000 DZD" />
        </label>

        <label>
          Description du bien
          <textarea name="description" rows={5} value={form.description} onChange={handleChange} />
        </label>

        <Button type="submit">{status === "loading" ? "Envoi…" : "Envoyer mon offre"}</Button>

        {status === "success" && (
          <p className="notice">Votre offre a bien été envoyée. Un conseiller Akili vous recontactera prochainement.</p>
        )}
        {status === "error" && <p className="error">{error}</p>}
      </form>
    </Container>
  );
}

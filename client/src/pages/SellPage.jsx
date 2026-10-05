import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // Squelette uniquement : aucune sauvegarde réelle pour le moment (Phase 2).
    setSubmitted(true);
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
            <input type="text" name="name" required />
          </label>
          <label>
            Téléphone
            <input type="tel" name="phone" required />
          </label>
        </div>

        <label>
          Type de bien
          <select name="type" defaultValue="">
            <option value="" disabled>Choisir un type</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="terrain">Terrain</option>
            <option value="local">Local commercial</option>
          </select>
        </label>

        <div className="form-row">
          <label>
            Ville
            <input type="text" name="city" required />
          </label>
          <label>
            Surface (m²)
            <input type="number" name="surface" min="0" />
          </label>
        </div>

        <label>
          Prix souhaité
          <input type="text" name="price" placeholder="Ex : 12 000 000 DZD" />
        </label>

        <label>
          Description du bien
          <textarea name="description" rows={5} />
        </label>

        <Button type="submit">Envoyer mon offre</Button>

        {submitted && (
          <p className="notice">
            Ceci est un squelette de démonstration : l'offre n'est pas encore enregistrée
            réellement. L'enregistrement en base sera activé en Phase 2.
          </p>
        )}
      </form>
    </Container>
  );
}

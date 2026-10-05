import { useState } from "react";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    // Squelette uniquement : aucune sauvegarde réelle pour le moment (Phase 2).
    setSubmitted(true);
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
            <input type="text" name="name" required />
          </label>
          <label>
            Téléphone ou e-mail
            <input type="text" name="contact" required />
          </label>
        </div>

        <label>
          Type de demande
          <select name="requestType" defaultValue="">
            <option value="" disabled>Choisir un type</option>
            <option value="produit">Un produit (bien immobilier)</option>
            <option value="service">Un service de l'agence</option>
          </select>
        </label>

        <label>
          Détail de la demande
          <textarea name="details" rows={6} placeholder="Ex : je recherche un F3 à Alger, budget max 20 000 000 DZD" required />
        </label>

        <Button type="submit">Envoyer ma demande</Button>

        {submitted && (
          <p className="notice">
            Ceci est un squelette de démonstration : la demande n'est pas encore enregistrée
            réellement. L'enregistrement en base sera activé en Phase 2.
          </p>
        )}
      </form>
    </Container>
  );
}

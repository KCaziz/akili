import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    // Squelette uniquement : pas d'authentification réelle pour le moment (Phase 3).
    setError(null);
    navigate("/admin");
  }

  return (
    <div className="admin-login">
      <Container className="admin-login-box">
        <h1>Espace Admin</h1>
        <p className="muted">Connexion réservée à l'équipe Akili.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Identifiant
            <input type="text" name="username" required />
          </label>
          <label>
            Mot de passe
            <input type="password" name="password" required />
          </label>
          <Button type="submit">Se connecter</Button>
        </form>

        <p className="notice">
          Ceci est un squelette de démonstration : aucune authentification réelle n'est
          vérifiée pour le moment. La sécurisation sera mise en place en Phase 3.
        </p>
        {error && <p className="error">{error}</p>}
      </Container>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, status } = useAdminAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (status === "authenticated") {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.username, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <Container className="admin-login-box">
        <h1>Espace Admin</h1>
        <p className="muted">Connexion réservée à l'équipe Akili.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Identifiant
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Mot de passe
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <Button type="submit">{loading ? "Connexion…" : "Se connecter"}</Button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="notice">
          Démonstration : identifiant <code>admin</code>, mot de passe <code>akili2026</code>
          — à changer avant toute mise en production réelle.
        </p>
      </Container>
    </div>
  );
}

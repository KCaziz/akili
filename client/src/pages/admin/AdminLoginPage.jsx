import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
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
      <div className="admin-login-visual">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
          alt=""
        />
        <div className="admin-login-visual-overlay">
          <span className="admin-brand-logo admin-brand-logo-lg">A</span>
          <h2>Akili Immobilier</h2>
          <p>Gérez vos biens, vos services et les demandes de vos clients depuis un seul espace.</p>
        </div>
      </div>

      <div className="admin-login-panel">
        <div className="admin-login-box">
          <h1>Connexion</h1>
          <p className="muted">Accès réservé à l'équipe Akili.</p>

          <form className="form admin-login-form" onSubmit={handleSubmit}>
            <label>
              Identifiant
              <input type="text" name="username" value={form.username} onChange={handleChange} autoComplete="username" required />
            </label>
            <label>
              Mot de passe
              <input type="password" name="password" value={form.password} onChange={handleChange} autoComplete="current-password" required />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <Link to="/" className="admin-login-back">&larr; Retour au site</Link>
        </div>
      </div>
    </div>
  );
}

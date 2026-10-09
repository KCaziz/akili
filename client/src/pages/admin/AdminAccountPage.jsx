import { useState } from "react";
import Button from "../../components/ui/Button";
import { changePassword } from "../../lib/api";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminAccountPage() {
  const { admin } = useAdminAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (form.newPassword !== form.confirmPassword) {
      setError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setStatus("loading");
    try {
      await changePassword(form.currentPassword, form.newPassword);
      setStatus("success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Mon compte</h1>
      <p className="muted">Connecté en tant que <strong>{admin?.username}</strong>.</p>

      <form className="form" onSubmit={handleSubmit} style={{ marginTop: 24, maxWidth: 420 }}>
        <h3 style={{ margin: 0 }}>Changer le mot de passe</h3>
        <label>
          Mot de passe actuel
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        </label>
        <label>
          Nouveau mot de passe
          <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} minLength={8} required />
        </label>
        <label>
          Confirmer le nouveau mot de passe
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} minLength={8} required />
        </label>
        <Button type="submit">{status === "loading" ? "Enregistrement…" : "Changer le mot de passe"}</Button>

        {status === "success" && <p className="notice">Mot de passe changé avec succès.</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

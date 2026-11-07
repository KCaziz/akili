import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { fetchSettings, updateSettings, sendTestEmail } from "../../lib/api";

const FIELDS = [
  { key: "yearsExperience", label: "Années d'expérience" },
  { key: "propertiesSold", label: "Biens vendus" },
  { key: "clientsServed", label: "Clients accompagnés" },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [mailTest, setMailTest] = useState({ status: "idle", message: "" });

  useEffect(() => {
    fetchSettings()
      .then(setForm)
      .catch((err) => setError(err.message));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus("idle");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setStatus("saving");
    try {
      setForm(await updateSettings(form));
      setStatus("saved");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  async function handleTestEmail() {
    setMailTest({ status: "sending", message: "" });
    try {
      const { sentTo } = await sendTestEmail();
      setMailTest({ status: "ok", message: `E-mail de test envoyé à ${sentTo}. Vérifiez la boîte de réception (et les spams).` });
    } catch (err) {
      setMailTest({ status: "error", message: err.message });
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Paramètres du site</h1>
          <p className="muted">Chiffres clés de la page d'accueil, WhatsApp et e-mail de l'agence.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      {!form && !error && <div className="skeleton skeleton-table" />}

      {form && (
        <form className="admin-card form form-wide admin-form" onSubmit={handleSubmit}>
          <fieldset className="admin-fieldset">
            <legend>Chiffres clés (page d'accueil)</legend>
            <p className="muted">
              Uniquement des chiffres réels de l'agence. Un champ laissé vide n'est pas affiché ; la section entière est masquée si
              les trois sont vides.
            </p>
            <div className="form-row form-row-3">
              {FIELDS.map((field) => (
                <label key={field.key}>
                  {field.label}
                  <input type="number" min="0" inputMode="numeric" name={field.key} value={form[field.key]} onChange={handleChange} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>WhatsApp</legend>
            <label>
              Numéro WhatsApp de l'agence (format international, sans + ni espaces — ex : 213551234567)
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} inputMode="numeric" />
            </label>
            <p className="muted">Utilisé par le bouton flottant, la page Contact et le bouton « Poser une question » sur chaque bien.</p>
          </fieldset>

          <fieldset className="admin-fieldset">
            <legend>E-mail</legend>
            <label>
              Adresse e-mail affichée sur le site
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="contact@akili-immobilier.com" />
            </label>
            <p className="muted">
              Affichée sur la page Contact et en bas de chaque page. (L'adresse qui reçoit les notifications et envoie les accusés de
              réception se règle dans la configuration du serveur.)
            </p>
            <div className="mail-test">
              <button type="button" className="admin-btn admin-btn-outline" onClick={handleTestEmail} disabled={mailTest.status === "sending"}>
                {mailTest.status === "sending" ? "Envoi…" : "Envoyer un e-mail de test"}
              </button>
              {mailTest.message && <span className={mailTest.status === "ok" ? "notice" : "error"}>{mailTest.message}</span>}
            </div>
          </fieldset>

          <div className="admin-form-actions">
            <Button type="submit">{status === "saving" ? "Enregistrement…" : "Enregistrer"}</Button>
            {status === "saved" && <span className="notice" style={{ marginInlineStart: 12 }}>Paramètres enregistrés.</span>}
          </div>
        </form>
      )}
    </>
  );
}

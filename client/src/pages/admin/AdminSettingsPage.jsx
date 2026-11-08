import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import AdminIcon from "../../components/admin/AdminIcon";
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
        <form className="settings-form" onSubmit={handleSubmit}>
          <section className="admin-card settings-section settings-section-full">
            <header className="settings-section-head">
              <span className="settings-section-icon"><AdminIcon name="chart" size={20} /></span>
              <div>
                <h2>Chiffres clés</h2>
                <p className="muted">
                  Affichés sur la page d'accueil. Uniquement des chiffres réels de l'agence : un champ vide n'est pas affiché, et la
                  section entière est masquée si les trois sont vides.
                </p>
              </div>
            </header>
            <div className="settings-figures">
              {FIELDS.map((field) => (
                <label key={field.key} className="settings-field">
                  <span>{field.label}</span>
                  <input type="number" min="0" inputMode="numeric" name={field.key} value={form[field.key]} onChange={handleChange} placeholder="—" />
                </label>
              ))}
            </div>
          </section>

          <section className="admin-card settings-section">
            <header className="settings-section-head">
              <span className="settings-section-icon settings-icon-whatsapp"><AdminIcon name="phone" size={20} /></span>
              <div>
                <h2>WhatsApp</h2>
                <p className="muted">Bouton flottant, page Contact et bouton « Poser une question » de chaque bien.</p>
              </div>
            </header>
            <label className="settings-field">
              <span>Numéro de l'agence</span>
              <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} inputMode="numeric" placeholder="213551234567" />
              <small className="muted">Format international, sans « + » ni espaces.</small>
            </label>
          </section>

          <section className="admin-card settings-section">
            <header className="settings-section-head">
              <span className="settings-section-icon settings-icon-mail"><AdminIcon name="mail" size={20} /></span>
              <div>
                <h2>E-mail</h2>
                <p className="muted">Adresse affichée sur la page Contact et en bas de chaque page.</p>
              </div>
            </header>
            <label className="settings-field">
              <span>Adresse affichée sur le site</span>
              <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="contact@akili-immobilier.com" />
              <small className="muted">
                L'adresse qui reçoit les notifications et envoie les accusés de réception se règle dans la configuration du serveur.
              </small>
            </label>
            <div className="mail-test">
              <button type="button" className="admin-btn admin-btn-outline" onClick={handleTestEmail} disabled={mailTest.status === "sending"}>
                <AdminIcon name="mail" size={16} /> {mailTest.status === "sending" ? "Envoi…" : "Envoyer un e-mail de test"}
              </button>
              {mailTest.message && <p className={mailTest.status === "ok" ? "notice" : "error"}>{mailTest.message}</p>}
            </div>
          </section>

          <div className="settings-actions">
            {status === "saved" && <span className="settings-saved">Paramètres enregistrés.</span>}
            <Button type="submit">{status === "saving" ? "Enregistrement…" : "Enregistrer les paramètres"}</Button>
          </div>
        </form>
      )}
    </>
  );
}

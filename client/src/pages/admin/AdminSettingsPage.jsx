import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import { fetchSettings, updateSettings } from "../../lib/api";

const FIELDS = [
  { key: "yearsExperience", label: "Années d'expérience" },
  { key: "propertiesSold", label: "Biens vendus" },
  { key: "clientsServed", label: "Clients accompagnés" },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

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

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Paramètres du site</h1>
          <p className="muted">Chiffres clés de la page d'accueil et numéro WhatsApp de l'agence.</p>
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

          <div className="admin-form-actions">
            <Button type="submit">{status === "saving" ? "Enregistrement…" : "Enregistrer"}</Button>
            {status === "saved" && <span className="notice" style={{ marginInlineStart: 12 }}>Paramètres enregistrés.</span>}
          </div>
        </form>
      )}
    </>
  );
}

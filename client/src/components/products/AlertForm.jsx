import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import { createAlert } from "../../lib/api";
import { formatAmount } from "../../lib/format";
import { validateRequired, validateContact, runValidators } from "../../lib/validation";

// Enregistre les critères de recherche en cours + le contact du visiteur.
export default function AlertForm({ criteria }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", contact: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const summary = [
    criteria.type && (criteria.type === "VENTE" ? t("products.sale") : t("products.rent")),
    criteria.city,
    criteria.maxPrice && `≤ ${formatAmount(criteria.maxPrice)} ${t("common.currency")}`,
    criteria.minRooms && t("products.roomsShort", { count: `${criteria.minRooms}+` }),
  ].filter(Boolean);

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = runValidators({ name: validateRequired(form.name), contact: validateContact(form.contact) });
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setStatus("loading");
    setError(null);
    try {
      await createAlert({
        ...form,
        type: criteria.type || undefined,
        city: criteria.city || undefined,
        maxBudget: criteria.maxPrice || undefined,
        minRooms: criteria.minRooms || undefined,
      });
      setStatus("success");
      setForm({ name: "", contact: "" });
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section className="alert-box reveal">
      <h2>{t("alert.title")}</h2>
      <p className="muted">{t("alert.lead")}</p>
      <p className="alert-criteria">
        <strong>{t("alert.criteria")}</strong> {summary.length ? summary.join(" · ") : t("alert.allProperties")}
      </p>

      {status === "success" ? (
        <p className="notice">{t("alert.success")}</p>
      ) : (
        <form className="form alert-form" onSubmit={handleSubmit}>
          <label>
            {t("alert.name")}
            <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            {fieldErrors.name && <span className="field-error">{t(`validation.${fieldErrors.name}`)}</span>}
          </label>
          <label>
            {t("alert.contact")}
            <input name="contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
            {fieldErrors.contact && <span className="field-error">{t(`validation.${fieldErrors.contact}`)}</span>}
          </label>
          <Button type="submit">{status === "loading" ? t("alert.submitting") : t("alert.submit")}</Button>
          {status === "error" && <p className="error">{error}</p>}
        </form>
      )}
    </section>
  );
}

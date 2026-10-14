import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createClientRequest } from "../lib/api";
import { validateRequired, validateNationalId, validateContact, runValidators } from "../lib/validation";

const initialState = { name: "", nationalId: "", contact: "", type: "", details: "" };

export default function RequestPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = runValidators({
      name: validateRequired(form.name),
      nationalId: validateNationalId(form.nationalId),
      contact: validateContact(form.contact),
      type: validateRequired(form.type),
      details: validateRequired(form.details),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setError(null);
    try {
      await createClientRequest(form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>{t("request.title")}</h1>
      <p className="lead">{t("request.lead")}</p>

      <form className="form form-wide" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            {t("request.fullName")}
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
            {fieldErrors.name && <span className="field-error">{t(`validation.${fieldErrors.name}`)}</span>}
          </label>
          <label>
            {t("request.nationalId")}
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              placeholder={t("request.nationalIdPlaceholder")}
              maxLength={18}
              required
            />
            {fieldErrors.nationalId && <span className="field-error">{t(`validation.${fieldErrors.nationalId}`)}</span>}
          </label>
        </div>

        <div className="form-row">
          <label>
            {t("request.contact")}
            <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
            {fieldErrors.contact && <span className="field-error">{t(`validation.${fieldErrors.contact}`)}</span>}
          </label>
        </div>

        <label>
          {t("request.type")}
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="" disabled>{t("request.chooseType")}</option>
            <option value="PRODUIT">{t("request.typeProduct")}</option>
            <option value="SERVICE">{t("request.typeService")}</option>
          </select>
          {fieldErrors.type && <span className="field-error">{t(`validation.${fieldErrors.type}`)}</span>}
        </label>

        <label>
          {t("request.details")}
          <textarea
            name="details"
            rows={6}
            value={form.details}
            onChange={handleChange}
            placeholder={t("request.detailsPlaceholder")}
            required
          />
          {fieldErrors.details && <span className="field-error">{t(`validation.${fieldErrors.details}`)}</span>}
        </label>

        <Button type="submit">{status === "loading" ? t("request.submitting") : t("request.submit")}</Button>

        {status === "success" && <p className="notice">{t("request.success")}</p>}
        {status === "error" && <p className="error">{error}</p>}
      </form>
    </Container>
  );
}

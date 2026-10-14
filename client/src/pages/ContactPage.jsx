import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createClientRequest } from "../lib/api";
import { validateRequired, validateNationalId, validateEmail, runValidators } from "../lib/validation";

const WHATSAPP_NUMBER = "213783940376";

const initialState = { name: "", nationalId: "", email: "", message: "" };

export default function ContactPage() {
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
      email: validateEmail(form.email),
      message: validateRequired(form.message),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setError(null);
    try {
      await createClientRequest({
        name: form.name,
        nationalId: form.nationalId,
        contact: form.email,
        type: "SERVICE",
        details: `[Message de contact] ${form.message}`,
      });
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>{t("contact.title")}</h1>
      <p className="lead">{t("contact.lead")}</p>

      <div className="contact-grid">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            {t("contact.fullName")}
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
            {fieldErrors.name && <span className="field-error">{t(`validation.${fieldErrors.name}`)}</span>}
          </label>
          <label>
            {t("contact.nationalId")}
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              placeholder={t("contact.nationalIdPlaceholder")}
              maxLength={18}
              required
            />
            {fieldErrors.nationalId && <span className="field-error">{t(`validation.${fieldErrors.nationalId}`)}</span>}
          </label>
          <label>
            {t("contact.email")}
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            {fieldErrors.email && <span className="field-error">{t(`validation.${fieldErrors.email}`)}</span>}
          </label>
          <label>
            {t("contact.message")}
            <textarea name="message" rows={5} value={form.message} onChange={handleChange} required />
            {fieldErrors.message && <span className="field-error">{t(`validation.${fieldErrors.message}`)}</span>}
          </label>
          <Button type="submit">{status === "loading" ? t("contact.submitting") : t("contact.submit")}</Button>
          {status === "success" && <p className="notice">{t("contact.success")}</p>}
          {status === "error" && <p className="error">{error}</p>}
        </form>

        <div className="whatsapp-box">
          <h3>{t("contact.whatsappTitle")}</h3>
          <p>{t("contact.whatsappText")}</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
          >
            {t("contact.whatsappButton")}
          </a>
        </div>
      </div>
    </Container>
  );
}

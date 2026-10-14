import { useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { createSellOffer } from "../lib/api";
import { validateRequired, validateNationalId, validateAlgerianPhone, runValidators } from "../lib/validation";

const initialState = { name: "", nationalId: "", phone: "", propertyType: "", city: "", surface: "", price: "", description: "" };

export default function SellPage() {
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
      phone: validateAlgerianPhone(form.phone),
      propertyType: validateRequired(form.propertyType),
      city: validateRequired(form.city),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setError(null);
    try {
      await createSellOffer(form);
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <Container className="section">
      <h1>{t("sell.title")}</h1>
      <p className="lead">{t("sell.lead")}</p>

      <form className="form form-wide" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            {t("sell.fullName")}
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
            {fieldErrors.name && <span className="field-error">{t(`validation.${fieldErrors.name}`)}</span>}
          </label>
          <label>
            {t("sell.nationalId")}
            <input
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleChange}
              placeholder={t("sell.nationalIdPlaceholder")}
              maxLength={18}
              required
            />
            {fieldErrors.nationalId && <span className="field-error">{t(`validation.${fieldErrors.nationalId}`)}</span>}
          </label>
        </div>

        <div className="form-row">
          <label>
            {t("sell.phone")}
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="0551234567" required />
            {fieldErrors.phone && <span className="field-error">{t(`validation.${fieldErrors.phone}`)}</span>}
          </label>
        </div>

        <label>
          {t("sell.propertyType")}
          <select name="propertyType" value={form.propertyType} onChange={handleChange} required>
            <option value="" disabled>{t("sell.choosePropertyType")}</option>
            <option value="Appartement">{t("sell.propertyApartment")}</option>
            <option value="Villa">{t("sell.propertyVilla")}</option>
            <option value="Terrain">{t("sell.propertyLand")}</option>
            <option value="Local commercial">{t("sell.propertyCommercial")}</option>
          </select>
          {fieldErrors.propertyType && <span className="field-error">{t(`validation.${fieldErrors.propertyType}`)}</span>}
        </label>

        <div className="form-row">
          <label>
            {t("sell.city")}
            <input type="text" name="city" value={form.city} onChange={handleChange} required />
            {fieldErrors.city && <span className="field-error">{t(`validation.${fieldErrors.city}`)}</span>}
          </label>
          <label>
            {t("sell.surface")}
            <input type="text" name="surface" value={form.surface} onChange={handleChange} />
          </label>
        </div>

        <label>
          {t("sell.price")}
          <input type="text" name="price" value={form.price} onChange={handleChange} placeholder={t("sell.pricePlaceholder")} />
        </label>

        <label>
          {t("sell.description")}
          <textarea name="description" rows={5} value={form.description} onChange={handleChange} />
        </label>

        <Button type="submit">{status === "loading" ? t("sell.submitting") : t("sell.submit")}</Button>

        {status === "success" && <p className="notice">{t("sell.success")}</p>}
        {status === "error" && <p className="error">{error}</p>}
      </form>
    </Container>
  );
}

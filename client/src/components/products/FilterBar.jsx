import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

import { FILTER_KEYS } from "../../lib/catalog";

export default function FilterBar({ values, cities, onApply }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(values);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    const empty = Object.fromEntries(FILTER_KEYS.map((key) => [key, ""]));
    setForm(empty);
    onApply(empty);
  }

  return (
    <form
      className="filter-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(form);
      }}
    >
      <label>
        {t("filters.type")}
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">{t("filters.all")}</option>
          <option value="VENTE">{t("products.sale")}</option>
          <option value="LOCATION">{t("products.rent")}</option>
        </select>
      </label>
      <label>
        {t("filters.city")}
        <select name="city" value={form.city} onChange={handleChange}>
          <option value="">{t("filters.allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("filters.minPrice")}
        <input type="number" min="0" step="100000" inputMode="numeric" name="minPrice" value={form.minPrice} onChange={handleChange} placeholder="0" />
      </label>
      <label>
        {t("filters.maxPrice")}
        <input type="number" min="0" step="100000" inputMode="numeric" name="maxPrice" value={form.maxPrice} onChange={handleChange} placeholder="∞" />
      </label>
      <label>
        {t("filters.minRooms")}
        <select name="minRooms" value={form.minRooms} onChange={handleChange}>
          <option value="">{t("filters.any")}</option>
          {[1, 2, 3, 4, 5].map((rooms) => (
            <option key={rooms} value={rooms}>
              {rooms}+
            </option>
          ))}
        </select>
      </label>
      <div className="filter-actions">
        <Button type="submit">{t("filters.search")}</Button>
        <button type="button" className="link-btn" onClick={handleReset}>
          {t("filters.reset")}
        </button>
      </div>
    </form>
  );
}

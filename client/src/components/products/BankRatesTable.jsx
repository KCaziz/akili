import { useTranslation } from "react-i18next";
import { BANK_RATES, BANK_RATES_UPDATED, SUBSIDIZED_RATES } from "../../lib/bankRates";

function formatRate(value, locale) {
  return `${value.toLocaleString(locale, { maximumFractionDigits: 2 })} %`;
}

// Tableau des offres de crédit des banques algériennes, sous le simulateur.
export default function BankRatesTable({ onUseRate }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-DZ" : i18n.language === "en" ? "en-GB" : "fr-FR";
  const updated = new Date(`${BANK_RATES_UPDATED}-01`).toLocaleDateString(locale, { month: "long", year: "numeric" });

  return (
    <section className="bank-rates" aria-labelledby="bank-rates-title">
      <h2 id="bank-rates-title">{t("simulator.banks.title")}</h2>
      <p className="muted">{t("simulator.banks.lead", { date: updated })}</p>

      <div className="table-scroll">
        <table className="bank-rates-table">
          <thead>
            <tr>
              <th scope="col">{t("simulator.banks.bank")}</th>
              <th scope="col">{t("simulator.banks.rate")}</th>
              <th scope="col">{t("simulator.banks.duration")}</th>
              <th scope="col">{t("simulator.banks.downPayment")}</th>
              <th scope="col">{t("simulator.banks.note")}</th>
              <th scope="col"><span className="sr-only">{t("simulator.banks.useRate")}</span></th>
            </tr>
          </thead>
          <tbody>
            {BANK_RATES.map((row) => (
              <tr key={row.bank}>
                <th scope="row"><bdi>{row.bank}</bdi></th>
                <td className="nowrap">
                  {row.rate ? `${formatRate(row.rate[0], locale)} – ${formatRate(row.rate[1], locale)}` : t("simulator.banks.murabaha")}
                </td>
                <td className="nowrap">{t("simulator.banks.years", { count: row.years })}</td>
                <td className="nowrap"><bdi>{row.downPayment}</bdi></td>
                <td>{t(`simulator.banks.notes.${row.noteKey}`)}</td>
                <td>
                  {row.useRate && (
                    <button type="button" className="link-btn" onClick={() => onUseRate(row.useRate)}>
                      {t("simulator.banks.useRateValue", { rate: formatRate(row.useRate, locale) })}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {SUBSIDIZED_RATES.map((row) => (
              <tr key={row.rate} className="bank-rates-subsidized">
                <th scope="row">{t("simulator.banks.subsidized")}</th>
                <td className="nowrap">{formatRate(row.rate, locale)}</td>
                <td>—</td>
                <td>—</td>
                <td>{t(`simulator.banks.notes.${row.noteKey}`)}</td>
                <td>
                  <button type="button" className="link-btn" onClick={() => onUseRate(row.rate)}>
                    {t("simulator.banks.useRateValue", { rate: formatRate(row.rate, locale) })}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="bank-rates-disclaimer">{t("simulator.banks.disclaimer")}</p>
    </section>
  );
}

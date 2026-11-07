import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatAmount } from "../../lib/format";

const DEFAULT_RATE = 6.5;

function monthlyPayment(principal, annualRate, years) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
}

const toNumber = (value) => Math.max(0, Number(value) || 0);

export default function MortgageSimulator({ initialPrice = "" }) {
  const { t } = useTranslation();
  const [price, setPrice] = useState(String(initialPrice || ""));
  const [downPayment, setDownPayment] = useState(initialPrice ? String(Math.round(initialPrice * 0.2)) : "");
  const [years, setYears] = useState("20");
  const [rate, setRate] = useState(String(DEFAULT_RATE));

  const loan = Math.max(0, toNumber(price) - toNumber(downPayment));
  const monthly = monthlyPayment(loan, toNumber(rate), toNumber(years));
  const total = monthly * toNumber(years) * 12;
  const currency = t("common.currency");

  return (
    <div className="simulator">
      <div className="simulator-inputs form">
        <label>
          {t("simulator.price")}
          <input type="number" min="0" step="10000" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          {t("simulator.downPayment")}
          <input type="number" min="0" step="10000" inputMode="numeric" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
        </label>
        <div className="form-row">
          <label>
            {t("simulator.duration")}
            <input type="number" min="1" max="35" inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <label>
            {t("simulator.rate")}
            <input type="number" min="0" max="20" step="0.1" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="simulator-result" aria-live="polite">
        <span className="simulator-result-label">{t("simulator.monthly")}</span>
        <strong className="simulator-result-value">
          {formatAmount(monthly)} {currency}
        </strong>
        <dl>
          <div>
            <dt>{t("simulator.loanAmount")}</dt>
            <dd>{formatAmount(loan)} {currency}</dd>
          </div>
          <div>
            <dt>{t("simulator.totalInterest")}</dt>
            <dd>{formatAmount(Math.max(0, total - loan))} {currency}</dd>
          </div>
          <div>
            <dt>{t("simulator.totalCost")}</dt>
            <dd>{formatAmount(total)} {currency}</dd>
          </div>
        </dl>
        <p className="simulator-disclaimer">{t("simulator.disclaimer")}</p>
      </div>
    </div>
  );
}

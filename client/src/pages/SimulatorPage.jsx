import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import MortgageSimulator from "../components/products/MortgageSimulator";
import BankRatesTable from "../components/products/BankRatesTable";

export default function SimulatorPage() {
  const { t } = useTranslation();
  const [rate, setRate] = useState("6.5");
  const simulatorRef = useRef(null);

  function applyRate(value) {
    setRate(String(value));
    simulatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Container className="section">
      <h1>{t("simulator.title")}</h1>
      <p className="lead">{t("simulator.lead")}</p>
      <div ref={simulatorRef} className="simulator-anchor">
        <MortgageSimulator initialPrice={15000000} rate={rate} onRateChange={setRate} />
      </div>
      <BankRatesTable onUseRate={applyRate} />
    </Container>
  );
}

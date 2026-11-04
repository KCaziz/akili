import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import MortgageSimulator from "../components/products/MortgageSimulator";

export default function SimulatorPage() {
  const { t } = useTranslation();
  return (
    <Container className="section">
      <h1>{t("simulator.title")}</h1>
      <p className="lead">{t("simulator.lead")}</p>
      <MortgageSimulator initialPrice={15000000} />
    </Container>
  );
}

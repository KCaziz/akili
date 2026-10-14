import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container className="section">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <Link to="/">{t("notFound.backHome")}</Link>
    </Container>
  );
}

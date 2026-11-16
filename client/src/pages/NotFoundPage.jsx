import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import { LocalLink } from "../components/ui/LocalLink";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Container className="section">
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <LocalLink to="/">{t("notFound.backHome")}</LocalLink>
    </Container>
  );
}

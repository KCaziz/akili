import { useTranslation } from "react-i18next";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{t("footer.rights", { year: currentYear })}</p>
        <p className="footer-links">
          <a href="/contact">{t("footer.contact")}</a> · <a href="/admin/connexion">{t("footer.adminSpace")}</a>
        </p>
      </div>
    </footer>
  );
}

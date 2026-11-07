import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../../lib/useSiteSettings";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const { contactEmail } = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>{t("footer.rights", { year: currentYear })}</p>
        <p className="footer-links">
          {contactEmail && (
            <>
              <a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a> ·{" "}
            </>
          )}
          <a href="/contact">{t("footer.contact")}</a> · <a href="/admin/connexion">{t("footer.adminSpace")}</a>
        </p>
      </div>
    </footer>
  );
}

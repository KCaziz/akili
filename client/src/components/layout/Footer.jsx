import { useTranslation } from "react-i18next";
import { useSiteSettings } from "../../lib/useSiteSettings";
import { LocalLink } from "../ui/LocalLink";
import { setConsent } from "../../lib/analytics";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { t } = useTranslation();
  const { contactEmail, address, facebookUrl, instagramUrl, gaMeasurementId } = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-info">
          <p>{t("footer.rights", { year: currentYear })}</p>
          {address && (
            <p className="footer-address">
              <bdi>{address}</bdi>
            </p>
          )}
        </div>
        <p className="footer-links">
          {contactEmail && (
            <>
              <a href={`mailto:${contactEmail}`} dir="ltr">{contactEmail}</a> ·{" "}
            </>
          )}
          {facebookUrl && (
            <>
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a> ·{" "}
            </>
          )}
          {instagramUrl && (
            <>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a> ·{" "}
            </>
          )}
          <LocalLink to="/contact">{t("footer.contact")}</LocalLink>
          {gaMeasurementId && (
            <>
              {" · "}
              <button type="button" className="footer-link-button" onClick={() => setConsent("")}>
                {t("cookies.manage")}
              </button>
            </>
          )}
          {" · "}
          <a href="/admin/connexion" rel="nofollow">{t("footer.adminSpace")}</a>
        </p>
      </div>
    </footer>
  );
}

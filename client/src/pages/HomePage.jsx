import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="hero">
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1800&q=80"
          alt="Villa moderne"
        />
        <div className="hero-overlay" />
        <Container className="hero-inner">
          <span className="eyebrow">{t("home.eyebrow")}</span>
          <h1>{t("home.title")}</h1>
          <p className="lead">{t("home.lead")}</p>
          <div className="hero-actions">
            <Link to="/produits"><Button>{t("home.viewProducts")}</Button></Link>
            <Link to="/vendre"><Button variant="secondary">{t("home.proposeProperty")}</Button></Link>
          </div>
        </Container>
      </section>

      <section className="section about-section">
        <Container className="about-grid">
          <img
            className="about-image"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            alt="Intérieur moderne"
          />
          <div>
            <span className="eyebrow">{t("home.aboutEyebrow")}</span>
            <h2>{t("home.aboutTitle")}</h2>
            <p>{t("home.aboutP1")}</p>
            <p>{t("home.aboutP2")}</p>
          </div>
        </Container>
      </section>

      <section className="section section-alt">
        <Container>
          <span className="eyebrow">{t("home.domainsEyebrow")}</span>
          <h2>{t("home.domainsTitle")}</h2>
          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon">01</div>
              <h3>{t("home.featureSaleTitle")}</h3>
              <p>{t("home.featureSaleText")}</p>
            </div>
            <div className="feature">
              <div className="feature-icon">02</div>
              <h3>{t("home.featureRentTitle")}</h3>
              <p>{t("home.featureRentText")}</p>
            </div>
            <div className="feature">
              <div className="feature-icon">03</div>
              <h3>{t("home.featureEstimateTitle")}</h3>
              <p>{t("home.featureEstimateText")}</p>
            </div>
            <div className="feature">
              <div className="feature-icon">04</div>
              <h3>{t("home.featureAdviceTitle")}</h3>
              <p>{t("home.featureAdviceText")}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="cta-section">
        <img
          className="cta-image"
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80"
          alt="Quartier résidentiel"
        />
        <div className="hero-overlay" />
        <Container className="cta-inner">
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaText")}</p>
          <Link to="/contact"><Button>{t("home.ctaButton")}</Button></Link>
        </Container>
      </section>
    </>
  );
}

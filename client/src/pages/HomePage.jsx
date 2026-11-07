import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import ProductCard from "../components/products/ProductCard";
import { fetchProducts, fetchTestimonials } from "../lib/api";
import { useSiteSettings } from "../lib/useSiteSettings";

const FIGURES = [
  { key: "yearsExperience", label: "home.figuresYears" },
  { key: "propertiesSold", label: "home.figuresSold" },
  { key: "clientsServed", label: "home.figuresClients" },
];

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating}/5`}>
      {"★".repeat(rating)}
      <span className="stars-empty">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchProducts({ featured: "1", limit: 6 }).then(setFeatured).catch(() => {});
    fetchTestimonials().then(setTestimonials).catch(() => {});
  }, []);

  // Les chiffres clés ne s'affichent qu'une fois renseignés dans l'admin (pas de valeurs inventées).
  const figures = FIGURES.filter((figure) => Number(settings[figure.key]) > 0);

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
          <span className="eyebrow hero-animate">{t("home.eyebrow")}</span>
          <h1 className="hero-animate">{t("home.title")}</h1>
          <p className="lead hero-animate">{t("home.lead")}</p>
          <div className="hero-actions hero-animate">
            <Link to="/produits"><Button>{t("home.viewProducts")}</Button></Link>
            <Link to="/vendre"><Button variant="secondary">{t("home.proposeProperty")}</Button></Link>
          </div>
        </Container>
      </section>

      {figures.length > 0 && (
        <section className="key-figures">
          <Container className="key-figures-grid">
            {figures.map((figure) => (
              <div key={figure.key} className="key-figure reveal">
                <strong>
                  +<AnimatedCounter value={settings[figure.key]} />
                </strong>
                <span>{t(figure.label)}</span>
              </div>
            ))}
          </Container>
        </section>
      )}

      <section className="section about-section">
        <Container className="about-grid">
          <img
            className="about-image reveal"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            alt="Intérieur moderne"
          />
          <div className="reveal">
            <span className="eyebrow">{t("home.aboutEyebrow")}</span>
            <h2>{t("home.aboutTitle")}</h2>
            <p>{t("home.aboutP1")}</p>
            <p>{t("home.aboutP2")}</p>
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="section section-alt">
          <Container>
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow">{t("home.featuredEyebrow")}</span>
                <h2>{t("home.featuredTitle")}</h2>
              </div>
              <Link to="/produits" className="section-link">{t("home.seeAll")} →</Link>
            </div>
            <div className="card-grid">
              {featured.map((product) => (
                <div key={product.id} className="reveal">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className={`section ${featured.length > 0 ? "" : "section-alt"}`}>
        <Container>
          <span className="eyebrow reveal">{t("home.domainsEyebrow")}</span>
          <h2 className="reveal">{t("home.domainsTitle")}</h2>
          <div className="feature-grid">
            {[
              ["01", "Sale"],
              ["02", "Rent"],
              ["03", "Estimate"],
              ["04", "Advice"],
            ].map(([number, name]) => (
              <div key={name} className="feature reveal">
                <div className="feature-icon">{number}</div>
                <h3>{t(`home.feature${name}Title`)}</h3>
                <p>{t(`home.feature${name}Text`)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="section section-alt">
          <Container>
            <span className="eyebrow reveal">{t("home.testimonialsEyebrow")}</span>
            <h2 className="reveal">{t("home.testimonialsTitle")}</h2>
            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.id} className="testimonial reveal">
                  <Stars rating={testimonial.rating} />
                  <blockquote className="preserve-lines">{testimonial.text}</blockquote>
                  <figcaption>
                    <strong>{testimonial.name}</strong>
                    {testimonial.city && <span> · {testimonial.city}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="cta-section">
        <img
          className="cta-image"
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=80"
          alt="Quartier résidentiel"
        />
        <div className="hero-overlay" />
        <Container className="cta-inner reveal">
          <h2>{t("home.ctaTitle")}</h2>
          <p>{t("home.ctaText")}</p>
          <Link to="/contact"><Button>{t("home.ctaButton")}</Button></Link>
        </Container>
      </section>
    </>
  );
}

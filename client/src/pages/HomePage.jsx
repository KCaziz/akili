import { Link } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";

export default function HomePage() {
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
          <span className="eyebrow">Agence immobilière</span>
          <h1>Trouvez le bien qui vous ressemble</h1>
          <p className="lead">
            Akili vous accompagne pour acheter, vendre ou louer en toute confiance,
            avec une sélection de biens de qualité et un suivi personnalisé.
          </p>
          <div className="hero-actions">
            <Link to="/produits"><Button>Voir les produits</Button></Link>
            <Link to="/vendre"><Button variant="secondary">Proposer un bien</Button></Link>
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
            <span className="eyebrow">Qui sommes-nous</span>
            <h2>Un accompagnement de confiance, à chaque étape</h2>
            <p>
              Akili est une agence immobilière qui accompagne particuliers et professionnels
              dans leurs projets d'achat, de vente et de location. Notre équipe met son
              expérience du marché local au service de vos projets, avec un suivi personnalisé
              à chaque étape.
            </p>
          </div>
        </Container>
      </section>

      <section className="section section-alt">
        <Container>
          <span className="eyebrow">Nos domaines</span>
          <h2>Ce que nous proposons</h2>
          <div className="feature-grid">
            <div className="feature">
              <div className="feature-icon">01</div>
              <h3>Vente &amp; achat</h3>
              <p>Accompagnement complet pour vendre ou acquérir un bien au meilleur prix.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">02</div>
              <h3>Location</h3>
              <p>Recherche et gestion locative pour propriétaires et locataires.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">03</div>
              <h3>Estimation</h3>
              <p>Évaluation précise de la valeur de votre bien selon le marché actuel.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">04</div>
              <h3>Conseil</h3>
              <p>Un accompagnement sur-mesure, de la recherche jusqu'à la signature.</p>
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
          <h2>Un projet immobilier en tête ?</h2>
          <p>Parlons-en. Notre équipe vous répond rapidement.</p>
          <Link to="/contact"><Button>Nous contacter</Button></Link>
        </Container>
      </section>
    </>
  );
}

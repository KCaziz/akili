import Container from "../components/ui/Container";
import Card from "../components/ui/Card";

const services = [
  {
    title: "Vente de biens",
    description: "Mise en valeur de votre bien, diffusion auprès d'acheteurs qualifiés et accompagnement jusqu'à la signature.",
  },
  {
    title: "Location",
    description: "Recherche de locataires sérieux, rédaction du contrat et suivi de la mise en location.",
  },
  {
    title: "Estimation gratuite",
    description: "Une évaluation fiable de la valeur de votre bien, basée sur le marché actuel.",
  },
  {
    title: "Accompagnement administratif",
    description: "Aide dans les démarches liées à l'achat, la vente ou la location d'un bien.",
  },
];

export default function ServicesPage() {
  return (
    <Container className="section">
      <h1>Nos services</h1>
      <p className="lead">Akili vous accompagne à chaque étape de votre projet immobilier.</p>

      <div className="card-grid">
        {services.map((service) => (
          <Card key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}

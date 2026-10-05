import { Link } from "react-router-dom";
import Container from "../components/ui/Container";

export default function NotFoundPage() {
  return (
    <Container className="section">
      <h1>Page introuvable</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </Container>
  );
}

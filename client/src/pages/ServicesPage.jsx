import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { fetchServices } from "../lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetchServices()
      .then((data) => {
        if (!cancelled) {
          setServices(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container className="section">
      <h1>Nos services</h1>
      <p className="lead">Akili vous accompagne à chaque étape de votre projet immobilier.</p>

      {status === "loading" && <p className="muted">Chargement des services…</p>}
      {status === "error" && (
        <p className="notice">
          Impossible de charger les services pour le moment. Le serveur est-il démarré ?
        </p>
      )}

      {status === "ready" && (
        <div className="card-grid">
          {services.map((service) => (
            <Card key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

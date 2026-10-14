import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { fetchServices } from "../lib/api";

export default function ServicesPage() {
  const { t } = useTranslation();
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
      <h1>{t("services.title")}</h1>
      <p className="lead">{t("services.lead")}</p>

      {status === "loading" && <p className="muted">{t("services.loading")}</p>}
      {status === "error" && <p className="notice">{t("services.error")}</p>}

      {status === "ready" && (
        <div className="card-grid">
          {services.map((service) => (
            <Card key={service.id}>
              <h3>{service.title}</h3>
              <p className="preserve-lines">{service.description}</p>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

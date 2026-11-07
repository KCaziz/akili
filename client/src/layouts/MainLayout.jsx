import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AssistantWidget from "../components/assistant/AssistantWidget";
import WhatsAppFloat from "../components/layout/WhatsAppFloat";
import ScrollReveal from "../components/ui/ScrollReveal";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <AssistantWidget />
      <WhatsAppFloat />
      <ScrollReveal />
    </div>
  );
}

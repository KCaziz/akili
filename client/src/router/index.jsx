import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import NotFoundPage from "../pages/NotFoundPage";
import i18n from "../i18n";

// Chaque page est chargée à la demande : le visiteur ne télécharge pas le code de l'admin
// ni des pages qu'il n'ouvre pas (premier affichage plus rapide, meilleur score mobile).
const HomePage = lazy(() => import("../pages/HomePage"));
const ServicesPage = lazy(() => import("../pages/ServicesPage"));
const ProductsPage = lazy(() => import("../pages/products/ProductsPage"));
const ProductDetailPage = lazy(() => import("../pages/products/ProductDetailPage"));
const GalleryPage = lazy(() => import("../pages/GalleryPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const SellPage = lazy(() => import("../pages/SellPage"));
const RequestPage = lazy(() => import("../pages/RequestPage"));
const FavoritesPage = lazy(() => import("../pages/FavoritesPage"));
const SimulatorPage = lazy(() => import("../pages/SimulatorPage"));

const AdminLoginPage = lazy(() => import("../pages/admin/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("../pages/admin/AdminProductsPage"));
const AdminServicesPage = lazy(() => import("../pages/admin/AdminServicesPage"));
const AdminGalleryPage = lazy(() => import("../pages/admin/AdminGalleryPage"));
const AdminRequestsPage = lazy(() => import("../pages/admin/AdminRequestsPage"));
const AdminOffersPage = lazy(() => import("../pages/admin/AdminOffersPage"));
const AdminAccountPage = lazy(() => import("../pages/admin/AdminAccountPage"));
const AdminTestimonialsPage = lazy(() => import("../pages/admin/AdminTestimonialsPage"));
const AdminSettingsPage = lazy(() => import("../pages/admin/AdminSettingsPage"));
const AdminAlertsPage = lazy(() => import("../pages/admin/AdminAlertsPage"));

function RootRedirect() {
  return <Navigate to={`/${i18n.language}${window.location.search}`} replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  {
    // La langue est le premier segment de l'adresse : /fr, /ar, /en, /tzm (voir MainLayout).
    path: "/:lang",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "produits", element: <ProductsPage /> },
      { path: "produits/:slug", element: <ProductDetailPage /> },
      { path: "galerie", element: <GalleryPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "vendre", element: <SellPage /> },
      { path: "demande", element: <RequestPage /> },
      { path: "favoris", element: <FavoritesPage /> },
      { path: "simulateur", element: <SimulatorPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <AdminAuthLayout />,
    children: [
      { path: "/admin/connexion", element: <AdminLoginPage /> },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "produits", element: <AdminProductsPage /> },
          { path: "services", element: <AdminServicesPage /> },
          { path: "galerie", element: <AdminGalleryPage /> },
          { path: "demandes", element: <AdminRequestsPage /> },
          { path: "offres", element: <AdminOffersPage /> },
          { path: "avis", element: <AdminTestimonialsPage /> },
          { path: "alertes", element: <AdminAlertsPage /> },
          { path: "parametres", element: <AdminSettingsPage /> },
          { path: "compte", element: <AdminAccountPage /> },
        ],
      },
    ],
  },
]);

export default router;

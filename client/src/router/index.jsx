import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminAuthLayout from "../layouts/AdminAuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import ProductsPage from "../pages/products/ProductsPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import GalleryPage from "../pages/GalleryPage";
import ContactPage from "../pages/ContactPage";
import SellPage from "../pages/SellPage";
import RequestPage from "../pages/RequestPage";
import NotFoundPage from "../pages/NotFoundPage";
import FavoritesPage from "../pages/FavoritesPage";
import SimulatorPage from "../pages/SimulatorPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminServicesPage from "../pages/admin/AdminServicesPage";
import AdminGalleryPage from "../pages/admin/AdminGalleryPage";
import AdminRequestsPage from "../pages/admin/AdminRequestsPage";
import AdminOffersPage from "../pages/admin/AdminOffersPage";
import AdminAccountPage from "../pages/admin/AdminAccountPage";
import AdminTestimonialsPage from "../pages/admin/AdminTestimonialsPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminAlertsPage from "../pages/admin/AdminAlertsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "services", element: <ServicesPage /> },
      { path: "produits", element: <ProductsPage /> },
      { path: "produits/:id", element: <ProductDetailPage /> },
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

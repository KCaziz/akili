// En dev : client/.env fixe VITE_API_URL vers http://localhost:4000/api (front et back sur
// des ports séparés). En prod (build cPanel) : client/.env.production fixe VITE_API_URL=/api
// (front et back servis par le même serveur Node, même origine) — voir DEPLOYMENT.md.
import i18n from "../i18n";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

// Les fichiers uploadés sont renvoyés en URL relative ("/uploads/xxx") ; les images de
// démonstration restent des URLs absolues (Unsplash) — on ne touche qu'aux relatives.
export function resolveMediaUrl(url) {
  if (!url) return url;
  return url.startsWith("/") ? `${API_ORIGIN}${url}` : url;
}

async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Erreur API (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // réponse sans corps JSON (ex: 204)
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

// ---- Services ----
export const fetchServices = () => request("/services");
export const createService = (data) => request("/services", { method: "POST", body: data });
export const updateService = (id, data) => request(`/services/${id}`, { method: "PUT", body: data });
export const deleteService = (id) => request(`/services/${id}`, { method: "DELETE" });

// ---- Produits ----
// params : type, city, minPrice, maxPrice, minRooms, sort, featured, ids, limit (vides ignorés).
export function fetchProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ).toString();
  return request(`/products${query ? `?${query}` : ""}`);
}
export const fetchCities = () => request("/products/cities");
export const fetchProduct = (id) => request(`/products/${id}`);
export const recordProductView = (id) => request(`/products/${id}/view`, { method: "POST" });
export const createProduct = (data) => request("/products", { method: "POST", body: data });
export const updateProduct = (id, data) => request(`/products/${id}`, { method: "PUT", body: data });
export const deleteProduct = (id) => request(`/products/${id}`, { method: "DELETE" });

// ---- Demandes ----
// La langue courante permet d'envoyer l'accusé de réception par e-mail dans la langue du visiteur.
const withLang = (data) => ({ ...data, lang: i18n.language });

export const createClientRequest = (data) => request("/requests", { method: "POST", body: withLang(data) });
export const fetchRequests = () => request("/requests");
export const updateRequestStatus = (id, status) => request(`/requests/${id}`, { method: "PATCH", body: { status } });

// ---- Offres de vente ----
export const createSellOffer = (data) => request("/sell-offers", { method: "POST", body: withLang(data) });
export const fetchSellOffers = () => request("/sell-offers");
export const updateSellOfferStatus = (id, status) => request(`/sell-offers/${id}`, { method: "PATCH", body: { status } });

// ---- Galerie ----
export const fetchGallery = () => request("/gallery");
export const createGalleryMedia = (data) => request("/gallery", { method: "POST", body: data });
export const deleteGalleryMedia = (id) => request(`/gallery/${id}`, { method: "DELETE" });

// ---- Avis clients ----
export const fetchTestimonials = () => request("/testimonials");
export const fetchAllTestimonials = () => request("/testimonials/all");
export const createTestimonial = (data) => request("/testimonials", { method: "POST", body: data });
export const updateTestimonial = (id, data) => request(`/testimonials/${id}`, { method: "PUT", body: data });
export const deleteTestimonial = (id) => request(`/testimonials/${id}`, { method: "DELETE" });

// ---- Paramètres du site (chiffres clés, WhatsApp) ----
export const fetchSettings = () => request("/settings");
export const updateSettings = (data) => request("/settings", { method: "PUT", body: data });
export const sendTestEmail = () => request("/settings/test-email", { method: "POST" });

// ---- Alertes ----
export const createAlert = (data) => request("/alerts", { method: "POST", body: withLang(data) });
export const fetchAlerts = () => request("/alerts");
export const updateAlert = (id, isActive) => request(`/alerts/${id}`, { method: "PATCH", body: { isActive } });
export const deleteAlert = (id) => request(`/alerts/${id}`, { method: "DELETE" });

// ---- Statistiques admin ----
export const fetchStats = () => request("/stats");

// ---- Auth admin ----
export const login = (username, password) => request("/auth/login", { method: "POST", body: { username, password } });
export const logout = () => request("/auth/logout", { method: "POST" });
export const fetchMe = () => request("/auth/me");
export const changePassword = (currentPassword, newPassword) =>
  request("/auth/change-password", { method: "POST", body: { currentPassword, newPassword } });

// ---- Upload de fichiers (photos/vidéos) ----
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!response.ok) {
    let message = `Erreur upload (${response.status})`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return response.json(); // { url }
}

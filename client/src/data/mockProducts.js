// Données factices — le vrai catalogue viendra de l'API (Phase 1).
export const mockProducts = [
  {
    id: 1,
    title: "Villa moderne avec piscine",
    type: "Vente",
    city: "Alger",
    price: "18 500 000 DZD",
    rooms: 5,
    surface: "320 m²",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Appartement F3 centre-ville",
    type: "Location",
    city: "Oran",
    price: "45 000 DZD / mois",
    rooms: 3,
    surface: "85 m²",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Local commercial",
    type: "Vente",
    city: "Constantine",
    price: "9 200 000 DZD",
    rooms: null,
    surface: "150 m²",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
  },
];

export const mockRequests = [
  { id: 1, client: "Karim B.", type: "Demande", subject: "Recherche F4 à Alger", status: "en attente" },
  { id: 2, client: "Sarah M.", type: "Demande", subject: "Information sur villa #1", status: "traité" },
];

export const mockOffers = [
  { id: 1, client: "Yacine T.", subject: "Appartement F2 à vendre, Bab Ezzouar", status: "en attente" },
  { id: 2, client: "Nadia R.", subject: "Terrain 400 m², Boumerdès", status: "en attente" },
];

import bcrypt from "bcryptjs";
import { prisma } from "../src/config/prisma.js";

// Contenu de démonstration pour la V1 — le client n'a pas de cahier des charges détaillé
// et a demandé une version la plus complète possible à juger sur pièce (2026-10-09).
// Textes et biens sont inventés mais plausibles ; les photos sont génériques (Unsplash).

const services = [
  {
    title: "Vente & achat",
    description:
      "Vendez ou achetez en toute sérénité. Nous mettons votre bien en valeur, le diffusons auprès d'acheteurs qualifiés et vous accompagnons jusqu'à la signature, avec des conseils clairs à chaque étape.",
  },
  {
    title: "Location",
    description:
      "Trouvez rapidement le bon locataire ou le bon logement. Nous sélectionnons des profils sérieux, préparons un contrat conforme et assurons un suivi tout au long de la location.",
  },
  {
    title: "Estimation gratuite",
    description:
      "Connaître la juste valeur de votre bien est la première étape d'un projet réussi. Notre équipe réalise une estimation fiable, basée sur une connaissance fine du marché local.",
  },
  {
    title: "Accompagnement administratif",
    description:
      "De la constitution du dossier à la signature finale, nous simplifions les démarches liées à l'achat, la vente ou la location de votre bien.",
  },
];

const products = [
  {
    title: "Villa moderne avec piscine",
    description: "Villa contemporaine de standing, grand jardin, piscine privée et garage double. Quartier calme et résidentiel.",
    type: "VENTE",
    city: "Alger",
    price: "18 500 000 DZD",
    surface: "320 m²",
    rooms: 5,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Appartement F3 centre-ville",
    description: "Appartement lumineux au 3ème étage avec ascenseur, proche commerces et transports.",
    type: "LOCATION",
    city: "Oran",
    price: "45 000 DZD / mois",
    surface: "85 m²",
    rooms: 3,
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Local commercial",
    description: "Local commercial en rez-de-chaussée, grande vitrine, idéal activité commerciale ou bureau.",
    type: "VENTE",
    city: "Constantine",
    price: "9 200 000 DZD",
    surface: "150 m²",
    rooms: null,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Appartement F4 vue mer",
    description: "Bel appartement avec vue dégagée sur la mer, résidence sécurisée avec parking.",
    type: "VENTE",
    city: "Alger",
    price: "22 000 000 DZD",
    surface: "110 m²",
    rooms: 4,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Studio meublé proche université",
    description: "Studio entièrement meublé et équipé, idéal pour étudiant ou jeune actif.",
    type: "LOCATION",
    city: "Oran",
    price: "22 000 DZD / mois",
    surface: "35 m²",
    rooms: 1,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Terrain constructible",
    description: "Terrain plat et viabilisé, titre de propriété en règle, proche axe principal.",
    type: "VENTE",
    city: "Boumerdès",
    price: "6 500 000 DZD",
    surface: "400 m²",
    rooms: null,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
  },
];

const galleryPhotos = [
  { type: "PHOTO", caption: "Nos locaux", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80" },
  { type: "PHOTO", caption: "Espace accueil", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80" },
  { type: "PHOTO", caption: "L'équipe au travail", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80" },
  { type: "PHOTO", caption: "Salle de réunion", url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80" },
  { type: "PHOTO", caption: "Visite d'un bien", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80" },
  { type: "PHOTO", caption: "Entrée de l'agence", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80" },
];

async function upsertByUniqueField(model, field, items) {
  for (const item of items) {
    const existing = await model.findFirst({ where: { [field]: item[field] } });
    if (existing) {
      await model.update({ where: { id: existing.id }, data: item });
    } else {
      await model.create({ data: item });
    }
  }
}

async function main() {
  // Admin de démonstration — identifiants DEV UNIQUEMENT, à changer avant toute mise en production réelle.
  const passwordHash = await bcrypt.hash("akili2026", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", passwordHash },
  });

  await upsertByUniqueField(prisma.service, "title", services);
  await upsertByUniqueField(prisma.product, "title", products);

  const existingMedia = await prisma.galleryMedia.count();
  if (existingMedia === 0) {
    await prisma.galleryMedia.createMany({ data: galleryPhotos });
  }

  console.log("Seed terminé : 1 admin, 4 services, 6 produits, 6 photos de galerie.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

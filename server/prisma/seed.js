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

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;
const PHOTOS = {
  villa: "1600607687939-ce8a6c25118c",
  f3: "1560185893-a55cbc8c57e8",
  local: "1600047509807-ba8f99d2cdde",
  f4: "1512917774080-9991f1c4c750",
  studio: "1522708323590-d24dbb6b0267",
  terrain: "1500382017468-9049fed747ef",
  exterior: "1568605114967-8130f3a36994",
  interior: "1600585154340-be6161a56a0c",
  interior2: "1600596542815-ffad4c1539a9",
};

const products = [
  {
    title: "Villa moderne avec piscine",
    description: "Villa contemporaine de standing, grand jardin, piscine privée et garage double. Quartier calme et résidentiel.",
    type: "VENTE", city: "Alger", price: "18 500 000 DZD", priceValue: 18500000, surface: "320 m²", rooms: 5,
    isFeatured: true, isExclusive: true, latitude: 36.7406, longitude: 3.0303,
    images: [img(PHOTOS.villa), img(PHOTOS.exterior), img(PHOTOS.interior), img(PHOTOS.interior2)],
  },
  {
    title: "Appartement F3 centre-ville",
    description: "Appartement lumineux au 3ème étage avec ascenseur, proche commerces et transports.",
    type: "LOCATION", city: "Oran", price: "45 000 DZD / mois", priceValue: 45000, surface: "85 m²", rooms: 3,
    isFeatured: true, latitude: 35.6971, longitude: -0.6308,
    images: [img(PHOTOS.f3), img(PHOTOS.interior2), img(PHOTOS.interior)],
  },
  {
    title: "Local commercial",
    description: "Local commercial en rez-de-chaussée, grande vitrine, idéal activité commerciale ou bureau.",
    type: "VENTE", city: "Constantine", price: "9 200 000 DZD", priceValue: 9200000, surface: "150 m²", rooms: null,
    status: "VENDU", latitude: 36.365, longitude: 6.6147,
    images: [img(PHOTOS.local)],
  },
  {
    title: "Appartement F4 vue mer",
    description: "Bel appartement avec vue dégagée sur la mer, résidence sécurisée avec parking.",
    type: "VENTE", city: "Alger", price: "22 000 000 DZD", priceValue: 22000000, surface: "110 m²", rooms: 4,
    isFeatured: true, latitude: 36.7686, longitude: 3.0336, videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    images: [img(PHOTOS.f4), img(PHOTOS.interior), img(PHOTOS.interior2)],
  },
  {
    title: "Studio meublé proche université",
    description: "Studio entièrement meublé et équipé, idéal pour étudiant ou jeune actif.",
    type: "LOCATION", city: "Oran", price: "22 000 DZD / mois", priceValue: 22000, surface: "35 m²", rooms: 1,
    latitude: 35.7106, longitude: -0.5809,
    images: [img(PHOTOS.studio), img(PHOTOS.interior2)],
  },
  {
    title: "Terrain constructible",
    description: "Terrain plat et viabilisé, titre de propriété en règle, proche axe principal.",
    type: "VENTE", city: "Boumerdès", price: "6 500 000 DZD", priceValue: 6500000, surface: "400 m²", rooms: null,
    latitude: 36.7664, longitude: 3.4772,
    images: [img(PHOTOS.terrain)],
  },
];

// Avis et chiffres clés : DÉMO LOCALE UNIQUEMENT (jamais dans cpanel-setup.sql) — sur le site
// réel, l'agence saisit ses vrais avis et chiffres dans l'admin.
const demoTestimonials = [
  { name: "Samir B.", city: "Alger", rating: 5, text: "Accompagnement sérieux du début à la fin, l'équipe a trouvé un acheteur en quelques semaines." },
  { name: "Nadia K.", city: "Oran", rating: 5, text: "Très réactifs sur WhatsApp, visites organisées rapidement. Je recommande." },
  { name: "Yacine M.", city: "Boumerdès", rating: 4, text: "Bons conseils pour l'estimation de notre terrain et un suivi administratif clair." },
];
const demoSettings = { yearsExperience: "12", propertiesSold: "340", clientsServed: "800" };

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
  for (const { images, ...data } of products) {
    const rows = images.map((url, position) => ({ url, position }));
    const payload = { ...data, image: images[0] };
    const existing = await prisma.product.findFirst({ where: { title: data.title } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: { ...payload, images: { deleteMany: {}, create: rows } } });
    } else {
      await prisma.product.create({ data: { ...payload, images: { create: rows } } });
    }
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({ data: demoTestimonials });
  }
  for (const [key, value] of Object.entries(demoSettings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  const existingMedia = await prisma.galleryMedia.count();
  if (existingMedia === 0) {
    await prisma.galleryMedia.createMany({ data: galleryPhotos });
  }

  console.log("Seed terminé : admin, services, 6 biens (photos, positions, vedettes), galerie, avis et chiffres clés de démo.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

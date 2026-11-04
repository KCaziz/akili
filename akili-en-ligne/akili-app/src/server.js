import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { parsePriceValue } from "./utils/price.js";

// Reprise unique des biens créés avant l'ajout du prix numérique (priceValue) : on le déduit
// du libellé texte. Fait ici plutôt qu'en SQL car REGEXP_REPLACE n'existe pas sur MySQL 5.7,
// courant sur l'hébergement mutualisé. Sans effet une fois tous les prix renseignés.
async function backfillPriceValues() {
  const products = await prisma.product.findMany({ where: { priceValue: null }, select: { id: true, price: true } });
  for (const { id, price } of products) {
    const priceValue = parsePriceValue(price);
    if (priceValue) await prisma.product.update({ where: { id }, data: { priceValue } });
  }
  if (products.length) console.log(`Prix numérique repris pour ${products.length} bien(s).`);
}

backfillPriceValues().catch((err) => console.error("Reprise des prix impossible :", err));

app.listen(env.port, () => {
  console.log(`Akili API démarrée sur http://localhost:${env.port}`);
});

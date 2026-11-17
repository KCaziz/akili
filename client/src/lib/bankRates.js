// Offres de crédit immobilier des banques algériennes : fourchettes INDICATIVES, compilées en
// novembre 2026 à partir d'informations publiques (sites des banques, presse, comparateurs).
// Les banques publient rarement leurs grilles : les chiffres varient selon le profil, le type
// de logement et la domiciliation du salaire. À mettre à jour ici quand les conditions changent.
export const BANK_RATES_UPDATED = "2026-11";

// rate : [min, max] en % par an ; useRate : taux proposé au bouton « Utiliser ce taux ».
// years : durée maximale (années) ; downPayment : apport minimum (% du prix).
// noteKey : précision traduite dans simulator.banks.notes.<noteKey>.
export const BANK_RATES = [
  { bank: "CNEP-Banque", rate: [5.5, 6.5], useRate: 5.75, years: 30, downPayment: "10 %", noteKey: "cnep" },
  { bank: "BNA", rate: [5.5, 6.5], useRate: 6, years: 25, downPayment: "10 – 20 %", noteKey: "bna" },
  { bank: "CPA", rate: [5.5, 6.5], useRate: 6, years: 25, downPayment: "10 – 20 %", noteKey: "cpa" },
  { bank: "BDL", rate: [6, 6.5], useRate: 6.25, years: 25, downPayment: "10 – 20 %", noteKey: "bdl" },
  { bank: "BEA", rate: [6.5, 7], useRate: 6.75, years: 25, downPayment: "20 %", noteKey: "bea" },
  { bank: "Al Salam · Al Baraka", rate: null, useRate: null, years: 20, downPayment: "20 %", noteKey: "islamic" },
];

// Crédit bonifié par l'État (premier logement, sous conditions de revenus), via les banques publiques.
export const SUBSIDIZED_RATES = [
  { rate: 1, noteKey: "subsidized1" },
  { rate: 3, noteKey: "subsidized3" },
];

// Titres et descriptions pour les moteurs de recherche et les aperçus de partage, par langue.
// Le contenu saisi par l'agence (titres et descriptions des biens) reste dans sa langue d'origine.

export const LANGS = {
  fr: { dir: "ltr", locale: "fr_DZ", name: "Français" },
  ar: { dir: "rtl", locale: "ar_DZ", name: "العربية" },
  en: { dir: "ltr", locale: "en_US", name: "English" },
  tzm: { dir: "ltr", locale: "fr_DZ", name: "Tamazight" },
};
export const DEFAULT_LANG = "fr";

export const TEXTS = {
  fr: {
    siteName: "Akili Immobilier",
    pages: {
      home: {
        title: "Akili Immobilier — Agence immobilière en Algérie : vente, achat, location",
        description:
          "Akili Immobilier vous accompagne pour acheter, vendre ou louer un bien en Algérie : appartements, villas, terrains et locaux, estimation et suivi administratif.",
        h1: "Votre projet immobilier, entre de bonnes mains",
      },
      services: {
        title: "Nos services immobiliers — vente, location, estimation | Akili Immobilier",
        description: "Vente et achat, location, estimation de votre bien et accompagnement administratif : découvrez les services de l'agence Akili Immobilier.",
        h1: "Nos services",
      },
      products: {
        title: "Biens immobiliers à vendre et à louer en Algérie | Akili Immobilier",
        description: "Appartements, villas, terrains et locaux à vendre ou à louer. Filtrez par ville, budget et nombre de pièces, et contactez directement l'agence.",
        h1: "Nos biens à vendre et à louer",
      },
      gallery: {
        title: "Galerie photos et vidéos | Akili Immobilier",
        description: "Découvrez l'agence Akili Immobilier, son équipe et ses réalisations en photos et vidéos.",
        h1: "Nos photos & vidéos",
      },
      contact: {
        title: "Contact — Akili Immobilier",
        description: "Contactez Akili Immobilier par formulaire, WhatsApp ou e-mail : un conseiller vous répond rapidement.",
        h1: "Contactez-nous",
      },
      sell: {
        title: "Vendre votre bien immobilier | Akili Immobilier",
        description: "Vous souhaitez vendre un appartement, une villa ou un terrain ? Proposez votre bien à Akili Immobilier : estimation et mise en vente accompagnées.",
        h1: "Vendre un bien",
      },
      request: {
        title: "Faire une demande — trouver un bien | Akili Immobilier",
        description: "Décrivez le bien ou le service que vous recherchez : un conseiller Akili Immobilier vous propose des solutions adaptées.",
        h1: "Faire une demande",
      },
      simulator: {
        title: "Simulateur de crédit immobilier | Akili Immobilier",
        description: "Estimez vos mensualités de crédit immobilier selon le prix du bien, votre apport, la durée et le taux.",
        h1: "Simulateur de crédit immobilier",
      },
      favorites: { title: "Mes favoris | Akili Immobilier", description: "Les biens que vous avez mis de côté.", h1: "Mes favoris" },
      notFound: { title: "Page introuvable | Akili Immobilier", description: "Cette page n'existe pas ou n'est plus disponible.", h1: "Page introuvable" },
    },
    sale: "à vendre",
    rent: "à louer",
    saleNoun: "Vente",
    rentNoun: "Location",
    in: "à",
    perMonth: "/ mois",
    rooms: "pièces",
    listingIn: (what, city) => `Biens ${what} ${city ? `à ${city}` : "en Algérie"}`,
    listingDescription: (what, city) =>
      `Découvrez nos biens ${what} ${city ? `à ${city}` : "en Algérie"} : appartements, villas, terrains et locaux. Contactez Akili Immobilier pour une visite.`,
    productCta: "Contactez Akili Immobilier pour organiser une visite.",
    nav: { home: "Accueil", services: "Services", products: "Biens", gallery: "Galerie", sell: "Vendre", request: "Demande", contact: "Contact", simulator: "Simulateur" },
    soldOut: "Ce bien n'est plus disponible.",
  },
  ar: {
    siteName: "أكيلي العقارية",
    pages: {
      home: {
        title: "أكيلي العقارية — وكالة عقارية في الجزائر: بيع، شراء وكراء",
        description: "ترافقك أكيلي العقارية في شراء أو بيع أو كراء عقارك في الجزائر: شقق، فيلات، أراضٍ ومحلات، مع التقييم والمتابعة الإدارية.",
        h1: "مشروعك العقاري في أيدٍ أمينة",
      },
      services: {
        title: "خدماتنا العقارية — بيع، كراء، تقييم | أكيلي العقارية",
        description: "البيع والشراء، الكراء، تقييم عقارك والمرافقة الإدارية: اكتشف خدمات وكالة أكيلي العقارية.",
        h1: "خدماتنا",
      },
      products: {
        title: "عقارات للبيع والكراء في الجزائر | أكيلي العقارية",
        description: "شقق، فيلات، أراضٍ ومحلات للبيع أو للكراء. ابحث حسب المدينة والميزانية وعدد الغرف، وتواصل مباشرة مع الوكالة.",
        h1: "عقاراتنا للبيع والكراء",
      },
      gallery: { title: "معرض الصور والفيديوهات | أكيلي العقارية", description: "اكتشف وكالة أكيلي العقارية وفريقها وإنجازاتها بالصور والفيديو.", h1: "صورنا وفيديوهاتنا" },
      contact: { title: "اتصل بنا — أكيلي العقارية", description: "تواصل مع أكيلي العقارية عبر الاستمارة أو واتساب أو البريد الإلكتروني: يرد عليك مستشار بسرعة.", h1: "اتصل بنا" },
      sell: {
        title: "بيع عقارك | أكيلي العقارية",
        description: "تريد بيع شقة أو فيلا أو قطعة أرض؟ اعرض عقارك على أكيلي العقارية: تقييم ومرافقة حتى البيع.",
        h1: "بيع عقار",
      },
      request: { title: "تقديم طلب — ابحث عن عقار | أكيلي العقارية", description: "صف العقار أو الخدمة التي تبحث عنها: يقترح عليك مستشار أكيلي حلولاً مناسبة.", h1: "تقديم طلب" },
      simulator: { title: "حاسبة القرض العقاري | أكيلي العقارية", description: "قدّر أقساطك الشهرية حسب سعر العقار والمساهمة الشخصية والمدة ونسبة الفائدة.", h1: "حاسبة القرض العقاري" },
      favorites: { title: "مفضلتي | أكيلي العقارية", description: "العقارات التي احتفظت بها.", h1: "مفضلتي" },
      notFound: { title: "الصفحة غير موجودة | أكيلي العقارية", description: "هذه الصفحة غير موجودة أو لم تعد متاحة.", h1: "الصفحة غير موجودة" },
    },
    sale: "للبيع",
    rent: "للكراء",
    saleNoun: "بيع",
    rentNoun: "كراء",
    in: "في",
    perMonth: "/ شهرياً",
    rooms: "غرف",
    listingIn: (what, city) => `عقارات ${what} ${city ? `في ${city}` : "في الجزائر"}`,
    listingDescription: (what, city) =>
      `اكتشف عقاراتنا ${what} ${city ? `في ${city}` : "في الجزائر"}: شقق، فيلات، أراضٍ ومحلات. تواصل مع أكيلي العقارية لتحديد موعد زيارة.`,
    productCta: "تواصل مع أكيلي العقارية لتحديد موعد زيارة.",
    nav: { home: "الرئيسية", services: "الخدمات", products: "العقارات", gallery: "المعرض", sell: "بيع", request: "طلب", contact: "اتصل بنا", simulator: "الحاسبة" },
    soldOut: "هذا العقار لم يعد متاحاً.",
  },
  en: {
    siteName: "Akili Immobilier",
    pages: {
      home: {
        title: "Akili Immobilier — Real estate agency in Algeria: buy, sell, rent",
        description: "Akili Immobilier helps you buy, sell or rent property in Algeria: apartments, villas, land and commercial premises, valuation and paperwork support.",
        h1: "Your property project, in good hands",
      },
      services: {
        title: "Our real estate services — sales, rentals, valuation | Akili Immobilier",
        description: "Buying and selling, rentals, property valuation and administrative support: discover the services of Akili Immobilier.",
        h1: "Our services",
      },
      products: {
        title: "Properties for sale and rent in Algeria | Akili Immobilier",
        description: "Apartments, villas, land and commercial premises for sale or rent. Filter by city, budget and rooms, and contact the agency directly.",
        h1: "Our properties for sale and rent",
      },
      gallery: { title: "Photo and video gallery | Akili Immobilier", description: "Discover the Akili Immobilier agency, its team and its work in photos and videos.", h1: "Our photos & videos" },
      contact: { title: "Contact — Akili Immobilier", description: "Contact Akili Immobilier by form, WhatsApp or email: an advisor will get back to you quickly.", h1: "Contact us" },
      sell: {
        title: "Sell your property | Akili Immobilier",
        description: "Want to sell an apartment, a villa or land? List your property with Akili Immobilier: valuation and guided sale.",
        h1: "Sell a property",
      },
      request: { title: "Make a request — find a property | Akili Immobilier", description: "Describe the property or service you are looking for: an Akili advisor will suggest suitable options.", h1: "Make a request" },
      simulator: { title: "Mortgage calculator | Akili Immobilier", description: "Estimate your monthly mortgage payments from the property price, down payment, duration and rate.", h1: "Mortgage calculator" },
      favorites: { title: "My favourites | Akili Immobilier", description: "The properties you saved.", h1: "My favourites" },
      notFound: { title: "Page not found | Akili Immobilier", description: "This page does not exist or is no longer available.", h1: "Page not found" },
    },
    sale: "for sale",
    rent: "for rent",
    saleNoun: "Sale",
    rentNoun: "Rental",
    in: "in",
    perMonth: "/ month",
    rooms: "rooms",
    listingIn: (what, city) => `Properties ${what} ${city ? `in ${city}` : "in Algeria"}`,
    listingDescription: (what, city) =>
      `Discover our properties ${what} ${city ? `in ${city}` : "in Algeria"}: apartments, villas, land and commercial premises. Contact Akili Immobilier to arrange a visit.`,
    productCta: "Contact Akili Immobilier to arrange a visit.",
    nav: { home: "Home", services: "Services", products: "Properties", gallery: "Gallery", sell: "Sell", request: "Request", contact: "Contact", simulator: "Calculator" },
    soldOut: "This property is no longer available.",
  },
  tzm: {
    siteName: "Akili Immobilier",
    pages: {
      home: {
        title: "Akili Immobilier — Tasnaɣt n wexxam di Lezzayer : zzenz, aɣ, kerray",
        description: "Akili Immobilier tettɛawan-ik ad taɣeḍ, ad tzenzeḍ neɣ ad tkerzeḍ axxam di Lezzayer : ixxamen, tividar, igran d tḥuna.",
        h1: "Asenfar-ik n wexxam, deg ifassen yelhan",
      },
      services: { title: "Imeẓla-nneɣ — zzenz, kerray, asefru | Akili Immobilier", description: "Zzenz d uɣ, kerray, asefru n wexxam-ik d uɛiwen anbaḍ : issin imeẓla n Akili Immobilier.", h1: "Imeẓla-nneɣ" },
      products: {
        title: "Ixxamen i zzenz d kerray di Lezzayer | Akili Immobilier",
        description: "Ixxamen, tividar, igran d tḥuna i zzenz neɣ i kerray. Fren s temdint, s tedrimt d umḍan n texxamin.",
        h1: "Ixxamen-nneɣ i zzenz d kerray",
      },
      gallery: { title: "Tugniwin d tvidyutin | Akili Immobilier", description: "Issin tasnaɣt Akili Immobilier d terbaɛt-is s tugniwin d tvidyutin.", h1: "Tugniwin-nneɣ d tvidyutin" },
      contact: { title: "Anermis — Akili Immobilier", description: "Nermes Akili Immobilier s tferkit, WhatsApp neɣ imayl.", h1: "Nermes-aɣ" },
      sell: { title: "Zzenz axxam-ik | Akili Immobilier", description: "Tebɣiḍ ad tzenzeḍ axxam, tavilla neɣ akal ? Sumer-it i Akili Immobilier.", h1: "Zzenz axxam" },
      request: { title: "Ssuter — af axxam | Akili Immobilier", description: "Glem-d axxam neɣ ameẓlu i tettnadiḍ : amessaḍ n Akili ad ak-d-yessumer tifrat.", h1: "Ssuter" },
      simulator: { title: "Asmekti n ttrid n wexxam | Akili Immobilier", description: "Ssishel tiwsatin-ik n yal ayyur.", h1: "Asmekti n ttrid" },
      favorites: { title: "Ismenyifen-iw | Akili Immobilier", description: "Ixxamen i teḥrezḍ.", h1: "Ismenyifen-iw" },
      notFound: { title: "Asebter ulac-it | Akili Immobilier", description: "Asebter-a ulac-it.", h1: "Asebter ulac-it" },
    },
    sale: "i zzenz",
    rent: "i kerray",
    saleNoun: "Zzenz",
    rentNoun: "Kerray",
    in: "di",
    perMonth: "/ ayyur",
    rooms: "texxamin",
    listingIn: (what, city) => `Ixxamen ${what} ${city ? `di ${city}` : "di Lezzayer"}`,
    listingDescription: (what, city) => `Issin ixxamen-nneɣ ${what} ${city ? `di ${city}` : "di Lezzayer"}. Nermes Akili Immobilier i tirza.`,
    productCta: "Nermes Akili Immobilier i tirza.",
    nav: { home: "Agejdan", services: "Imeẓla", products: "Ixxamen", gallery: "Tugniwin", sell: "Zzenz", request: "Asuter", contact: "Anermis", simulator: "Asmekti" },
    soldOut: "Axxam-a ur yelli ara.",
  },
};

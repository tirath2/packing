export const contactEmail = "btirath2@gmail.com";
export const whatsappNumber = "917977045133";
export const formattedPhone = "+91 79770 45133";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteConfig = {
  name: "Vessel Packaging Studio",
  shortName: "Vessel",
  url: siteUrl,
  title: "Custom Restaurant Packaging | Printed Boxes, Cups & Bags | Vessel",
  description:
    "Premium custom restaurant packaging for cafes, cloud kitchens and food brands. Get printed burger boxes, pizza boxes, coffee cups and carry bags with low MOQs.",
  ogImage: "https://lh3.googleusercontent.com/aida/AP1WRLtybSRdWK9Huzn9G9oTSCCks0L5ctzWGhNHFroQPEU2x2Q9ArOTigLA0ypeCfaPy8gsypNsNPtL5Duxx-e6Ix0p8lgkTkJhusGseazEty7u28Gqf3-Yd7jt7Wcnwx48V66-0rZellKHBttqkQ-4--EdvVN4JAajH1Ta_HVwUFPvZe59xi67dDJriJMiqog350yOG97lbZXkegSsYc69Yx3aOCM9lCSbYYglw-K2FQ8ELhaYGWkzGkEH9GRl",
  keywords: [
    "custom restaurant packaging",
    "restaurant packaging supplier",
    "printed food packaging",
    "custom burger boxes",
    "printed pizza boxes",
    "branded coffee cups",
    "custom carry bags",
    "cloud kitchen packaging",
    "cafe packaging",
    "food packaging design",
    "low MOQ packaging",
    "eco friendly food packaging",
  ],
};

export const serviceCatalog = [
  {
    name: "Custom Burger Boxes",
    description: "Greaseproof printed burger boxes with vented lids, inserts and food-safe finishes.",
  },
  {
    name: "Printed Pizza Boxes",
    description: "Custom pizza boxes using E-flute board, food-safe ink and premium brand artwork.",
  },
  {
    name: "Branded Coffee Cups",
    description: "Double-wall takeaway coffee cups, sleeves, lids and cafe packaging sets.",
  },
  {
    name: "Custom Carry Bags",
    description: "Kraft, art paper and laminated restaurant carry bags with reinforced handles.",
  },
];

export const faqItems = [
  {
    question: "What is the minimum order quantity?",
    answer:
      "Most paper packaging starts from 500 units. Specialty finishes, rigid boxes and custom structures may need a higher production quantity.",
  },
  {
    question: "Can you make a mockup before production?",
    answer:
      "Yes. Share the brand assets and product type, and the studio prepares a digital mockup before final print approval.",
  },
  {
    question: "Do you support eco-friendly materials?",
    answer:
      "Yes. Options include FSC-certified paper, kraft board, soy-based inks and compostable linings for cups and food containers.",
  },
];

export function getCanonicalUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        url: siteUrl,
        image: siteConfig.ogImage,
        description: siteConfig.description,
        email: contactEmail,
        telephone: formattedPhone,
        priceRange: "$$",
        areaServed: [
          {
            "@type": "Country",
            name: "India",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: formattedPhone,
          contactType: "sales",
          email: contactEmail,
          availableLanguage: ["English", "Hindi"],
        },
        makesOffer: {
          "@type": "OfferCatalog",
          name: "Custom Food Packaging Services",
          itemListElement: serviceCatalog.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description,
              provider: {
                "@id": `${siteUrl}/#business`,
              },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@id": `${siteUrl}/#business`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#business`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: siteConfig.ogImage,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

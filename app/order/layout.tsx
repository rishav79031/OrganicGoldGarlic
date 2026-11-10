import type { Metadata } from "next";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  title: "Order Fresh Peeled Garlic Online (250g, 1kg - ₹300, Bulk) | Organic Gold Garlic",
  description:
    "Buy 100% natural, hygienic peeled garlic online direct from our farm facility in Araria, Bihar. Vacuum-sealed 250g & 1kg packs (₹300) and commercial bulk supply with fast pan-India delivery. Official tax invoice & order tracking.",
  keywords: [
    "order peeled garlic online",
    "buy peeled garlic India",
    "1kg peeled garlic price",
    "fresh peeled garlic cloves",
    "organic gold garlic order",
    "peeled garlic home delivery",
    "wholesale peeled garlic supply",
    "garlic cloves vacuum pack",
    "peeled garlic price Bihar",
    "clean garlic cloves online",
  ],
  alternates: {
    canonical: `${SITE_URL}/order`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/order`,
    siteName: "Organic Gold Garlic",
    title: "Order Premium Peeled Garlic Online | Organic Gold Garlic",
    description:
      "Direct farm-fresh peeled garlic. Choose your pack: 250g, 1kg (₹300), or Bulk Wholesale. Fast pan-India doorstep courier dispatch with official invoice.",
    images: [
      {
        url: `${SITE_URL}/product-pack-kitchen.webp`,
        secureUrl: `${SITE_URL}/product-pack-kitchen.webp`,
        width: 1200,
        height: 630,
        type: "image/webp",
        alt: "Organic Gold Garlic - 1kg Peeled Garlic Pack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Peeled Garlic Online | Organic Gold Garlic (1kg ₹300)",
    description:
      "100% natural peeled garlic delivered direct from our unit in Araria, Bihar. Fast delivery across India.",
    images: [`${SITE_URL}/product-pack-kitchen.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const orderPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Order Peeled Garlic",
          item: `${SITE_URL}/order`,
        },
      ],
    },
    {
      "@type": "Product",
      name: "Organic Gold Garlic - 1 kg Fresh Peeled Garlic Pack",
      image: `${SITE_URL}/product-pack-kitchen.webp`,
      description:
        "Premium air-peeled, 100% natural garlic cloves ready to cook. Direct farm harvest from Bihar, unbleached, vacuum-sealed for fresh crunch and aroma.",
      sku: "OGG-1KG",
      brand: {
        "@type": "Brand",
        name: "Organic Gold Garlic",
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/order`,
        priceCurrency: "INR",
        price: "300.00",
        priceValidUntil: "2027-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Organic Gold Garlic",
          telephone: "+91-7488503664",
        },
      },
    },
    {
      "@type": "Product",
      name: "Organic Gold Garlic - 250g Fresh Peeled Garlic Pack",
      image: `${SITE_URL}/product-pack-studio.webp`,
      description:
        "Household pack of fresh peeled garlic cloves for daily kitchen cooking and curries.",
      sku: "OGG-250G",
      brand: {
        "@type": "Brand",
        name: "Organic Gold Garlic",
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/order`,
        priceCurrency: "INR",
        price: "100.00",
        priceValidUntil: "2027-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Organic Gold Garlic",
          telephone: "+91-7488503664",
        },
      },
    },
  ],
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orderPageSchema) }}
      />
      {children}
    </>
  );
}

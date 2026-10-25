import type { Metadata } from "next";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  title: "Order Fresh Peeled Garlic | Direct Farm Dispatch",
  description:
    "Place your peeled garlic order online with Organic Gold Garlic. Hygienic, 100% natural peeled garlic packs delivered to your doorstep. Wholesale & retail pan-India delivery.",
  alternates: {
    canonical: `${SITE_URL}/order`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/order`,
    siteName: "Organic Gold Garlic",
    title: "Order Peeled Garlic Online – Organic Gold Garlic",
    description:
      "Direct farm-fresh peeled garlic. Choose your pack (250g, 1kg, or Bulk Supply) with official invoice and fast pan-India courier dispatch.",
    images: [
      {
        url: `${SITE_URL}/og-share.jpg`,
        secureUrl: `${SITE_URL}/og-share.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Organic Gold Garlic - Order Peeled Garlic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Peeled Garlic Online | Organic Gold Garlic",
    description:
      "100% natural peeled garlic delivered direct from our unit in Araria, Bihar. Fast delivery across India.",
    images: [`${SITE_URL}/og-share.jpg`],
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
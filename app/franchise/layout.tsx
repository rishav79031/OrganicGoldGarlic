import type { Metadata } from "next";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  title: "Take Franchise with Full Machine Setup | Organic Gold Garlic Processing Plant",
  description:
    "Start your profitable peeled garlic processing business with Organic Gold Garlic franchise. Complete turnkey setup: bulb separator, pneumatic dry peeler, air compressor, sorting table, vacuum packaging & guaranteed raw garlic supply.",
  keywords: [
    "peeled garlic franchise",
    "garlic peeling machine setup",
    "organic gold garlic franchise",
    "peeled garlic business India",
    "garlic processing plant cost",
    "garlic peeler machine setup",
    "food processing franchise India",
    "turnkey peeled garlic unit",
    "garlic peeling machine Bihar",
    "pneumatic garlic peeler price",
  ],
  alternates: {
    canonical: `${SITE_URL}/franchise`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/franchise`,
    siteName: "Organic Gold Garlic",
    title: "Take Franchise of Organic Gold Garlic with Full Machine Setup",
    description:
      "Turnkey peeled garlic business opportunity. Complete industrial machinery line, raw garlic supply chain, operator training, and pan-India distribution tie-ups.",
    images: [
      {
        url: `${SITE_URL}/og-about.jpg`,
        secureUrl: `${SITE_URL}/og-about.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Organic Gold Garlic Franchise with Full Machine Setup",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Gold Garlic Franchise & Machine Setup",
    description:
      "Start a high-margin peeled garlic processing plant in your city. Full machine setup & raw material supply included.",
    images: [`${SITE_URL}/og-about.jpg`],
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

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

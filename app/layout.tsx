import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Organic Gold Garlic – Buy Premium Peeled Garlic Online | Pan-India Delivery",
    template: "%s | Organic Gold Garlic",
  },
  description:
    "Buy premium 100% natural, fresh peeled garlic cloves from Organic Gold Garlic. Hygienic, preservative-free, ready to cook. Direct dispatch from Araria, Bihar across India for homes, caterers, and restaurants.",
  keywords: [
    "buy peeled garlic",
    "buy organic peeled garlic",
    "buy bulk peeled garlic",
    "peeled garlic online India",
    "fresh peeled garlic supplier",
    "restaurant garlic delivery",
    "bulk garlic wholesale India",
    "organic garlic supplier",
    "ready to cook peeled garlic",
    "vacuum packed peeled garlic",
    "peeled garlic Bihar Araria",
    "garlic cloves wholesale",
  ],
  authors: [{ name: "Organic Gold Garlic", url: SITE_URL }],
  creator: "Organic Gold Garlic",
  publisher: "Organic Gold Garlic",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Organic Gold Garlic",
    title: "Organic Gold Garlic – 100% Fresh & Pure Peeled Garlic",
    description:
      "Direct farm-fresh hygienic peeled garlic. 100% chemical-free, vacuum-sealed for aroma and shelf life. Doorstep dispatch across India.",
    images: [
      {
        url: `${SITE_URL}/og-share.jpg`,
        secureUrl: `${SITE_URL}/og-share.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Organic Gold Garlic - Fresh Peeled Garlic Packs (250g, 1kg & Bulk Supply)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Gold Garlic – 100% Fresh & Pure Peeled Garlic",
    description:
      "Buy fresh peeled garlic online. 100% natural, hygienic vacuum-sealed cloves with Pan-India dispatch from Araria, Bihar.",
    images: [`${SITE_URL}/og-share.jpg`],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Extra social tags for WhatsApp, Instagram, and Facebook scrapers */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />

        {/* Structured Data Schema for Rich Google Search Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Organic Gold Garlic - Peeled Garlic",
              image: `${SITE_URL}/og-share.jpg`,
              description:
                "Buy fresh peeled garlic and organic bulk peeled garlic with Pan-India delivery and competitive wholesale rates for restaurants and homes.",
              brand: {
                "@type": "Brand",
                name: "Organic Gold Garlic",
              },
              offers: [
                {
                  "@type": "Offer",
                  name: "250g Peeled Garlic Pack",
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                  url: `${SITE_URL}/#products`,
                },
                {
                  "@type": "Offer",
                  name: "1kg Peeled Garlic Pack",
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                  url: `${SITE_URL}/#products`,
                },
                {
                  "@type": "Offer",
                  name: "Bulk Peeled Garlic Commercial Supply",
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    priceCurrency: "INR",
                  },
                  description: "Enquire for wholesale commercial rates with Pan-India delivery",
                  availability: "https://schema.org/InStock",
                  url: `${SITE_URL}/#enquiry`,
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-cream text-ink antialiased">
        {children}
        <WhatsAppButton />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#14301c",
              color: "#fff",
              borderRadius: "14px",
              border: "1px solid rgba(201, 162, 39, 0.4)",
            },
            success: {
              iconTheme: {
                primary: "#c9a227",
                secondary: "#14301c",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
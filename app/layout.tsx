import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://organicgoldgarlic.com"),
  title: "Buy Peeled Garlic | Buy Organic Peeled Garlic & Bulk Peeled Garlic | Organic Gold Garlic",
  description:
    "Buy peeled garlic online from Organic Gold Garlic. 100% natural, fresh, chemical-free peeled garlic. 250g @ ₹100, 1kg @ ₹200. Buy bulk peeled garlic at competitive wholesale rates with Pan-India delivery for restaurants & hotels.",
  keywords: [
    "buy peeled garlic",
    "buy organic peeled garlic",
    "buy bulk peeled garlic",
    "peeled garlic online",
    "fresh peeled garlic supplier",
    "restaurant garlic delivery",
    "bulk garlic wholesale India",
    "organic garlic supplier",
    "ready to use peeled garlic",
    "vacuum packed peeled garlic",
    "peeled garlic Bihar",
    "peeled garlic price per kg",
    "commercial peeled garlic",
    "garlic cloves wholesale",
  ],
  authors: [{ name: "Organic Gold Garlic" }],
  creator: "Organic Gold Garlic",
  publisher: "Organic Gold Garlic",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://organicgoldgarlic.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://organicgoldgarlic.com",
    siteName: "Organic Gold Garlic",
    title: "Buy Peeled Garlic | Buy Organic Peeled Garlic & Bulk Peeled Garlic",
    description:
      "Order fresh, chemical-free peeled garlic. 250g @ ₹100, 1kg @ ₹200. Buy bulk peeled garlic with Pan-India delivery, competitive rates & reliable restaurant supply.",
    images: [
      {
        url: "/product-pack.jpg",
        width: 1200,
        height: 630,
        alt: "Organic Gold Garlic - Buy Premium Peeled Garlic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Peeled Garlic | Organic Gold Garlic",
    description:
      "Buy organic peeled garlic & bulk peeled garlic online. Pan-India delivery, competitive wholesale rates for restaurants & caterers.",
    images: ["/product-pack.jpg"],
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
        {/* Structured Data Schema for Rich Google Search Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Organic Gold Garlic - Peeled Garlic",
              image: "https://organicgoldgarlic.com/product-pack.jpg",
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
                  price: "100",
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                  url: "https://organicgoldgarlic.com/#products",
                },
                {
                  "@type": "Offer",
                  name: "1kg Peeled Garlic Pack",
                  price: "200",
                  priceCurrency: "INR",
                  availability: "https://schema.org/InStock",
                  url: "https://organicgoldgarlic.com/#products",
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
                  url: "https://organicgoldgarlic.com/#enquiry",
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

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Organic Fresh Gold Garlic – Premium Peeled Garlic | Araria, Bihar",
  description:
    "Buy premium quality fresh peeled garlic from Araria, Bihar. 100% natural, pure & ready to use. Available in 250g (₹100) and 1kg (₹200) packs. Bulk order enquiries welcome.",
  keywords: [
    "peeled garlic",
    "organic garlic",
    "bulk garlic",
    "fresh garlic Bihar",
    "garlic wholesale",
    "gold garlic",
    "natural garlic",
    "Araria garlic",
    "garlic peeling factory",
  ],
  authors: [{ name: "Organic Fresh Gold Garlic" }],
  creator: "Organic Fresh Gold Garlic",
  publisher: "Organic Fresh Gold Garlic",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://organicgoldgarlic.vercel.app",
    siteName: "Organic Fresh Gold Garlic",
    title: "Organic Fresh Gold Garlic – Premium Peeled Garlic | Araria, Bihar",
    description:
      "Buy premium quality fresh peeled garlic from Araria, Bihar. 100% natural, pure & ready to use. 250g: ₹100, 1kg: ₹200. Wholesale bulk supply available.",
    images: [
      {
        url: "/product-pack.jpg",
        width: 1200,
        height: 630,
        alt: "Organic Fresh Gold Garlic – Premium Peeled Garlic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Fresh Gold Garlic – Premium Peeled Garlic",
    description:
      "100% natural, pure & ready to use peeled garlic from Araria, Bihar. Bulk orders welcome.",
    images: ["/product-pack.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink antialiased">
        {children}
        <WhatsAppButton />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a5c2a",
              color: "#fff",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#c9a227",
                secondary: "#1a5c2a",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import EnquirySection from "@/components/EnquirySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  title: "Organic Gold Garlic – Buy Premium Peeled Garlic Online | Pan-India Delivery",
  description:
    "Buy premium quality fresh peeled garlic from Organic Gold Garlic. 100% natural, pure & ready to cook. Vacuum-sealed 250g, 1kg & bulk commercial supply with Pan-India delivery from Araria, Bihar.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Organic Gold Garlic",
    title: "Organic Gold Garlic – 100% Pure & Fresh Peeled Garlic Online",
    description:
      "Buy 100% chemical-free peeled garlic cloves. Vacuum packed for maximum freshness & aroma. Pan-India delivery for kitchens & restaurants.",
    images: [
      {
        url: `${SITE_URL}/og-share.jpg`,
        secureUrl: `${SITE_URL}/og-share.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Organic Gold Garlic - Premium Peeled Garlic Packs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Organic Gold Garlic – Buy Peeled Garlic Online",
    description:
      "100% pure peeled garlic cloves with fast doorstep delivery across India.",
    images: [`${SITE_URL}/og-share.jpg`],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf5] overflow-x-hidden">
      <Navbar />
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Buy Section (Products Section immediately after Hero) */}
      <ProductsSection />

      {/* 3. Farm-to-Table Journey Section (AboutSection) placed after Buy */}
      <AboutSection />

      {/* 4. Commercial Video Section with Fast-Start Optimization */}
      <VideoSection />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Bulk Order Enquiry Form */}
      <EnquirySection />

      {/* 7. Contact Details */}
      <ContactSection />

      {/* 8. Footer */}
      <Footer />
    </main>
  );
}

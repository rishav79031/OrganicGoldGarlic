import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import EnquirySection from "@/components/EnquirySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Organic Fresh Gold Garlic – Premium Peeled Garlic | Araria, Bihar",
  description:
    "Buy premium quality fresh peeled garlic from Araria, Bihar. 100% natural, pure & ready to use. Available in 250g and 1kg packs. Bulk order enquiries welcome.",
  alternates: {
    canonical: "https://organicgoldgarlic.in",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <WhyChooseUs />
      <EnquirySection />
      <ContactSection />
      <Footer />
    </main>
  );
}

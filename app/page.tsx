import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import ProductsSection from "@/components/ProductsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import EnquirySection from "@/components/EnquirySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Organic Gold Garlic – Buy Premium Peeled Garlic Online | Pan-India Delivery",
  description:
    "Buy premium quality fresh peeled garlic from Organic Gold Garlic. 100% natural, pure & ready to use. 250g @ ₹100, 1kg @ ₹200. Buy bulk peeled garlic with Pan-India delivery & competitive restaurant rates.",
  alternates: {
    canonical: "https://organicgoldgarlic.com",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbfaf5] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <VideoSection />
      <ProductsSection />
      <WhyChooseUs />
      <EnquirySection />
      <ContactSection />
      <Footer />
    </main>
  );
}

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EnquirySection from "@/components/EnquirySection";
import type { Metadata } from "next";

const SITE_URL = "https://organicgoldgarlic.com";

export const metadata: Metadata = {
  title: "Contact Us & Facility Address | Organic Gold Garlic – Araria, Bihar",
  description:
    "Get in touch with Organic Gold Garlic in Shivpuri Ward 09, Araria, Bihar (854311). Call or WhatsApp +91 74885 03664 for retail packs, restaurant orders, and bulk supply.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/contact`,
    siteName: "Organic Gold Garlic",
    title: "Contact Organic Gold Garlic – Araria, Bihar",
    description:
      "Call or WhatsApp +91 74885 03664. Direct peeled garlic supply from Shivpuri Ward 09, Araria, Bihar – 854311.",
    images: [
      {
        url: `${SITE_URL}/og-share.jpg`,
        secureUrl: `${SITE_URL}/og-share.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Organic Gold Garlic - Contact & Facility in Araria, Bihar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Organic Gold Garlic – Araria, Bihar",
    description:
      "Direct contact & facility location: Shivpuri Ward 09, Araria, Bihar. Phone / WhatsApp: +91 74885 03664.",
    images: [`${SITE_URL}/og-share.jpg`],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-primary-dark via-primary to-emerald-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-block text-gold-light text-xs font-bold uppercase tracking-widest px-3 py-1 bg-gold/20 rounded-full border border-gold/40 mb-3">
            Reach Out Directly
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-4">
            Contact & Facility Details
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            We are always here to assist with product enquiries, bulk distribution, order tracking, and restaurant supply.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Phone / WhatsApp */}
          <div className="bg-white p-7 rounded-3xl border-2 border-gold/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-2xl mb-4">
                📱
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-1">Phone & WhatsApp</h3>
              <p className="text-gray-500 text-xs mb-4">Available 7 days a week (9 AM – 9 PM)</p>
              <div className="space-y-1">
                <a
                  href="tel:7488503664"
                  className="text-lg font-bold text-gray-800 hover:text-gold-dark block transition-colors"
                >
                  +91 74885 03664
                </a>
                <p className="text-xs text-gray-400">Direct helpline & order booking</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <a
                href="https://wa.me/917488503664?text=Hello%20Organic%20Gold%20Garlic,%20I%20am%20contacting%20you%20via%20your%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1fb854] text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Card 2: Facility Address */}
          <div className="bg-white p-7 rounded-3xl border-2 border-gold/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-2xl mb-4">
                📍
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-1">Facility & Office</h3>
              <p className="text-gray-500 text-xs mb-4">Unit location & dispatches</p>
              <address className="not-italic text-sm text-gray-700 leading-relaxed">
                <strong>Organic Fresh Gold Garlic</strong><br />
                Shivpuri Ward No 09<br />
                Araria, Bihar – <strong>854311</strong><br />
                India
              </address>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <span className="inline-block px-3 py-1 rounded-md bg-gold/15 text-gold-dark text-[11px] font-bold">
                Pincode: 854311
              </span>
            </div>
          </div>

          {/* Card 3: Bulk / Commercial Deals */}
          <div className="bg-white p-7 rounded-3xl border-2 border-primary/30 shadow-xl flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-2xl mb-4">
                💼
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-1">Wholesale & Bulk Supply</h3>
              <p className="text-gray-500 text-xs mb-4">Hotels, Caterers & Resellers</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                We handle bulk garlic peeling contracts with <strong>confidential bulk pricing</strong>. Custom packaging and scheduled weekly logistics are provided.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <a
                href="#enquiry"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow transition-all"
              >
                Request Custom Quote ↓
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Embedded Enquiry Form */}
      <EnquirySection />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

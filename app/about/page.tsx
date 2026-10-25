import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Organic Gold Garlic - Buy Peeled Garlic",
  description: "Learn about Organic Gold Garlic in Araria, Bihar. We supply clean, chemical-free peeled garlic with Pan-India delivery and competitive wholesale rates for restaurants and homes.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf5]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#08130b] via-primary-dark to-[#08130b] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-light border border-gold/40 text-xs font-bold uppercase tracking-widest mb-4">
            <span>Our Heritage & Process</span>
          </div>
          <h1 className="font-brand text-4xl sm:text-6xl font-normal mb-5 leading-tight">
            Pioneering Pure & Clean <br />
            <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
              Peeled Garlic in India
            </span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            From the fertile soils of Seemanchal, Bihar to top restaurants and home kitchens nationwide — discover our commitment to hygiene, authentic flavor, and zero chemicals.
          </p>
        </div>
      </section>

      {/* Origin Story Grid with WebP Images */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative w-full h-[380px] sm:h-[480px] rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl">
              <Image
                src="/product-pack-kitchen.webp"
                alt="Organic Gold Garlic Kitchen Pack"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-gold/30 hidden sm:block">
              <p className="font-brand font-bold text-primary text-xl">100% Natural</p>
              <p className="text-xs text-gray-500">Zero Chemical Preservation</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-gold-dark font-bold text-xs uppercase tracking-widest">
              Who We Are
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-primary leading-tight">
              Hygienic Peeling Facility Built for Culinary Excellence
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-light">
              <strong>Organic Gold Garlic</strong> operates a modern agro-processing unit in <em>Araria, Bihar (Pin: 854311)</em>. We eliminate the tedious, tearful task of peeling garlic for both home cooks and bustling commercial kitchens.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-light">
              Conventional peeled garlic in the market is often treated with bleach or harsh chemicals to stay white. We take a different approach: sourcing naturally grown garlic bulbs, mechanical sorting, washing with pure water, and vacuum-sealing immediately.
            </p>

            {/* Showcase Bowl Image */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gold/30 shadow-md">
              <Image
                src="/peeled-garlic-bowl.webp"
                alt="Bowl of Fresh Peeled Garlic Cloves"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-xs font-semibold text-white">Fresh, plump, ready-to-use cloves</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-gold/20">
                <span className="text-2xl font-brand font-bold text-primary block">₹100</span>
                <span className="text-xs text-gray-600 font-medium">250g Household Pack</span>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-600/20">
                <span className="text-2xl font-brand font-bold text-primary block">₹200</span>
                <span className="text-xs text-gray-600 font-medium">1kg Chef Value Pack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-white border-y border-gold/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-primary mb-2">Why Buy From Organic Gold Garlic?</h2>
            <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">Uncompromising standards in every bag</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Pan-India Delivery", desc: "Reliable refrigerated and express doorstep logistics across India.", icon: "🚚" },
              { title: "Competitive Rates", desc: "Direct farm-to-consumer pricing with special bulk wholesale volume tiers.", icon: "💰" },
              { title: "Restaurant Delivery", desc: "Daily & weekly peeled garlic supply contracts for hotels & cloud kitchens.", icon: "🍽️" },
              { title: "100% Pure & Clean", desc: "Zero bleaching, zero chemicals, pure fresh taste in every clove.", icon: "🌱" },
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#fbfaf5] border border-gold/20 hover:border-gold transition-colors">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-brand font-bold text-lg text-primary mb-1">{p.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-[#08130b] to-primary-dark text-white p-8 sm:p-12 rounded-3xl border-2 border-gold/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h2 className="font-brand text-3xl sm:text-4xl font-bold">Ready to Buy Peeled Garlic?</h2>
            <p className="text-white/80 text-sm max-w-lg mx-auto font-light">
              Order individual packs or request wholesale bulk quotes with Pan-India delivery.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#enquiry"
                className="px-6 py-3 bg-gold hover:bg-gold-light text-[#08130b] font-bold rounded-full text-xs uppercase tracking-widest shadow transition-all"
              >
                Send Order Enquiry
              </Link>
              <a
                href={`https://wa.me/917488503664?text=${encodeURIComponent("Hi Organic Gold Garlic, I am interested in buying peeled garlic.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#25D366] hover:bg-[#1fb854] text-white font-bold rounded-full text-xs uppercase tracking-widest shadow transition-all"
              >
                WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MACHINE_SPECS = [
  {
    icon: "⚙️",
    title: "Clove Separator (Breaker)",
    desc: "Breaks whole garlic bulbs into individual cloves smoothly without cutting or skin crushing.",
  },
  {
    icon: "💨",
    title: "Pneumatic Air Peeling Unit",
    desc: "Uses high-pressure dry air blast for 98%+ skin peeling without water, preserving natural oils.",
  },
  {
    icon: "🛠️",
    title: "Industrial Air Compressor",
    desc: "Heavy-duty commercial screw compressor engineered for continuous 8–12 hours daily factory runs.",
  },
  {
    icon: "🔍",
    title: "SS304 Sorting & Grading Table",
    desc: "Food-grade stainless steel inspection table ensuring pristine, premium export-grade garlic cloves.",
  },
  {
    icon: "📦",
    title: "Vacuum & Nitrogen Packaging",
    desc: "Airtight vacuum sealing with nitrogen flush for extended 30+ days fresh shelf life without chemicals.",
  },
  {
    icon: "🌾",
    title: "Raw Material & Mandi Sourcing",
    desc: "Direct farm-gate supply tie-ups across Bihar, MP & Rajasthan at unbeatable bulk wholesale rates.",
  },
];

const whatsappFranchiseUrl = `https://wa.me/917488503664?text=${encodeURIComponent(
  "Hi Organic Gold Garlic, I want to take a Franchise with Full Machine Setup. Please share the machinery catalog, investment quotation, and setup process."
)}`;

export default function FranchiseSection() {
  return (
    <section
      id="franchise"
      className="scroll-mt-24 sm:scroll-mt-28 py-16 sm:py-24 bg-gradient-to-b from-[#0e2414] via-[#091a0e] to-[#08130b] text-white relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold-light text-[11px] font-bold tracking-[0.2em] uppercase mb-4 border border-gold/30">
            <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span>Turnkey Business Opportunity &bull; Pan-India</span>
          </div>

          <h2 className="font-brand text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Take Franchise of Organic Gold Garlic with <span className="text-gold">Full Machine Setup</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
            Start your own high-profit peeled garlic manufacturing & distribution unit in your city.
            We provide end-to-end industrial peeling machinery, raw garlic sourcing, branding, and verified buyer support.
          </p>
        </div>

        {/* Feature Grid & Visual Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 sm:mb-16">
          
          {/* Left Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-gold/30 bg-white/5 backdrop-blur-md shadow-2xl p-6 sm:p-8">
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-6 border border-white/10">
                <Image
                  src="/story-2-sorting-peeling.webp"
                  alt="Industrial Garlic Peeling Machine Setup"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-widest text-gold-light font-bold bg-black/60 px-2.5 py-1 rounded-full border border-gold/40">
                    Industrial Dry Peeling Line
                  </span>
                  <p className="text-white font-brand text-lg font-bold mt-1">
                    Complete Machine Setup
                  </p>
                </div>
              </div>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">Peeling Rate</span>
                  <strong className="text-gold text-lg sm:text-xl font-bold font-brand">98%+</strong>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">Gross Margin</span>
                  <strong className="text-emerald-400 text-lg sm:text-xl font-bold font-brand">30-45%</strong>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] uppercase text-gray-400 block font-semibold">Payback</span>
                  <strong className="text-white text-lg sm:text-xl font-bold font-brand">3-6 Mo</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Pillars of the Machine Setup */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MACHINE_SPECS.map((spec, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-gold/40 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                  {spec.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-gold transition-colors font-brand">
                  {spec.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {spec.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Action Callout Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-gold/20 via-primary/30 to-gold/20 border-2 border-gold/40 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-gold-light font-bold block mb-1">
              Direct Manufacturer & Brand Support
            </span>
            <h3 className="font-brand text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to setup your Peeled Garlic Plant?
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 font-light">
              Connect with our founders for complete machinery quotation, site requirements, and turnkey franchise onboarding.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full md:w-auto">
            {/* WhatsApp Direct */}
            <a
              href={whatsappFranchiseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Contact on WhatsApp</span>
            </a>

            {/* Franchise Page Link */}
            <Link
              href="/franchise"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-gold/50 text-white hover:text-gold text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Apply Online & Details →</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

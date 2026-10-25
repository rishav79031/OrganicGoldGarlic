import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Organic Fresh Gold Garlic - Araria, Bihar",
  description: "Learn about Organic Fresh Gold Garlic, our sustainable garlic processing unit in Araria Shivpuri, Bihar, and our mission to deliver pure peeled garlic directly to kitchens.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 bg-gradient-to-b from-primary-dark via-primary to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none"
             style={{
               backgroundImage: "radial-gradient(#c9a227 1px, transparent 1px)",
               backgroundSize: "24px 24px"
             }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-light border border-gold/40 text-xs font-bold uppercase tracking-widest mb-4">
            <span>Our Roots & Story</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mb-6">
            Pioneering Clean & Pure <br />
            <span className="text-gradient">Garlic From Bihar</span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From the fertile soils of Seemanchal to modern kitchens across India — discover how Organic Fresh Gold Garlic was founded on authenticity, hygiene, and convenience.
          </p>
        </div>
      </section>

      {/* Origin Story Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border-4 border-gold/40 shadow-2xl">
              <Image
                src="/product-pack.jpg"
                alt="Organic Gold Garlic Brand Pack"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border-2 border-gold/30 hidden sm:block">
              <p className="font-serif font-bold text-primary text-xl">100% Pure</p>
              <p className="text-xs text-gray-500">Zero Chemical Preservation</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-gold-dark font-bold text-xs uppercase tracking-widest">
              Who We Are
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary leading-tight">
              A Modern Agro-Processing Venture Rooted in Araria
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <strong>Organic Fresh Gold Garlic</strong> is established in <em>Shivpuri Ward No 09, Araria, Bihar (Pin: 854311)</em>. We recognized that peeling garlic is one of the most tedious, time-consuming tasks in both home kitchens and bustling restaurant environments.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Conventional market garlic is often treated with chemicals or bleaching agents to increase shelf life. We decided to do it differently: sourcing naturally cultivated, pungent garlic bulbs directly, peeling them in temperature-controlled sanitary facilities, and vacuum-sealing them immediately.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold/20">
              <div className="bg-amber-50/70 p-4 rounded-xl border border-gold/20">
                <span className="text-2xl font-serif font-bold text-primary block">₹100</span>
                <span className="text-xs text-gray-600 font-medium">Affordable 250g pack</span>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-600/20">
                <span className="text-2xl font-serif font-bold text-primary block">₹200</span>
                <span className="text-xs text-gray-600 font-medium">Economical 1kg family pack</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our 4 Core Pillars */}
      <section className="py-16 bg-white border-y border-gold/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-2">Our Quality Standard</h2>
            <p className="text-gray-500 text-sm">Every packet carries the promise of purity</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Fresh & Clean", desc: "Thoroughly washed with pure water and mechanically sorted for blemishes.", icon: "💧" },
              { title: "Pure & Natural", desc: "No artificial white dyes, sulphur, or preservatives added.", icon: "🌱" },
              { title: "Ready to Use", desc: "Open the pouch and toss straight into tadka, paste, or marinades.", icon: "⚡" },
              { title: "Bihar Sourced", desc: "Empowering regional farmers and agro-entrepreneurship in Araria.", icon: "🌾" },
            ].map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-cream border border-gold/20 hover:border-gold transition-colors">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-serif font-bold text-lg text-primary mb-1">{p.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Card */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-emerald-900 to-primary-dark text-white p-8 sm:p-12 rounded-3xl border-2 border-gold/40 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <span className="text-gold-light text-xs font-bold uppercase tracking-widest">
              Visit or Contact Facility
            </span>
            <h2 className="font-serif text-3xl font-bold">Organic Fresh Gold Garlic</h2>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
              Shivpuri Ward No 09, Near Araria Court / Town Area, <br />
              Pincode: <strong>854311</strong>, Araria, Bihar, India
            </p>
            <p className="text-gold-light font-semibold text-sm">
              Phone / WhatsApp: +91 7488503664
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#enquiry"
                className="px-6 py-3 bg-gold hover:bg-gold-dark text-primary-dark font-bold rounded-xl text-sm transition-all shadow"
              >
                Send Bulk Order Query
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-all border border-white/30"
              >
                Contact Page →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}

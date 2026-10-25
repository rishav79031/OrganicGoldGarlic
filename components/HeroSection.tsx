"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Elegantly distributed 🧄 emojis with larger sizes, subtle white-scaling, and varied float rhythms
const EMOJI_PARTICLES = [
  { id: 1, left: "4%", top: "14%", size: "text-4xl sm:text-5xl", duration: 7.5, delay: 0, opacity: "opacity-45" },
  { id: 2, left: "86%", top: "12%", size: "text-3xl sm:text-4xl", duration: 8.5, delay: 1.2, opacity: "opacity-40" },
  { id: 3, left: "74%", top: "68%", size: "text-5xl sm:text-6xl", duration: 7.8, delay: 0.5, opacity: "opacity-50" },
  { id: 4, left: "8%", top: "64%", size: "text-4xl sm:text-5xl", duration: 8, delay: 2, opacity: "opacity-40" },
  { id: 5, left: "48%", top: "6%", size: "text-3xl sm:text-4xl", duration: 9, delay: 1.8, opacity: "opacity-35" },
  { id: 6, left: "26%", top: "82%", size: "text-4xl sm:text-5xl", duration: 7.2, delay: 2.8, opacity: "opacity-45" },
  { id: 7, left: "91%", top: "44%", size: "text-4xl sm:text-5xl", duration: 8.2, delay: 1.5, opacity: "opacity-45" },
  { id: 8, left: "2%", top: "38%", size: "text-3xl sm:text-4xl", duration: 9.5, delay: 3.2, opacity: "opacity-35" },
  { id: 9, left: "62%", top: "88%", size: "text-4xl sm:text-5xl", duration: 8.8, delay: 0.8, opacity: "opacity-40" },
  { id: 10, left: "38%", top: "45%", size: "text-2xl sm:text-3xl", duration: 10, delay: 2.4, opacity: "opacity-30" },
  { id: 11, left: "82%", top: "86%", size: "text-3xl sm:text-4xl", duration: 7.6, delay: 3.5, opacity: "opacity-40" },
  { id: 12, left: "18%", top: "18%", size: "text-3xl sm:text-4xl", duration: 8.4, delay: 1, opacity: "opacity-35" },
];

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 18;
      const y = (e.clientY / innerHeight - 0.5) * 18;
      parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const whatsappHeroText = encodeURIComponent(
    "Hi Organic Gold Garlic, I would like to enquire about purchasing peeled garlic. Please share current rates and delivery details."
  );

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 bg-[#08130b]"
    >
      {/* Luxury Golden Atmospheric Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 45%, #C9A227 0%, transparent 55%), radial-gradient(circle at 75% 40%, #F5E6B2 0%, transparent 50%), radial-gradient(circle at 50% 90%, #ECC452 0%, transparent 60%)",
        }}
      />

      {/* Floating Whitescaled 🧄 Emojis (Bigger, 12 distributed particles) */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none z-0">
        {EMOJI_PARTICLES.map((item) => (
          <div
            key={item.id}
            className={`absolute ${item.size} ${item.opacity} select-none transition-transform`}
            style={{
              left: item.left,
              top: item.top,
              animation: `floatSmooth ${item.duration}s ease-in-out ${item.delay}s infinite`,
              // Whitescale filter: makes the garlic emoji bright white-tinted with soft shadow
              filter: "brightness(1.35) contrast(0.9) drop-shadow(0 8px 16px rgba(255,255,255,0.18)) drop-shadow(0 4px 12px rgba(0,0,0,0.7))",
            }}
          >
            🧄
          </div>
        ))}
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Top Quality Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-gold/30 text-gold-light text-xs font-medium mb-6 tracking-[0.2em] uppercase backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>100% Organically Farmed &bull; Pure Quality</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-brand text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-tight mb-5"
            >
              Nature&apos;s Goodness, <br />
              <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
                Purely Peeled.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gold-light/90 text-sm sm:text-base font-medium tracking-[0.25em] uppercase mb-5 flex items-center justify-center lg:justify-start gap-3"
            >
              <span>Pure</span>
              <span className="text-gold">&bull;</span>
              <span>Fresh</span>
              <span className="text-gold">&bull;</span>
              <span>Healthy</span>
            </motion.p>

            {/* Core Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-6 text-xs text-white/90 font-medium"
            >
              <span className="px-3 py-1 rounded-full bg-white/10 border border-gold/30 flex items-center gap-1.5">
                <span className="text-gold">✓</span> Pan-India Delivery
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-gold/30 flex items-center gap-1.5">
                <span className="text-gold">✓</span> Competitive Wholesale Rates
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-gold/30 flex items-center gap-1.5">
                <span className="text-gold">✓</span> Daily Restaurant Delivery
              </span>
            </motion.div>

            {/* SEO Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/75 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light mb-8"
            >
              Buy premium peeled garlic and organic bulk peeled garlic online. Hand-harvested from local farms, hygienically peeled with zero chemicals, and vacuum-sealed ready for kitchens and restaurants.
            </motion.p>

            {/* Pricing Strip: Bulk Supply marked as "Enquire" + Market Rate Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="max-w-md mx-auto lg:mx-0 mb-8"
            >
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 p-2 rounded-2xl bg-white/[0.04] border border-white/10 mb-2.5">
                <div className="text-center p-3 rounded-xl bg-black/20">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">250g Pack</span>
                  <strong className="text-white text-base sm:text-lg font-brand">₹100</strong>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/20 border border-gold/40">
                  <span className="text-[10px] uppercase tracking-wider text-gold-light block mb-0.5 font-medium">1 kg Pack</span>
                  <strong className="text-white text-base sm:text-lg font-brand">₹200</strong>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/20">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Bulk Supply</span>
                  <strong className="text-gold text-xs sm:text-sm font-semibold block mt-0.5 uppercase tracking-wide">
                    Enquire
                  </strong>
                </div>
              </div>

              {/* Market Rate Disclaimer */}
              <p className="text-[11px] text-gold-light/60 italic text-center lg:text-left flex items-center justify-center lg:justify-start gap-1">
                <span>* Note: Rates may differ as per daily market rate & seasonal harvest.</span>
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start"
            >
              <a
                href="#enquiry"
                className="px-7 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] bg-gradient-to-r from-gold via-amber-400 to-gold text-[#08130b] hover:shadow-lg hover:shadow-gold/30 transition-all duration-300 text-center font-bold"
              >
                Buy Bulk Peeled Garlic &rarr;
              </a>

              <a
                href={`https://wa.me/917488503664?text=${whatsappHeroText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] border border-white/20 hover:border-gold text-white hover:bg-white/[0.05] transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Hero Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-sm sm:max-w-md"
            >
              <div className="absolute inset-0 bg-gold/20 rounded-[36px] blur-2xl transform scale-105 pointer-events-none" />
              <div className="absolute -inset-3 rounded-[40px] border border-gold/30 pointer-events-none" />

              <div className="relative rounded-[32px] overflow-hidden border-2 border-gold/50 shadow-2xl bg-black/50 group">
                <div className="relative w-full h-[410px] sm:h-[470px]">
                  <Image
                    src="/story-4-packed-ready.webp"
                    alt="Organic Gold Garlic - Peeled Garlic Package in Kitchen"
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-xl border border-gold/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#14301c] uppercase tracking-wider">Pan-India Delivery</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-gold-light block text-[10px] uppercase tracking-widest font-medium">Ready to Cook</span>
                    <strong className="text-white text-sm font-brand text-base sm:text-lg">Buy Peeled Garlic</strong>
                  </div>
                  <Link
                    href="#products"
                    className="px-3.5 py-1.5 rounded-full bg-gold hover:bg-gold-light text-[#08130b] font-bold text-xs uppercase tracking-wider transition-colors shadow"
                  >
                    View Packs
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

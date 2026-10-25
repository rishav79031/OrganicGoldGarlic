"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Steady falling 🧄 icons scaling up on desktop with screen size
const FALLING_GARLICS = [
  { id: 1, left: "4%", size: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl", duration: 14, delay: 0 },
  { id: 2, left: "16%", size: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl", duration: 16, delay: 4 },
  { id: 3, left: "30%", size: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl", duration: 15, delay: 1.5 },
  { id: 4, left: "46%", size: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl", duration: 18, delay: 7 },
  { id: 5, left: "60%", size: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl", duration: 13, delay: 3 },
  { id: 6, left: "74%", size: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl", duration: 17, delay: 6 },
  { id: 7, left: "86%", size: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl", duration: 15, delay: 2 },
  { id: 8, left: "94%", size: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl", duration: 19, delay: 9 },
];

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!parallaxRef.current || window.innerWidth < 768) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
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
      className="relative min-h-[75vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 sm:pt-36 pb-8 sm:pb-20 bg-[#08130b]"
    >
      {/* Luxury Golden Atmospheric Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 sm:opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, #C9A227 0%, transparent 60%)",
        }}
      />

      {/* Steady Speed Falling Garlic Icons (Whitescaled) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {FALLING_GARLICS.map((g) => (
          <div
            key={g.id}
            className={`absolute ${g.size} select-none animate-steady-fall`}
            style={{
              left: g.left,
              animationDuration: `${g.duration}s`,
              animationDelay: `${g.delay}s`,
              filter: "brightness(1.4) drop-shadow(0 4px 10px rgba(0,0,0,0.8))",
            }}
          >
            🧄
          </div>
        ))}
      </div>

      {/* Main Hero Container: Utilise Space Better on Desktop */}
      <div className="relative z-10 max-w-[96%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* Main Hero Column: Aligned cleanly to the left on larger screens */}
          <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left lg:pr-2 xl:pr-6">
            
            {/* Minimal Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-gold/30 text-gold-light text-[10px] sm:text-xs font-semibold mb-3 sm:mb-6 tracking-[0.2em] uppercase backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>100% Organically Farmed</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-brand text-3xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.1] tracking-tight mb-2 sm:mb-5"
            >
              Nature&apos;s Goodness, <br />
              <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
                Purely Peeled.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gold-light/90 text-xs sm:text-sm font-medium tracking-[0.25em] uppercase mb-4 sm:mb-5 flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3"
            >
              <span>Pure</span>
              <span className="text-gold">&bull;</span>
              <span>Fresh</span>
              <span className="text-gold">&bull;</span>
              <span>Healthy</span>
            </motion.p>

            {/* MOBILE ONLY: Image at Top, then Note, then Buttons */}
            <div className="lg:hidden my-2.5 max-w-[240px] mx-auto">
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden border border-gold/40 shadow-xl bg-black/60 mb-2">
                <div className="relative w-full h-[210px]">
                  <Image
                    src="/story-4-packed-ready.webp"
                    alt="Organic Gold Garlic - Peeled Garlic Package"
                    fill
                    sizes="240px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10 flex items-center justify-between">
                  <span className="text-gold-light text-[9px] uppercase tracking-widest font-semibold">100% Natural Garlic</span>
                  <span className="text-[9px] text-white/80">Ready to Cook</span>
                </div>
              </div>

              {/* Note below image */}
              <p className="text-[9px] text-gold-light/75 italic text-center mb-2.5">
                * Note: Rates may differ as per market rate & harvest.
              </p>

              {/* Buy packs button and Enquire button */}
              <div className="flex flex-row gap-2 justify-center">
                <a
                  href="#products"
                  className="flex-1 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-gold via-amber-400 to-gold text-[#08130b] shadow-md text-center"
                >
                  Buy Packs &rarr;
                </a>
                <a
                  href={`https://wa.me/917488503664?text=${whatsappHeroText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/25 text-white hover:border-gold transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Enquire</span>
                </a>
              </div>
            </div>

            {/* DESKTOP ONLY: Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="hidden lg:flex flex-wrap items-center justify-start gap-3 mb-6 text-xs text-white/90"
            >
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-gold/25">
                ✓ Pan-India Delivery
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-gold/25">
                ✓ Competitive Rates
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 border border-gold/25">
                ✓ Restaurant Delivery
              </span>
            </motion.div>

            {/* DESKTOP ONLY: Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block text-white/75 text-base max-w-xl leading-relaxed font-light mb-8"
            >
              Hand-harvested garlic bulbs from local farms, hygienically peeled with zero bleaching or chemicals.
              Vacuum-sealed fresh cloves ready to cook for home kitchens, hotels & restaurants.
            </motion.p>

            {/* DESKTOP ONLY: Pricing Cards Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="hidden lg:block max-w-md mb-8"
            >
              <div className="grid grid-cols-3 gap-3 p-2 rounded-2xl bg-white/[0.04] border border-white/10 mb-2">
                <div className="text-center p-2.5 rounded-xl bg-black/30">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block">250g</span>
                  <strong className="text-white text-lg font-brand">₹100</strong>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-black/30 border border-gold/40">
                  <span className="text-[10px] uppercase tracking-wider text-gold-light block font-medium">1 kg</span>
                  <strong className="text-white text-lg font-brand">₹200</strong>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-black/30">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Bulk</span>
                  <strong className="text-gold text-sm font-semibold block mt-0.5 uppercase tracking-wide">
                    Enquire
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-gold-light/60 italic text-left">
                * Note: Rates may differ as per market rate & harvest.
              </p>
            </motion.div>

            {/* DESKTOP ONLY: CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden lg:flex flex-row gap-3.5 justify-start"
            >
              <a
                href="#products"
                className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] bg-gradient-to-r from-gold via-amber-400 to-gold text-[#08130b] hover:shadow-lg transition-all text-center font-bold"
              >
                Buy Packs &rarr;
              </a>

              <a
                href={`https://wa.me/917488503664?text=${whatsappHeroText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.15em] border border-white/20 hover:border-gold text-white transition-all text-center flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Enquire</span>
              </a>
            </motion.div>
          </div>

          {/* DESKTOP ONLY: Bigger Right Column Hero Product Mockup */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-md xl:max-w-lg"
            >
              <div className="relative rounded-3xl overflow-hidden border border-gold/40 shadow-2xl bg-black/60">
                <div className="relative w-full h-[480px] xl:h-[530px]">
                  <Image
                    src="/story-4-packed-ready.webp"
                    alt="Organic Gold Garlic - Peeled Garlic Package"
                    fill
                    sizes="(max-width: 1280px) 450px, 550px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl py-1.5 px-3.5 border border-gold/40 flex items-center gap-1.5 shadow">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#14301c] uppercase tracking-wider">Pan-India Delivery</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-gold-light block text-[10px] uppercase tracking-widest font-semibold">Ready to Cook</span>
                    <strong className="text-white text-sm sm:text-base font-brand">100% Natural Garlic</strong>
                  </div>
                  <Link
                    href="#products"
                    className="px-4 py-2 rounded-full bg-gold hover:bg-gold-light text-[#08130b] font-bold text-xs uppercase tracking-wider transition-colors shadow"
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

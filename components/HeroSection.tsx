"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Subtle floating garlic shapes for organic atmospheric depth
const CLOVES = [
  { id: 1, size: 52, left: "6%", top: "18%", duration: 9, rotate: 12 },
  { id: 2, size: 42, left: "88%", top: "15%", duration: 11, rotate: -25 },
  { id: 3, size: 64, left: "75%", top: "68%", duration: 10, rotate: 30 },
  { id: 4, size: 46, left: "10%", top: "72%", duration: 8.5, rotate: -15 },
  { id: 5, size: 38, left: "48%", top: "8%", duration: 12, rotate: 40 },
  { id: 6, size: 48, left: "26%", top: "82%", duration: 9.5, rotate: -35 },
];

function FloatingClove({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.35))" }}
    >
      <defs>
        <radialGradient id="cloveGlow" cx="40%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF7DE" />
          <stop offset="90%" stopColor="#ECC452" />
          <stop offset="100%" stopColor="#C9A227" />
        </radialGradient>
      </defs>
      <path
        d="M 50 14 C 70 36, 85 68, 78 102 C 70 124, 38 128, 26 112 C 12 96, 17 64, 35 36 C 42 24, 46 18, 50 14 Z"
        fill="url(#cloveGlow)"
      />
      <path
        d="M 44 28 C 56 46, 65 72, 60 98 C 58 106, 50 112, 40 110 C 35 98, 33 68, 38 42 Z"
        fill="white"
        fillOpacity="0.45"
      />
    </svg>
  );
}

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 bg-[#08130b]"
    >
      {/* Luxury Golden Atmospheric Radial Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 45%, #C9A227 0%, transparent 55%), radial-gradient(circle at 75% 40%, #F5E6B2 0%, transparent 50%), radial-gradient(circle at 50% 90%, #ECC452 0%, transparent 60%)",
        }}
      />

      {/* Floating Cloves Layer */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none z-0">
        {CLOVES.map((clove) => (
          <div
            key={clove.id}
            className="absolute"
            style={{
              left: clove.left,
              top: clove.top,
              transform: `rotate(${clove.rotate}deg)`,
              animation: `floatSmooth ${clove.duration}s ease-in-out infinite`,
            }}
          >
            <FloatingClove size={clove.size} opacity={0.35} />
          </div>
        ))}
      </div>

      {/* Main Hero Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Refined Editorial Copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Origin Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-gold/30 text-gold-light text-xs font-medium mb-6 tracking-[0.2em] uppercase backdrop-blur-md"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>Direct From Araria, Bihar &bull; 100% Organically Farmed</span>
            </motion.div>

            {/* Headline with Cormorant Garamond Serif */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-brand text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-tight mb-5"
            >
              Nature&apos;s Goodness, <br />
              <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
                in Every Clove.
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gold-light/90 text-sm sm:text-base font-medium tracking-[0.25em] uppercase mb-6 flex items-center justify-center lg:justify-start gap-3"
            >
              <span>Pure</span>
              <span className="text-gold">&bull;</span>
              <span>Fresh</span>
              <span className="text-gold">&bull;</span>
              <span>Healthy</span>
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-white/75 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light mb-8"
            >
              Hand-harvested garlic bulbs from the fertile soils of Seemanchal, meticulously peeled in hygienic, temperature-controlled facilities. 
              Zero bleaching, zero preservatives — fresh cloves ready for culinary perfection.
            </motion.p>

            {/* Minimal Price Cards Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md mx-auto lg:mx-0 mb-9 p-2 rounded-2xl bg-white/[0.04] border border-white/10"
            >
              <div className="text-center p-3 rounded-xl bg-black/20">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">250g Pack</span>
                <strong className="text-white text-base sm:text-lg font-brand">₹100</strong>
              </div>
              <div className="text-center p-3 rounded-xl bg-black/20 border border-gold/40">
                <span className="text-[10px] uppercase tracking-wider text-gold-light block mb-0.5 font-medium">1 kg Pack</span>
                <strong className="text-white text-base sm:text-lg font-brand">₹200</strong>
              </div>
              <div className="text-center p-3 rounded-xl bg-black/20">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Bulk Order</span>
                <strong className="text-gold text-xs sm:text-sm font-semibold block mt-0.5">Undisclosed*</strong>
              </div>
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
                Bulk Order Enquiry &rarr;
              </a>

              <a
                href="https://wa.me/917488503664?text=Hello%20Organic%20Gold%20Garlic,%20I%20am%20interested%20in%20ordering."
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.18em] border border-white/20 hover:border-gold text-white hover:bg-white/[0.05] transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <span>WhatsApp: 7488503664</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Premium Hero Mockup with Gold Halo */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-sm sm:max-w-md"
            >
              {/* Outer Golden Glow & Circular Accent */}
              <div className="absolute inset-0 bg-gold/20 rounded-[36px] blur-2xl transform scale-105 pointer-events-none" />
              <div className="absolute -inset-3 rounded-[40px] border border-gold/30 pointer-events-none" />

              {/* Product Pack Mockup Card */}
              <div className="relative rounded-[32px] overflow-hidden border-2 border-gold/50 shadow-2xl bg-black/50 group">
                <div className="relative w-full h-[400px] sm:h-[460px]">
                  <Image
                    src="/product-pack.jpg"
                    alt="Organic Gold Garlic Packaging"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Floating Stamp / Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-xl border border-gold/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#14301c] uppercase tracking-wider">Shivpuri, Araria (854311)</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-gold-light block text-[10px] uppercase tracking-widest font-medium">Ready to Cook</span>
                    <strong className="text-white text-sm font-brand text-base sm:text-lg">100% Peeled Garlic</strong>
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

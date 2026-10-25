"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Realistic photograph-based peeled garlic cloves with dynamic floating animations
const PHOTO_CLOVES = [
  { id: 1, src: "/clove-1.png", width: 95, height: 58, left: "7%", top: "16%", duration: 8.5, delay: 0, rotate: 12 },
  { id: 2, src: "/clove-2.png", width: 85, height: 68, left: "86%", top: "14%", duration: 10, delay: 1.5, rotate: -22 },
  { id: 3, src: "/clove-4.png", width: 110, height: 72, left: "76%", top: "66%", duration: 9.5, delay: 0.8, rotate: 28 },
  { id: 4, src: "/clove-3.png", width: 88, height: 68, left: "11%", top: "70%", duration: 8, delay: 2.2, rotate: -15 },
  { id: 5, src: "/clove-6.png", width: 75, height: 75, left: "48%", top: "8%", duration: 11, delay: 3, rotate: 35 },
  { id: 6, src: "/clove-5.png", width: 70, height: 75, left: "28%", top: "82%", duration: 9, delay: 1, rotate: -30 },
  { id: 7, src: "/clove-7.png", width: 78, height: 72, left: "90%", top: "48%", duration: 11.5, delay: 2.5, rotate: 18 },
  { id: 8, src: "/clove-2.png", width: 68, height: 54, left: "4%", top: "44%", duration: 10.5, delay: 3.5, rotate: -10 },
];

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
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
      {/* Luxury Golden Radial Atmospheric Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 45%, #C9A227 0%, transparent 55%), radial-gradient(circle at 75% 40%, #F5E6B2 0%, transparent 50%), radial-gradient(circle at 50% 90%, #ECC452 0%, transparent 60%)",
        }}
      />

      {/* Floating REALISTIC Peeled Garlic Cloves Layer */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none z-0">
        {PHOTO_CLOVES.map((clove) => (
          <div
            key={clove.id}
            className="absolute transition-transform duration-300"
            style={{
              left: clove.left,
              top: clove.top,
              animation: `floatSmooth ${clove.duration}s ease-in-out ${clove.delay}s infinite`,
            }}
          >
            <div
              style={{
                transform: `rotate(${clove.rotate}deg)`,
                filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.5)) drop-shadow(0 2px 6px rgba(201,162,39,0.25))",
              }}
              className="hover:scale-110 transition-transform duration-300"
            >
              <Image
                src={clove.src}
                alt="Realistic Peeled Garlic Clove"
                width={clove.width}
                height={clove.height}
                className="select-none pointer-events-none object-contain"
                priority
              />
            </div>
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

          {/* Right Column: Premium Hero Mockup with Real Falling Cloves Composition */}
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

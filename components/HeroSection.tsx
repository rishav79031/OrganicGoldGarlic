"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Subtle floating cloves for aesthetic depth
const CLOVES = [
  { id: 1, size: 55, left: "8%", top: "20%", duration: 9, rotate: 15 },
  { id: 2, size: 40, left: "86%", top: "18%", duration: 11, rotate: -20 },
  { id: 3, size: 65, left: "78%", top: "70%", duration: 10, rotate: 28 },
  { id: 4, size: 45, left: "12%", top: "75%", duration: 8.5, rotate: -12 },
  { id: 5, size: 35, left: "52%", top: "10%", duration: 12, rotate: 35 },
  { id: 6, size: 50, left: "25%", top: "85%", duration: 9.5, rotate: -30 },
];

function MinimalGarlicClove({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, filter: "drop-shadow(0px 6px 14px rgba(0,0,0,0.2))" }}
    >
      <defs>
        <radialGradient id="cloveShine" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF6D8" />
          <stop offset="90%" stopColor="#ECC452" />
          <stop offset="100%" stopColor="#C9A227" />
        </radialGradient>
      </defs>
      <path
        d="M 50 14 C 70 36, 85 68, 78 102 C 70 124, 38 128, 26 112 C 12 96, 17 64, 35 36 C 42 24, 46 18, 50 14 Z"
        fill="url(#cloveShine)"
      />
      <path
        d="M 44 28 C 56 46, 65 72, 60 98 C 58 106, 50 112, 40 110 C 35 98, 33 68, 38 42 Z"
        fill="white"
        fillOpacity="0.4"
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
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-16 bg-[#0a180e]"
    >
      {/* Refined golden radial aura */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, #C9A227 0%, transparent 50%), radial-gradient(circle at 75% 60%, #F5E6B2 0%, transparent 50%)",
        }}
      />

      {/* Floating Garlic Particles */}
      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none z-0">
        {CLOVES.map((clove) => (
          <div
            key={clove.id}
            className="absolute"
            style={{
              left: clove.left,
              top: clove.top,
              transform: `rotate(${clove.rotate}deg)`,
              animation: `float ${clove.duration}s ease-in-out infinite`,
            }}
          >
            <MinimalGarlicClove size={clove.size} opacity={0.35} />
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            
            {/* Top Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-gold/30 text-gold-light text-xs font-medium mb-6 tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Araria, Bihar &bull; 100% Organically Farmed</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.15] tracking-tight mb-5"
            >
              Nature&apos;s Goodness, <br />
              <span className="font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-100 to-gold">
                Purely Peeled.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/70 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light mb-8"
            >
              Hand-harvested garlic from the fertile soil of Araria, peeled and vacuum sealed with zero chemicals. Delivering fresh, aromatic cloves ready for culinary perfection.
            </motion.p>

            {/* Minimal Price Cards Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md mx-auto lg:mx-0 mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">250g Pack</span>
                <strong className="text-white text-base sm:text-lg font-serif">₹100</strong>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-gold/30">
                <span className="text-[10px] uppercase tracking-wider text-gold-light block">1 kg Pack</span>
                <strong className="text-white text-base sm:text-lg font-serif">₹200</strong>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Bulk Supply</span>
                <strong className="text-gold text-xs sm:text-sm font-semibold block mt-1">Undisclosed*</strong>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a
                href="#enquiry"
                className="px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-gold hover:bg-gold-light text-[#0a180e] transition-all duration-200 text-center shadow-lg"
              >
                Bulk Order Enquiry
              </a>

              <a
                href="https://wa.me/917488503664?text=Hello%20Organic%20Gold%20Garlic,%20I%20want%20to%20know%20more."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/20 hover:border-gold text-white transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                <span>WhatsApp Helpline</span>
              </a>
            </motion.div>
          </div>

          {/* Right Product Pack Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-xs sm:max-w-sm"
            >
              <div className="relative rounded-3xl overflow-hidden border border-gold/40 shadow-2xl bg-black/40">
                <div className="relative w-full h-[360px] sm:h-[420px]">
                  <Image
                    src="/product-pack.jpg"
                    alt="Organic Gold Garlic Packaging"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                {/* Minimal Label Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white/60 block text-[10px] uppercase tracking-wider">Shivpuri, Araria (854311)</span>
                    <strong className="text-white text-xs font-serif">100% Natural Peeled Garlic</strong>
                  </div>
                  <Link
                    href="#products"
                    className="px-3 py-1 rounded-full bg-gold/90 hover:bg-gold text-black font-semibold text-[11px] transition-colors"
                  >
                    Details
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

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ALL_PRODUCTS = [
  { id: "250g", name: "250g Pack", price: "₹100", desc: "Fresh peeled garlic", href: "/#products" },
  { id: "1kg", name: "1 kg Pack", price: "₹200", desc: "Chef & family pack", href: "/#products" },
  { id: "bulk", name: "Bulk Commercial Order", price: "Contact for Price", desc: "Wholesale & restaurants", href: "/#products" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = ALL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleNav(href: string) {
    setMobileOpen(false);
    if (href.startsWith("#") || href.startsWith("/#")) {
      const targetId = href.replace("/", "");
      const el = document.querySelector(targetId);
      if (el) {
        const top = (el as HTMLElement).offsetTop - 80;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Sleek Minimal Top Announcement Bar */}
      <div className="bg-[#0f1f14] text-white/90 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-gold/15 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span className="font-light tracking-wider text-gold-light/90">
              Direct from Araria, Bihar &bull; Pin 854311
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:7488503664"
              className="flex items-center gap-1.5 text-white/90 hover:text-gold transition-colors"
            >
              <span className="text-[10px] uppercase tracking-widest text-gold">Helpline</span>
              <strong className="font-medium">+91 74885 03664</strong>
            </a>
          </div>
        </div>
      </div>

      {/* Main Minimal Navbar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#fffdf8]/95 backdrop-blur-md shadow-sm border-b border-gold/15 py-3"
            : "bg-[#fffdf8]/90 backdrop-blur-sm border-b border-gold/10 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-gold/40 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Organic Fresh Gold Garlic"
                fill
                sizes="44px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-500 block leading-tight font-light">
                Organic Fresh
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-primary leading-tight block">
                Gold Garlic
              </span>
            </div>
          </Link>

          {/* Minimal Product Search */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-xs">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products (250g, 1kg, bulk)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/70 hover:bg-white focus:bg-white border border-gray-200 focus:border-gold rounded-full transition-all duration-200 placeholder:text-gray-400 focus:outline-none"
              />
              <svg
                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Dropdown */}
            {showSearchResults && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {filtered.length > 0 ? (
                  filtered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        handleNav(p.href);
                        setShowSearchResults(false);
                      }}
                      className="w-full text-left p-3 hover:bg-amber-50/50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{p.name}</p>
                        <p className="text-[11px] text-gray-500">{p.desc}</p>
                      </div>
                      <span className="text-xs font-bold text-gold-dark">{p.price}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links - Minimal Aesthetic */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              href="/"
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-gold transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-gold transition-colors"
            >
              About
            </Link>
            <button
              onClick={() => handleNav("/#products")}
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-gold transition-colors"
            >
              Products
            </button>
            <Link
              href="/contact"
              className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-gold transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNav("/#enquiry")}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold/60 text-gold-dark hover:bg-gold hover:text-white transition-all duration-200"
            >
              Bulk Enquiry
            </button>

            <a
              href="https://wa.me/917488503664?text=Hi%20Organic%20Gold%20Garlic,%20I%20am%20interested%20in%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#1a5c2a] hover:bg-[#13421e] text-white shadow-sm transition-all duration-200 flex items-center gap-1.5"
            >
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-800 hover:text-gold transition-colors"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden px-6 pt-4 pb-6 bg-[#fffdf8] border-t border-gold/15 mt-3 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
              />
              <svg
                className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {searchQuery && (
              <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-sm">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleNav(p.href)}
                    className="w-full text-left p-2 text-xs flex justify-between"
                  >
                    <span>{p.name}</span>
                    <strong className="text-gold-dark">{p.price}</strong>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col space-y-3 pt-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-xs uppercase tracking-widest font-medium text-gray-800"
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-xs uppercase tracking-widest font-medium text-gray-800"
              >
                About
              </Link>
              <button
                onClick={() => handleNav("/#products")}
                className="text-left text-xs uppercase tracking-widest font-medium text-gray-800"
              >
                Products
              </button>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="text-xs uppercase tracking-widest font-medium text-gray-800"
              >
                Contact
              </Link>
              <button
                onClick={() => handleNav("/#enquiry")}
                className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold text-white"
              >
                Bulk Enquiry
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

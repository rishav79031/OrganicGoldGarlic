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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [searchModalOpen]);

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = ALL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleNav(href: string) {
    setMobileOpen(false);
    setSearchModalOpen(false);
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
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Sleek Top Bar with 'Contact' */}
        <div className="bg-[#0b150e] text-white/90 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-gold/15 tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span className="font-light tracking-wider text-gold-light/90">
                Araria, Bihar &bull; Pin 854311
              </span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:7488503664"
                className="flex items-center gap-1.5 text-white/90 hover:text-gold transition-colors"
              >
                <span className="text-[10px] uppercase tracking-widest text-gold font-medium">Contact:</span>
                <strong className="font-medium">+91 74885 03664</strong>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-[#fbfaf5]/95 backdrop-blur-md shadow-sm border-b border-gold/15 py-3"
              : "bg-[#fbfaf5]/90 backdrop-blur-sm border-b border-gold/10 py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            {/* Logo with Cormorant Garamond luxury typography */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-gold/50 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Organic Fresh Gold Garlic"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-brand text-xs sm:text-sm tracking-[0.25em] text-[#93782b] uppercase font-semibold leading-none mb-0.5">
                  Organic Fresh
                </span>
                <span className="font-brand text-2xl sm:text-[26px] font-bold text-[#14301c] tracking-normal leading-tight group-hover:text-gold-dark transition-colors">
                  Gold Garlic
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
              >
                About
              </Link>
              <button
                onClick={() => handleNav("/#products")}
                className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
              >
                Products
              </button>
              <Link
                href="/contact"
                className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Right CTAs + Full Search Trigger Icon */}
            <div className="flex items-center gap-3">
              
              {/* Search Icon Button that opens full search overlay */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-full border border-gray-200 hover:border-gold text-gray-700 hover:text-gold transition-all duration-200 flex items-center gap-2 bg-white/60 hover:bg-white"
                aria-label="Open Search"
                title="Search products"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline text-xs font-medium text-gray-500">Search</span>
              </button>

              <button
                onClick={() => handleNav("/#enquiry")}
                className="hidden sm:inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold/60 text-gold-dark hover:bg-gold hover:text-white transition-all duration-200"
              >
                Bulk Enquiry
              </button>

              <a
                href="https://wa.me/917488503664?text=Hi%20Organic%20Gold%20Garlic,%20I%20am%20interested%20in%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#1a5c2a] hover:bg-[#13421e] text-white shadow-sm transition-all duration-200 items-center gap-1.5"
              >
                <span>WhatsApp</span>
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-800 hover:text-gold transition-colors"
                aria-label="Toggle Navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {mobileOpen && (
            <div className="lg:hidden px-6 pt-4 pb-6 bg-[#fbfaf5] border-t border-gold/15 mt-3 space-y-4">
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

      {/* FULL-SCREEN SEARCH OVERLAY / MODAL */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gold/30 p-6 sm:p-8 overflow-hidden">
            
            {/* Header / Close */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="font-brand text-xl font-bold text-[#14301c]">
                Search Organic Gold Garlic
              </span>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Input */}
            <div className="relative my-6">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search (e.g., 250g, 1kg, bulk order, Bihar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base sm:text-lg bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
              />
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gold-dark pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Results */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-1">
                Products & Packs
              </div>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleNav(p.href)}
                    className="w-full text-left p-3.5 rounded-2xl hover:bg-amber-50/80 transition-colors flex items-center justify-between border border-transparent hover:border-gold/20 group"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm sm:text-base">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gold-dark bg-gold/15 px-3 py-1 rounded-full whitespace-nowrap">
                      {p.price}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-gray-500">
                  No matching packs. Need custom wholesale peeled garlic?{" "}
                  <button
                    onClick={() => handleNav("/#enquiry")}
                    className="text-primary font-bold underline"
                  >
                    Submit Bulk Enquiry
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Esc</kbd> to exit</span>
              <a href="tel:7488503664" className="hover:text-gold text-gray-500 font-medium">
                Helpline: +91 74885 03664
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

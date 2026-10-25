"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ALL_PRODUCTS = [
  { id: "250g", name: "250g Pack", price: "₹100", desc: "Buy fresh peeled garlic for kitchen & cooking", href: "/#products" },
  { id: "1kg", name: "1 kg Pack", price: "₹200", desc: "Buy organic peeled garlic - Chef & family size", href: "/#products" },
  { id: "bulk", name: "Bulk Peeled Garlic Supply", price: "Enquire for Rate", desc: "Buy bulk peeled garlic - Pan-India restaurant delivery", href: "/#products" },
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

  const defaultWhatsAppText = encodeURIComponent(
    "Hello Organic Gold Garlic, I would like to enquire about buying peeled garlic (Pan-India delivery / wholesale rates)."
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        {/* Top Announcement Strip */}
        <div className="bg-[#0b150e] text-white/90 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-gold/15 tracking-wide">
          <div className="w-full max-w-[96%] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-gold-light/90">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                <span>Pan-India Delivery</span>
              </span>
              <span className="text-white/30 hidden sm:inline">&bull;</span>
              <span className="text-white/70 hidden sm:inline">Competitive Wholesale Rates</span>
              <span className="text-white/30 hidden md:inline">&bull;</span>
              <span className="text-white/70 hidden md:inline">Daily Restaurant Delivery</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
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

        {/* Main Single-Row Navbar: Logo pinned Left, Menus + Search + CTA seamlessly in one horizontal row */}
        <nav
          className={`transition-all duration-300 ${
            scrolled
              ? "bg-[#fbfaf5]/95 backdrop-blur-md shadow-sm border-b border-gold/15 py-3"
              : "bg-[#fbfaf5]/90 backdrop-blur-sm border-b border-gold/10 py-3.5"
          }`}
        >
          <div className="w-full max-w-[96%] mx-auto px-2 sm:px-4 flex items-center justify-between gap-4">
            
            {/* Logo on the Far Left with Margin */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group ml-0.5 sm:ml-2">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-gold/60 shadow-sm transition-transform duration-300 group-hover:scale-105 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Organic Gold Garlic - Buy Peeled Garlic"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-logo text-xs sm:text-sm lg:text-base font-bold tracking-[0.12em] text-[#14301c] uppercase leading-none group-hover:text-gold-dark transition-colors whitespace-nowrap">
                  Organic Gold Garlic
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#93782b] font-medium leading-tight mt-0.5 whitespace-nowrap">
                  Pure &bull; Fresh &bull; Healthy
                </span>
              </div>
            </Link>

            {/* Right Side Controls in a SINGLE ROW: Nav Links + Search + Bulk Enquiry + WhatsApp */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 mr-1 sm:mr-2">
              
              {/* Inline Navigation Links */}
              <div className="flex items-center gap-6 xl:gap-7 whitespace-nowrap">
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
                  About Us
                </Link>
                <button
                  onClick={() => handleNav("/#products")}
                  className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
                >
                  Peeled Garlic Packs
                </button>
                <Link
                  href="/contact"
                  className="text-xs uppercase tracking-[0.18em] font-medium text-gray-700 hover:text-gold transition-colors"
                >
                  Contact
                </Link>
              </div>

              {/* Search Icon Trigger */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 px-3 rounded-full border border-gray-200 hover:border-gold text-gray-700 hover:text-gold transition-all duration-200 flex items-center gap-1.5 bg-white/70 hover:bg-white shrink-0"
                aria-label="Search Peeled Garlic"
                title="Search packs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-xs font-medium text-gray-600">Search</span>
              </button>

              {/* Bulk Enquiry in the Same Single Row */}
              <button
                onClick={() => handleNav("/#enquiry")}
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold/70 text-gold-dark hover:bg-gold hover:text-white transition-all duration-200 shrink-0 whitespace-nowrap"
              >
                Bulk Enquiry
              </button>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/917488503664?text=${defaultWhatsAppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#1a5c2a] hover:bg-[#13421e] text-white shadow-sm transition-all duration-200 flex items-center gap-1.5 shrink-0 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile / Tablet Controls */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 rounded-full border border-gray-200 text-gray-700 hover:text-gold"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-xl border border-gray-200 bg-white/80 text-gray-800 hover:text-gold hover:border-gold transition-all"
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

          {/* Mobile Dropdown Panel */}
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
                  About Us
                </Link>
                <button
                  onClick={() => handleNav("/#products")}
                  className="text-left text-xs uppercase tracking-widest font-medium text-gray-800"
                >
                  Peeled Garlic Packs
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

      {/* FULL-SCREEN SEARCH OVERLAY */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gold/30 p-6 sm:p-8 overflow-hidden">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="font-logo text-base sm:text-lg font-bold tracking-wider text-[#14301c] uppercase">
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

            <div className="relative my-6">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search peeled garlic (250g, 1kg, bulk peeled garlic, wholesale)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-gray-400"
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
                  Looking to buy bulk peeled garlic for restaurants?{" "}
                  <button
                    onClick={() => handleNav("/#enquiry")}
                    className="text-primary font-bold underline"
                  >
                    Enquire for Commercial Rates
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Esc</kbd> to close</span>
              <a
                href={`https://wa.me/917488503664?text=${encodeURIComponent("Hi Organic Gold Garlic, I want to buy peeled garlic.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold text-primary font-medium"
              >
                Chat on WhatsApp &rarr;
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

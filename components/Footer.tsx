import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#08130b] text-white/70 border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/5">
          
          {/* Brand - ONLY Organic Gold Garlic in Classy Cinzel */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/50 shrink-0">
              <Image
                src="/logo.png"
                alt="Organic Gold Garlic"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-logo text-white text-base sm:text-lg font-bold tracking-[0.14em] uppercase">
                Organic Gold Garlic
              </p>
              <p className="text-[10px] text-gold-light/70 tracking-[0.25em] uppercase">
                Pure &bull; Fresh &bull; Healthy
              </p>
            </div>
          </div>

          {/* Minimal Links */}
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs tracking-[0.15em] uppercase font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              About Us
            </Link>
            <Link href="/#products" className="hover:text-gold transition-colors">
              Buy Peeled Garlic
            </Link>
            <Link href="/#enquiry" className="hover:text-gold transition-colors">
              Bulk Supply
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
            <a
              href={`https://wa.me/917488503664?text=${encodeURIComponent("Hi Organic Gold Garlic, I would like to enquire about buying peeled garlic.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              WhatsApp
            </a>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-white/40">
          <p>
            &copy; {year} Organic Gold Garlic. Shivpuri Ward No. 09, Araria, Bihar – 854311.
          </p>
          <div className="flex items-center gap-6">
            <span>Call: +91 74885 03664</span>
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0b170e] text-white/70 border-t border-gold/15">
      {/* Main Minimal Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/5">
          
          {/* Brand Info with PNG logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold/40 shrink-0">
              <Image
                src="/logo.png"
                alt="Organic Fresh Gold Garlic"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-serif text-white text-base font-bold tracking-tight">
                Organic Fresh Gold Garlic
              </p>
              <p className="text-[11px] text-gold-light/70 tracking-widest uppercase">
                Pure &bull; Fresh &bull; Healthy
              </p>
            </div>
          </div>

          {/* Minimal Inline Links */}
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs tracking-wider uppercase font-medium">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              About
            </Link>
            <Link href="/#products" className="hover:text-gold transition-colors">
              Products
            </Link>
            <Link href="/#enquiry" className="hover:text-gold transition-colors">
              Bulk Order
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
            <a
              href="https://wa.me/917488503664"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline"
            >
              WhatsApp
            </a>
          </nav>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-white/40">
          <p>
            &copy; {year} Organic Fresh Gold Garlic. Shivpuri Ward No. 09, Araria, Bihar – 854311.
          </p>
          <div className="flex items-center gap-6">
            <span>Direct Call: +91 74885 03664</span>
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

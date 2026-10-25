"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const products = [
  {
    id: "250g",
    name: "250g Household Pack",
    price: "₹100",
    originalPrice: "₹130",
    weight: "250 Grams",
    badge: "Popular Pack",
    badgeColor: "bg-gold text-white",
    image: "/product-pack-studio.webp",
    description: "Freshly peeled, vacuum sealed cloves for home cooking and daily curries.",
    features: [
      "100% natural peeled garlic",
      "No chemicals or bleaching",
      "Ready to cook straight from pouch",
      "Airtight hygienic vacuum seal"
    ],
    border: "border-gold/30 hover:border-gold",
    glow: "shadow-gold/10",
    orderMessage: "Hi, I want to order 250g pack of Organic Gold Garlic",
  },
  {
    id: "1kg",
    name: "1 kg Family & Chef Pack",
    price: "₹200",
    originalPrice: "₹260",
    weight: "1 Kilogram (1000g)",
    badge: "Best Value",
    badgeColor: "bg-primary text-white",
    image: "/product-pack-kitchen.webp",
    description: "Our most economical pack for large families, chefs, caterers, and foodies.",
    features: [
      "High yield jumbo garlic cloves",
      "Freshly peeled and packed daily",
      "Direct farm harvest from Bihar",
      "Retains crisp aroma and punch"
    ],
    border: "border-primary/40 hover:border-primary",
    glow: "shadow-primary/10",
    orderMessage: "Hi, I want to order 1kg pack of Organic Gold Garlic",
  },
  {
    id: "bulk",
    name: "Commercial & Bulk Orders",
    price: "Custom Quote",
    priceSub: "Competitive Wholesale Rate",
    originalPrice: null,
    weight: "10 kg / 50 kg / 100+ kg",
    badge: "Pan-India Restaurant Supply",
    badgeColor: "bg-gradient-to-r from-amber-600 to-yellow-600 text-white",
    image: "/peeled-garlic-bowl.webp",
    description: "Volume supply for cloud kitchens, restaurants, food manufacturers & retail chains.",
    features: [
      "Tiered discount pricing on bulk",
      "Scheduled continuous weekly supply",
      "Competitive wholesale rates",
      "Pan-India doorstep refrigerated logistics"
    ],
    border: "border-gold hover:border-gold-dark ring-2 ring-gold/20",
    glow: "shadow-gold/25",
    orderMessage: "Hi, I want to know wholesale prices for Bulk Peeled Garlic order",
    isBulk: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsSection() {
  return (
    <section
      id="products"
      className="scroll-mt-24 sm:scroll-mt-28 pt-12 sm:pt-24 pb-2 sm:pb-24 bg-gradient-to-b from-[#fbfaf5] via-amber-50/20 to-[#fbfaf5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Visible immediately without delayed scroll triggers */}
        <div className="text-center mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold-dark text-[11px] font-bold tracking-[0.2em] uppercase mb-2 sm:mb-3 border border-gold/30">
            <span>✨ Farm-Fresh Peeled Garlic</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-5xl font-bold text-primary mb-3">
            Buy Premium Peeled Garlic
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-xs sm:text-base font-light leading-relaxed">
            Hygienically sorted and air-peeled. Order individual family packs or commercial wholesale supply.
          </p>
        </div>

        {/* Product Cards: Horizontal Swipe Carousel on Mobile, 3-Col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <div
              key={product.id}
              className={`min-w-[85vw] sm:min-w-0 snap-center flex flex-col rounded-3xl bg-white border-2 ${product.border} p-4 sm:p-5 shadow-lg ${product.glow} transition-all duration-300`}
            >
              {/* Badge Row */}
              <div className="flex justify-between items-center mb-2.5">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider ${product.badgeColor}`}>
                  {product.badge}
                </span>
                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {product.weight}
                </span>
              </div>

              {/* Product Photo: Full Visibility with object-contain */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-3 bg-gradient-to-b from-amber-50/60 to-white border border-gold/15 flex items-center justify-center p-2">
                <Image
                  src={product.image}
                  alt={`${product.name} - Buy Peeled Garlic`}
                  fill
                  sizes="(max-width: 768px) 85vw, 33vw"
                  className="object-contain p-1.5"
                  priority
                />
              </div>

              {/* Info */}
              <h3 className="font-brand text-lg sm:text-xl font-bold text-primary mb-1">
                {product.name}
              </h3>

              {/* Price */}
              <div className="my-1.5 py-1.5 border-y border-gold/15 flex items-baseline gap-2">
                <span className={`font-brand font-bold ${product.isBulk ? "text-base text-gold-dark" : "text-2xl text-primary"}`}>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.originalPrice}
                  </span>
                )}
                {product.priceSub && (
                  <span className="text-[11px] font-semibold text-gold-dark block">
                    {product.priceSub}
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-xs leading-relaxed mb-3">
                {product.description}
              </p>

              {/* Features */}
              <ul className="space-y-1 mb-3.5 flex-1">
                {product.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-gold-dark font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button: Compact without dead space */}
              <div className="pt-2 border-t border-gray-100 mt-auto">
                <a
                  href={`https://wa.me/917488503664?text=${encodeURIComponent(product.orderMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md uppercase tracking-wider ${
                    product.isBulk
                      ? "bg-gradient-to-r from-gold-dark to-amber-600 hover:from-amber-600 hover:to-gold-dark"
                      : "bg-primary hover:bg-primary-dark"
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>{product.isBulk ? "Enquire for Rate" : "Order on WhatsApp"}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center mt-2 mb-0 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <span>&larr; Swipe packs to explore &rarr;</span>
        </div>

      </div>
    </section>
  );
}

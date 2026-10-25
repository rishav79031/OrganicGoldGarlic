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
    description:
      "Carefully sorted, freshly peeled garlic cloves. Vacuum sealed for daily culinary use in home kitchens and small cafes.",
    features: [
      "100% natural peeled garlic",
      "No chemicals or bleaching",
      "Ready to cook right from packet",
      "Airtight hygienic vacuum pouch"
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
    description:
      "Our most recommended pack for large households, restaurants, caterers, and daily cooking lovers. Maximum freshness with bulk savings.",
    features: [
      "High yield jumbo garlic cloves",
      "Freshly peeled and packed same day",
      "Direct farm sourced from Araria",
      "Keeps crisp and aromatic"
    ],
    border: "border-primary/40 hover:border-primary",
    glow: "shadow-primary/10",
    orderMessage: "Hi, I want to order 1kg pack of Organic Gold Garlic",
  },
  {
    id: "bulk",
    name: "Commercial & Bulk Orders",
    price: "Custom Quote",
    priceSub: "Competitive Rate • Enquire for Price",
    originalPrice: null,
    weight: "10 kg / 50 kg / 100+ kg",
    badge: "Pan-India Restaurant Supply",
    badgeColor: "bg-gradient-to-r from-amber-600 to-yellow-600 text-white",
    image: "/peeled-garlic-bowl.webp",
    description:
      "Exclusive volume rates for cloud kitchens, hotels, food processors, retail chains & supermarkets. Custom pouching & bulk crates available with Pan-India delivery.",
    features: [
      "Tiered discount pricing on high volume",
      "Continuous daily or weekly supply",
      "Competitive wholesale institutional rates",
      "Pan-India doorstep delivery to your kitchen"
    ],
    border: "border-gold hover:border-gold-dark ring-2 ring-gold/20",
    glow: "shadow-gold/25",
    orderMessage: "Hi, I want to know wholesale prices for Bulk Peeled Garlic order",
    isBulk: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ProductsSection() {
  return (
    <section
      id="products"
      className="py-24 bg-gradient-to-b from-[#fbfaf5] via-amber-50/20 to-[#fbfaf5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/15 text-gold-dark text-xs font-bold tracking-[0.2em] uppercase mb-3 border border-gold/30">
            <span>✨ Farm-Fresh Peeled Garlic</span>
          </div>
          <h2 className="font-brand text-3xl sm:text-5xl font-bold text-primary mb-4">
            Buy Premium Peeled Garlic Packs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Choose from kitchen convenience sizes to wholesale restaurant supply. Handpicked, hygienic, and ready to cook.
          </p>
        </motion.div>

        {/* Triple Banner Showcase */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 rounded-3xl overflow-hidden border border-gold/30 shadow-xl relative h-48 sm:h-64 lg:h-80"
        >
          <Image
            src="/product-banner-triple.webp"
            alt="Buy Peeled Garlic Packs - Organic Gold Garlic"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 flex items-center justify-between px-6 sm:px-12 text-white">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-gold-light font-medium block mb-1">
                Wholesale & Retail
              </span>
              <h3 className="font-brand text-2xl sm:text-4xl font-bold">
                Fresh & Clean Peeled Garlic
              </h3>
            </div>
            <a
              href="#enquiry"
              className="hidden sm:inline-block px-6 py-2.5 rounded-full bg-gold hover:bg-gold-light text-[#08130b] text-xs uppercase tracking-widest font-bold shadow-lg transition-colors"
            >
              Order Now &rarr;
            </a>
          </div>
        </motion.div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`relative flex flex-col justify-between rounded-3xl bg-white border-2 ${product.border} p-6 sm:p-7 shadow-xl ${product.glow} transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider ${product.badgeColor}`}>
                  {product.badge}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  {product.weight}
                </span>
              </div>

              {/* Product Pack Photo in WebP */}
              <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-amber-50 to-emerald-50 border border-gold/15 group">
                <Image
                  src={product.image}
                  alt={`${product.name} - Buy Peeled Garlic`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-gold/30">
                  <span className="text-xs font-bold text-primary">100% Pure 🧄</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-brand text-2xl font-bold text-primary mb-1">
                  {product.name}
                </h3>

                {/* Price Display */}
                <div className="my-3 py-2 border-y border-gold/15 flex items-baseline gap-2">
                  <span className={`font-brand font-bold ${product.isBulk ? "text-xl text-gold-dark" : "text-3xl text-primary"}`}>
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.priceSub && (
                    <span className="text-xs font-semibold text-gold-dark block mt-0.5">
                      {product.priceSub}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Bullet Features */}
                <ul className="space-y-2 mb-6">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                      <span className="text-gold-dark font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <a
                  href={`https://wa.me/917488503664?text=${encodeURIComponent(product.orderMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md hover:shadow-lg uppercase tracking-wider ${
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
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 bg-gradient-to-r from-[#08130b] via-primary-dark to-[#08130b] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-gold/40 shadow-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🏆</span>
              <h3 className="font-brand text-xl sm:text-2xl font-bold text-gold-light">
                Restaurant, Hotel or Cloud Kitchen?
              </h3>
            </div>
            <p className="text-white/80 text-xs sm:text-sm max-w-2xl leading-relaxed font-light">
              We offer competitive wholesale rates, scheduled weekly deliveries, and Pan-India distribution directly from our peeling unit.
            </p>
          </div>
          <a
            href="tel:7488503664"
            className="shrink-0 px-6 py-3 bg-gold hover:bg-gold-light text-[#08130b] font-bold rounded-full shadow-lg transition-all text-xs uppercase tracking-widest"
          >
            Call: +91 74885 03664
          </a>
        </motion.div>
      </div>
    </section>
  );
}

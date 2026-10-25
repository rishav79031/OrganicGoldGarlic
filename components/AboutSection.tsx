"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const STORY_STEPS = [
  {
    step: "01",
    tag: "The Harvest",
    title: "Direct from Regional Bihar Farms",
    desc: "Whole, organically nurtured garlic bulbs are hand-harvested at peak pungency from local farms in Araria and Seemanchal, ensuring rich allicin and natural aroma.",
    image: "/story-1-farm-harvest.webp",
  },
  {
    step: "02",
    tag: "Grading & Touchless Peeling",
    title: "Hygienically Sorted & Air-Peeled",
    desc: "Each bulb is split and gently peeled using sanitary, high-velocity air vortex technology. No chemical soaking, no bleaching — retaining full natural nutrition.",
    image: "/story-2-sorting-peeling.webp",
  },
  {
    step: "03",
    tag: "Quality Inspection",
    title: "Plump, Blemish-Free Cloves",
    desc: "Every batch undergoes rigorous quality checks. Only clean, firm, golden-white cloves make the cut for kitchens and restaurants.",
    image: "/story-3-pure-cloves.webp",
  },
  {
    step: "04",
    tag: "Sealed & Dispatched",
    title: "Vacuum-Packed & Pan-India Delivery",
    desc: "Sealed in food-grade, airtight barrier pouches that preserve 100% farm freshness. Ready to cook right into your gravies, marinades, and dishes.",
    image: "/story-4-packed-ready.webp",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#fbfaf5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block text-[#93782b] font-bold text-xs uppercase tracking-[0.25em] px-3.5 py-1 bg-gold/15 rounded-full border border-gold/30 mb-3">
            Our Journey &bull; Farm to Kitchen
          </span>
          <h2 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-normal text-[#14301c] leading-tight mb-4">
            How Organic Gold Garlic <br className="hidden sm:inline" />
            <span className="italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-dark via-amber-600 to-gold-dark">
              Reaches Your Table
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            From the fertile soil of Bihar to your culinary creations — follow the 4-step story of uncompromised purity, hygienic peeling, and freshness.
          </p>
        </motion.div>

        {/* 4-Step Visual Story Cards: Horizontal Swipe Carousel on Mobile, 4-Col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 items-stretch overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {STORY_STEPS.map((item, idx) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              className="min-w-[82vw] sm:min-w-0 snap-center group bg-white rounded-3xl p-5 border border-gold/20 hover:border-gold/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo in WebP */}
                <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-5 bg-amber-50/50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#08130b]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gold/30">
                    <span className="text-gold font-brand text-xs font-bold tracking-widest">{item.step}</span>
                  </div>
                </div>

                {/* Tag & Title */}
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#93782b] block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-brand text-xl font-bold text-[#14301c] leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Micro Line */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Phase {item.step}</span>
                <span className="text-gold-dark font-bold">100% Natural</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center mt-3 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <span>&larr; Swipe to explore our journey &rarr;</span>
        </div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Hygienic Cleanliness",
    description:
      "Sorted and air-peeled in sanitary chambers. Zero skin residue, pure spotless cloves.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    emoji: "✨",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Chemical-Free Purity",
    description:
      "No chlorine, no bleaching agents, and no preservatives. Unadulterated pungent garlic flavor.",
    color: "text-primary",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
    emoji: "🌿",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Kitchen Prep",
    description:
      "Pre-peeled whole cloves ready to drop in your pan. Save up to 40% prep time daily.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    emoji: "⚡",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Direct Farm Harvest",
    description:
      "Ethically sourced from fertile Bihar soil, packed with authentic pungency and allicin.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100",
    emoji: "🌱",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block text-gold font-semibold text-xs tracking-widest uppercase mb-2">
            Why Us
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
            Why Choose Gold Garlic?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            We deliver uncompromising hygiene, freshness, and reliable supply straight from our peeling facility.
          </p>
        </motion.div>

        {/* Feature tiles: First 3 on smaller screens, 4 on desktop */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className={`group ${feature.bgColor} border ${feature.borderColor} rounded-2xl sm:rounded-3xl p-4 sm:p-5 card-hover relative overflow-hidden flex flex-col justify-between ${
                index >= 3 ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Big emoji background */}
              <div className="absolute -bottom-4 -right-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                {feature.emoji}
              </div>

              <div>
                {/* Icon in same row as Heading */}
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className={`${feature.color} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-gray-800 leading-tight">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover bar */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${feature.bgColor
                  .replace("bg-", "bg-")
                  .replace("-50", "-400")} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-3xl`}
              />
            </motion.div>
          ))}
        </div>

        {/* Trust badges - Hidden on mobile to save vertical space, single row on larger screens */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="hidden sm:flex flex-wrap justify-center gap-4 lg:gap-6 mt-16"
        >
          {[
            { icon: "🏆", label: "Premium Quality" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "💬", label: "WhatsApp Support" },
            { icon: "♻️", label: "Eco Packaging" },
            { icon: "🔬", label: "Hygiene Tested" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm"
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

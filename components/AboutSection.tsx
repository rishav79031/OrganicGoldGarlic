"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square max-w-md mx-auto">
              <Image
                src="/product.jpg"
                alt="Fresh premium garlic from Bihar"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🧄</span>
                    </div>
                    <div>
                      <p className="font-serif font-bold text-primary text-sm">
                        Organic Fresh Gold Garlic
                      </p>
                      <p className="text-gray-500 text-xs">
                        Araria, Bihar, India
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 bg-gold/20 rounded-full"
              style={{ animation: "float 7s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full"
              style={{ animation: "float 9s ease-in-out 2s infinite" }}
            />
          </motion.div>

          {/* Text side */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-gold font-semibold text-sm tracking-widest uppercase mb-3">
                Our Story
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-6 leading-tight">
                From Bihar&apos;s Heart to Your Kitchen
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-4 text-gray-600 text-base leading-relaxed mb-8"
            >
              <p>
                Nestled in the fertile plains of Araria, Bihar, Organic Fresh
                Gold Garlic was born from a simple passion — delivering the
                purest, freshest peeled garlic directly to your doorstep, without
                compromise.
              </p>
              <p>
                Our garlic is cultivated using traditional, chemical-free farming
                methods passed down through generations. Every clove is hand-picked
                at peak ripeness, carefully peeled, and hygienically packed to
                preserve its natural aroma, flavor, and nutritional benefits.
              </p>
              <p>
                We believe you deserve garlic that is truly natural — no
                preservatives, no chemicals, no shortcuts. Just pure, golden
                goodness from the earth.
              </p>
            </motion.div>

            {/* Key points */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: "🌱", title: "Chemical Free", desc: "Zero pesticides or additives" },
                { icon: "🤲", title: "Hand-Picked", desc: "Selected at peak quality" },
                { icon: "📦", title: "Hygienic Packing", desc: "Food-safe sealed packaging" },
                { icon: "🏡", title: "Farm Direct", desc: "Straight from Bihar farms" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gold/10 hover:border-gold/30 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-primary text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

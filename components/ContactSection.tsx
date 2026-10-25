"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-gold/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold font-semibold text-sm tracking-widest uppercase mb-3">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            We&apos;re always happy to help. Reach us through WhatsApp or visit us
            in Araria, Bihar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Address */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gold/10 hover:border-gold/30 transition-colors card-hover text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-3">Our Location</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Araria Shivpuri<br />
              Ward No. 09<br />
              Araria, Bihar<br />
              PIN – 854311
            </p>
            <a
              href="https://maps.google.com/?q=Araria+Bihar+854311"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold mt-4 hover:text-gold transition-colors"
            >
              View on Map
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="bg-white rounded-3xl p-8 shadow-lg border border-gold/10 hover:border-green-300 transition-colors card-hover text-center"
          >
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-3">WhatsApp Us</h3>
            <p className="text-gray-500 text-sm mb-3">
              Chat with us directly for orders, pricing, and enquiries.
            </p>
            <p className="text-xl font-bold text-gray-800 mb-4">+91 7488503664</p>
            <a
              href="https://wa.me/917488503664"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb854] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp
            </a>
          </motion.div>

          {/* Email - Hidden on Mobile */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="hidden md:block bg-white rounded-3xl p-8 shadow-lg border border-gold/10 hover:border-gold/30 transition-colors card-hover text-center"
          >
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-primary mb-3">Email Us</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Send us your bulk order requirements and we&apos;ll send a detailed
              price quote.
            </p>
            <p className="text-gray-700 font-semibold text-sm">
              info@organicgoldgarlic.in
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Response within 24 hours
            </p>
          </motion.div>
        </div>

        {/* Business hours - Time on different row on mobile */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center max-w-2xl mx-auto"
        >
          <p className="text-primary font-semibold mb-1">Business Hours</p>
          <div className="text-gray-600 text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2">
            <span>Monday – Saturday</span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="font-medium text-gray-800">9:00 AM – 7:00 PM IST</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            WhatsApp available 24/7 for order queries
          </p>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  city: z.string().optional(),
  product: z.enum(["250g", "1kg", "Bulk", "Custom"], {
    required_error: "Please select pack or order type",
  }),
  quantity: z.string().min(1, "Please enter quantity (e.g. 5 packs or 50 kg)"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm";

const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function EnquirySection() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      product: "Bulk"
    }
  });

  const selectedProduct = watch("product");

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as { message?: string; error?: string };

      if (res.ok) {
        toast.success(
          json.message ?? "Enquiry received! Our team will contact you promptly."
        );
        reset();
      } else {
        toast.error(json.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again or message directly on WhatsApp.");
    }
  }

  return (
    <section
      id="enquiry"
      className="py-24 bg-gradient-to-br from-gold/10 via-cream to-primary/10 relative overflow-hidden"
    >
      {/* Decorative gold glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-gold-dark font-bold text-xs tracking-widest uppercase mb-3 px-3 py-1 bg-gold/15 rounded-full border border-gold/30">
            Direct Farm Enquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-primary mb-4">
            Bulk Orders & Order Enquiry
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
            Looking for wholesale supply, bulk commercial quotes (undisclosed special rates), or tracking an order? Fill in your details below.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-2xl border-2 border-gold/30 p-7 sm:p-12 relative"
        >
          {/* Subtle top banner inside card */}
          <div className="mb-8 p-4 rounded-2xl bg-amber-50/70 border border-gold/30 flex items-start sm:items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="text-xs sm:text-sm text-gray-700">
              <strong className="text-primary font-bold">Wholesale & Bulk Buyers:</strong> For orders above 10 kg, our pricing is customized & confidential. Submit your requirement for a direct callback!
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  {...register("name")}
                  className={cn(inputClass, errors.name && "border-red-300 focus:border-red-400 focus:ring-red-100")}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className={labelClass}>
                  Phone / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  {...register("phone")}
                  className={cn(inputClass, errors.phone && "border-red-300 focus:border-red-400 focus:ring-red-100")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={cn(inputClass, errors.email && "border-red-300 focus:border-red-400 focus:ring-red-100")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* City & State */}
              <div>
                <label htmlFor="city" className={labelClass}>
                  City / State / Pincode
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Araria / Patna / 854311"
                  {...register("city")}
                  className={inputClass}
                />
              </div>

              {/* Product Type */}
              <div>
                <label htmlFor="product" className={labelClass}>
                  Order / Pack Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="product"
                  {...register("product")}
                  className={cn(inputClass, "cursor-pointer font-medium", errors.product && "border-red-300 focus:border-red-400 focus:ring-red-100")}
                >
                  <option value="Bulk">Bulk Commercial Order (Undisclosed Price / Custom Quote)</option>
                  <option value="250g">250g Pack – ₹100</option>
                  <option value="1kg">1 kg Pack – ₹200</option>
                  <option value="Custom">Order Status Check / Existing Order Query</option>
                </select>
                {errors.product && (
                  <p className="text-red-500 text-xs mt-1">{errors.product.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className={labelClass}>
                  Required Quantity / Details <span className="text-red-500">*</span>
                </label>
                <input
                  id="quantity"
                  type="text"
                  placeholder={
                    selectedProduct === "Bulk"
                      ? "e.g. 25 kg, 50 kg, 200 kg monthly"
                      : "e.g. 2 packets, 5 kg"
                  }
                  {...register("quantity")}
                  className={cn(inputClass, errors.quantity && "border-red-300 focus:border-red-400 focus:ring-red-100")}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            {/* Additional Message */}
            <div className="mt-6">
              <label htmlFor="message" className={labelClass}>
                Requirement Details or Delivery Address
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Mention if you are a restaurant, caterer, reseller, or any specific packaging needs..."
                {...register("message")}
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-gray-100 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-3 text-base disabled:opacity-60 disabled:cursor-not-allowed min-w-[220px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gold-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                <span>Prefer instant chat?</span>
                <a
                  href="https://wa.me/917488503664?text=Hi%20Organic%20Gold%20Garlic,%20I%20have%20an%20enquiry%20regarding%20bulk%20orders."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#128C7E] font-bold hover:bg-[#25D366]/20 transition-colors"
                >
                  <span>WhatsApp: 7488503664</span>
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

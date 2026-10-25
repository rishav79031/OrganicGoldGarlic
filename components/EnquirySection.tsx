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
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block text-gold-dark font-bold text-xs tracking-widest uppercase mb-2 px-3 py-1 bg-gold/15 rounded-full border border-gold/30">
            Direct Farm Enquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-primary">
            Bulk Orders & Order Enquiry
          </h2>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-2xl border-2 border-gold/30 p-6 sm:p-12 relative"
        >

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
                  <option value="Bulk">Bulk Order</option>
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

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-500">
                <span>Prefer instant chat?</span>
                <a
                  href="https://wa.me/917488503664?text=Hi%20Organic%20Gold%20Garlic,%20I%20have%20an%20enquiry%20regarding%20bulk%20orders."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat directly on WhatsApp"
                  title="WhatsApp Enquiry"
                  className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md hover:bg-[#20ba59] hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

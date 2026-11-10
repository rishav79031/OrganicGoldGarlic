"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const MACHINERY_DETAILS = [
  {
    step: "01",
    name: "Industrial Garlic Bulb Breaker & Clove Separator",
    capacity: "300 – 600 kg/hour",
    power: "1.5 kW / 220V/380V",
    desc: "Gently splits whole garlic heads into undamaged individual cloves without crushing the natural flesh. Adjustable roller clearance accommodates various garlic clove sizes from Indian varieties.",
  },
  {
    step: "02",
    name: "High-Efficiency Pneumatic Dry Garlic Peeler",
    capacity: "150 – 350 kg/hour",
    power: "0.75 kW (Air blast driven)",
    desc: "Uses concentrated compressed air blast to peel garlic skins completely without water. Delivers 98%+ peeling efficiency while keeping cloves fresh, dry, unblemished, and export-ready.",
  },
  {
    step: "03",
    name: "Industrial Screw Air Compressor & Buffer Vessel",
    capacity: "15 – 25 HP / 8–10 Bar",
    power: "High-durability continuous motor",
    desc: "Supplies oil-free dry compressed air required for the continuous pneumatic peeling cycle. Engineered for 10–12 hour non-stop daily plant production runs with low acoustic noise.",
  },
  {
    step: "04",
    name: "Food-Grade SS304 Sorting & Grading Table",
    capacity: "Continuous Conveyor / Manual Batch",
    power: "Food-grade Stainless Steel",
    desc: "High-finish stainless steel inspection surface for final manual QA, sorting out undersized cloves, and ensuring zero skin residue enters the final vacuum packing line.",
  },
  {
    step: "05",
    name: "Nitrogen Flush & Commercial Vacuum Packaging Unit",
    capacity: "400 – 800 pouches/hour",
    power: "Heavy-Duty Dual Chamber",
    desc: "Removes oxygen and injects food-grade nitrogen to preserve the crisp aroma and golden hue of peeled cloves for 30–45 days chilled shelf life without chemical preservatives.",
  },
  {
    step: "06",
    name: "Direct Mandi Raw Garlic Sourcing Tie-Up",
    capacity: "Weekly Farm Logistics",
    power: "Pan-India Sourcing Network",
    desc: "Direct farm-gate supply chain from high-potency garlic belts in Bihar, MP, and Rajasthan at baseline wholesale mandi rates so your manufacturing plant never faces raw material shortages.",
  },
];

const FAQS = [
  {
    q: "How much space and power is required for the full machine setup?",
    a: "A clean, well-ventilated space of 400 to 800 sq.ft is ideal for the machine line, sorting area, and cold storage rack. Standard commercial 3-phase power (or single-phase 10-15 kW load depending on capacity selection) is recommended.",
  },
  {
    q: "Who provides the raw garlic for daily peeling?",
    a: "Organic Gold Garlic connects you directly with our established mandi and farmer networks across Bihar, Madhya Pradesh, and Rajasthan. You get access to wholesale mandi prices with reliable weekly logistics support.",
  },
  {
    q: "Can I sell the packed garlic under the Organic Gold Garlic brand?",
    a: "Yes! As an authorized franchise partner, you receive licensing rights to use the Organic Gold Garlic brand name, trademark, pre-printed food-grade vacuum pouches, and barcode assets.",
  },
  {
    q: "Who are the target customers for peeled garlic in my city?",
    a: "Commercial demand is massive: local hotels, fine-dining restaurants, cloud kitchens, wedding caterers, canteens, vegetable vendors, and retail supermarkets. Chefs prefer ready-to-use peeled garlic to eliminate heavy kitchen labor costs.",
  },
  {
    q: "What is the expected net profit margin and payback period?",
    a: "Depending on market wholesale vs peeled retail spreads, net operating margins typically range between 25% and 40%. Most operational units achieve full capital recovery within 3 to 6 months of steady commercial supply.",
  },
  {
    q: "Do you provide on-site machine installation and staff training?",
    a: "Yes. Our engineering team assists with machine layout, pneumatic connection guidance, trial run calibrations, and comprehensive operator training on hygiene, peeling optimization, and packaging SOPs.",
  },
];

export default function FranchisePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    phone: string;
    city: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "Bihar",
    spaceAvailable: "500 sq.ft",
    investmentBudget: "₹5 Lakhs - ₹10 Lakhs",
    timeline: "Immediate (Within 30 Days)",
    message: "",
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://organicgoldgarlic.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Franchise Setup",
            item: "https://organicgoldgarlic.com/franchise",
          },
        ],
      },
      {
        "@type": "Service",
        name: "Organic Gold Garlic Franchise with Full Machine Setup",
        serviceType: "Peeled Garlic Processing Plant Franchise & Machinery Setup",
        description:
          "Complete turnkey franchise package for setting up an industrial peeled garlic processing unit with pneumatic air peeling machines, sorting conveyors, vacuum sealing, and raw garlic supply tie-ups.",
        provider: {
          "@type": "Organization",
          name: "Organic Gold Garlic",
          url: "https://organicgoldgarlic.com",
          logo: "https://organicgoldgarlic.com/logo.png",
          telephone: "+91-7488503664",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Shivpuri Ward No. 09",
            addressLocality: "Araria",
            addressRegion: "Bihar",
            postalCode: "854311",
            addressCountry: "IN",
          },
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Peeled Garlic Plant Setup Options",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Turnkey Industrial Garlic Peeling Machine Setup",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Direct Mandi Raw Garlic Procurement Supply Chain",
              },
            },
          ],
        },
      },
    ],
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city) {
      toast.error("Please provide your Name, Phone Number, and City.");
      return;
    }

    setLoading(true);
    try {
      const fullMessage = `Franchise Application Details:\n- State: ${formData.state}\n- Space Available: ${formData.spaceAvailable}\n- Investment Budget: ${formData.investmentBudget}\n- Planned Timeline: ${formData.timeline}\n- Additional Note: ${formData.message || "N/A"}`;

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: `${formData.city}, ${formData.state}`,
          product: "Franchise - Full Machine Setup",
          quantity: formData.investmentBudget,
          message: fullMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Franchise application registered successfully!");
        setSuccess(true);
        setSubmittedData({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
        });
      } else {
        toast.error(data.error || "Failed to submit. Please contact us on WhatsApp.");
      }
    } catch {
      toast.error("Network error. Please chat directly with us on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  const directWhatsAppUrl = `https://wa.me/917488503664?text=${encodeURIComponent(
    `Hi Organic Gold Garlic, I am interested in taking a Franchise of Organic Gold Garlic with Full Machine Setup in ${
      formData.city || "my city"
    }. Please share the machinery catalog and investment details.`
  )}`;

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-gray-800">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Top Floating Mini Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gold/20 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/60">
              <Image src="/logo.png" alt="Organic Gold Garlic" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-logo text-xs sm:text-sm font-bold text-primary tracking-widest uppercase">
                Organic Gold Garlic
              </span>
              <span className="text-[9px] text-gold-dark uppercase tracking-wider font-semibold">
                Franchise & Machinery
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/order"
              className="hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-800 border border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              Order Peeled Garlic
            </Link>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp Details</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 bg-gradient-to-b from-[#14301c] via-[#0e2414] to-[#08130b] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 text-gold-light text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-gold/40">
            <span>✨ Turnkey Food Processing Plant Setup</span>
          </div>

          <h1 className="font-brand text-3xl sm:text-6xl font-bold max-w-4xl mx-auto mb-6 leading-tight">
            Take Franchise of Organic Gold Garlic with <span className="text-gold">Full Machine Setup</span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Own a profitable industrial peeled garlic plant in your territory.
            We supply high-efficiency pneumatic peeling machinery, raw garlic sourcing, branding pouches, and buyer network support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#apply"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold hover:bg-gold-light text-[#08130b] font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl transition-all"
            >
              Apply for Franchise Now ↓
            </a>
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-gold/40 text-white font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Key Numbers Ribbon */}
      <section className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-4xl font-brand font-bold text-primary block">98%+</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Peeling Efficiency</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-brand font-bold text-gold-dark block">25% – 40%</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Operating Profit Margin</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-brand font-bold text-primary block">30–45 Days</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Vacuum Chilled Shelf Life</span>
            </div>
            <div>
              <span className="text-2xl sm:text-4xl font-brand font-bold text-gold-dark block">3 – 6 Mo</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Capital Payback Period</span>
            </div>
          </div>
        </div>
      </section>

      {/* Machinery Line Breakdown */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block mb-2">
            Turnkey Industrial Engineering
          </span>
          <h2 className="font-brand text-3xl sm:text-4xl font-bold text-primary mb-3">
            What is Included in the Full Machine Setup?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light">
            We deliver and calibrate a complete end-to-end processing and packaging assembly line.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MACHINERY_DETAILS.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border border-gray-200/80 hover:border-gold/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-brand text-2xl font-bold text-gold-dark">
                    {item.step}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {item.capacity}
                  </span>
                </div>
                <h3 className="font-brand text-lg font-bold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Power / Spec:</span>
                <span className="font-medium text-gray-700">{item.power}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Plant & Raw Garlic Sourcing Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold-dark font-bold block">
                Solving the Hardest Problem
              </span>
              <h2 className="font-brand text-3xl sm:text-4xl font-bold text-primary leading-tight">
                Continuous Raw Garlic Supply at Wholesale Farm-Gate Rates
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
                Most new food processing units struggle because raw material prices fluctuate and mandi middlemen charge heavy commissions.
              </p>
              <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
                As an Organic Gold Garlic franchise partner, you get direct sourcing contracts from garlic farms in Bihar, Neemuch/Mandsaur (MP), and Kota (Rajasthan). We stabilize your input costs so your manufacturing plant operates with healthy margins year-round.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-base font-bold text-primary block mb-1">🏢 HoReCa Demand</span>
                  <p className="text-xs text-gray-500">Hotels, restaurants & cloud kitchens consume 20kg to 200kg peeled garlic weekly.</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-base font-bold text-primary block mb-1">🏷️ Branded Pouches</span>
                  <p className="text-xs text-gray-500">Food-grade pre-printed 250g, 1kg & bulk vacuum pouches provided with barcodes.</p>
                </div>
                <div className="sm:col-span-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="relative w-16 h-9 bg-white shrink-0 flex items-center justify-center p-0.5 border border-gray-200 rounded-lg">
                    <Image
                      src="/fssai-logo.png"
                      alt="FSSAI Certified Unit"
                      width={64}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary block">FSSAI Certified Plant Standard</span>
                    <p className="text-[11px] text-gray-500">Full licensing assistance, hygiene SOPs, and compliance guidelines provided for your unit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-gold/30 shadow-2xl">
              <Image
                src="/story-4-packed-ready.webp"
                alt="Finished Peeled Garlic Ready for Dispatch"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Finished Product</span>
                <p className="font-brand text-xl font-bold mt-1">
                  Export-Quality Vacuum Packed Peeled Garlic
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Fresh, crisp, uncrushed cloves ready for kitchen dispatch.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Franchise Application Form Section */}
      <section id="apply" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border-2 border-gold/30">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block mb-2">
              Apply for Territory Rights
            </span>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-primary mb-2">
              Franchise & Machine Setup Enquiry
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto">
              Fill out the details below. Our technical founders will contact you within 24 hours with machine line specifications and financial blueprints.
            </p>
          </div>

          {success && submittedData ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-300 text-center animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-brand text-2xl font-bold text-emerald-900 mb-2">
                Application Received, {submittedData.name}!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 mb-6 max-w-md mx-auto">
                Thank you for your interest in setting up an Organic Gold Garlic plant in <strong>{submittedData.city}</strong>.
                Our team is reviewing your territory and will contact you directly on <strong>{submittedData.phone}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/917488503664?text=${encodeURIComponent(
                    `Hi Organic Gold Garlic, I just submitted the franchise application for ${submittedData.city}. My name is ${submittedData.name} (${submittedData.phone}). Please share the machine setup quotation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                >
                  Confirm on WhatsApp Now →
                </a>
                <Link
                  href="/"
                  className="px-6 py-3.5 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:border-gold transition-colors"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="For technical brochure & quotation PDF"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target City / District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patna, Purnea, Ranchi, Lucknow"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Space Available for Plant
                  </label>
                  <select
                    value={formData.spaceAvailable}
                    onChange={(e) => setFormData({ ...formData, spaceAvailable: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="300 - 500 sq.ft">300 – 500 sq.ft (Standard Unit)</option>
                    <option value="500 - 1000 sq.ft">500 – 1000 sq.ft (Commercial Plant)</option>
                    <option value="1000+ sq.ft">1000+ sq.ft (Export / Bulk Warehouse)</option>
                    <option value="Looking to Rent">Looking to Rent Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Investment Capacity
                  </label>
                  <select
                    value={formData.investmentBudget}
                    onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="₹5 Lakhs - ₹8 Lakhs">₹5 Lakhs – ₹8 Lakhs (Compact Line)</option>
                    <option value="₹8 Lakhs - ₹15 Lakhs">₹8 Lakhs – ₹15 Lakhs (Semi-Automatic Complete)</option>
                    <option value="₹15 Lakhs+">₹15 Lakhs+ (Fully Automatic High-Capacity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Planned Startup Timeline
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold bg-white"
                  >
                    <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                    <option value="1 to 3 Months">1 to 3 Months</option>
                    <option value="Exploratory / Planning Stage">Exploratory / Planning Stage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Questions or Special Requirements (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your background or any specific queries about machine capacity, power setup, or local market..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1.5 order-2 sm:order-1"
                >
                  <span>Or ask questions directly on WhatsApp →</span>
                </a>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 order-1 sm:order-2"
                >
                  {loading ? "Submitting Application..." : "Submit Franchise Application →"}
                </button>
              </div>

            </form>
          )}

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block mb-2">
              Common Queries
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-bold text-primary">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#fbfaf5] border border-gray-200/80">
                <h3 className="font-brand text-base font-bold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#08130b] text-white/70 py-12 border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          <p className="mb-2">
            &copy; {new Date().getFullYear()} Organic Gold Garlic. Franchise & Industrial Plant Division.
          </p>
          <p className="text-gray-400">
            Shivpuri Ward No. 09, Araria, Bihar – 854311 &bull; Direct Founder WhatsApp: +91 74885 03664
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-[11px] uppercase tracking-wider text-gold-light">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/order" className="hover:text-white">Order Peeled Garlic</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

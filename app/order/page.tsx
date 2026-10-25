"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const PACK_OPTIONS = [
  { id: "250g", name: "250g Fresh Peeled Pack", price: 100, priceDisplay: "₹100", sub: "Kitchen Pack" },
  { id: "1kg", name: "1 kg Value Pack", price: 200, priceDisplay: "₹200", sub: "Chef & Family Pack", popular: true },
  { id: "Bulk", name: "Bulk Commercial Pack", price: 180, priceDisplay: "₹180 / kg", sub: "Restaurants & Catering (10kg+)" },
];

export default function OrderPage() {
  const [selectedPack, setSelectedPack] = useState("1kg");
  const [quantity, setQuantity] = useState(2);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
    customerName: string;
    product: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "Araria",
    state: "Bihar",
    pincode: "854311",
    notes: "",
  });

  const currentPack = PACK_OPTIONS.find((p) => p.id === selectedPack) ?? PACK_OPTIONS[1];
  const totalAmount = currentPack.price * quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
      toast.error("Please fill in your name, phone, and complete delivery address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          product: currentPack.name,
          quantity,
          totalAmount,
          paymentStatus: "COD",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setOrderSuccess({
          orderNumber: data.order.orderNumber,
          totalAmount: data.order.totalAmount,
          customerName: data.order.customerName,
          product: data.order.product,
        });
      } else {
        toast.error(data.error || "Could not place order. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again or order on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-gray-800 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/60 shadow">
              <Image src="/logo.png" alt="Organic Gold Garlic" fill className="object-contain" />
            </div>
            <span className="font-logo text-base sm:text-lg font-bold text-primary tracking-widest uppercase">
              Organic Gold Garlic
            </span>
          </Link>
          <h1 className="font-brand text-3xl sm:text-5xl font-bold text-primary mb-2">
            Direct Farm Order
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto font-light">
            Fast dispatch directly from our peeling unit in Araria, Bihar. 100% natural, hygienic peeled garlic.
          </p>
        </div>

        {orderSuccess ? (
          /* Order Confirmation Screen */
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-emerald-500/30 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <span className="text-xs uppercase tracking-widest text-emerald-700 font-bold block mb-1">
              Order Confirmed & Logged
            </span>
            <h2 className="font-brand text-2xl sm:text-4xl font-bold text-primary mb-2">
              Order #{orderSuccess.orderNumber}
            </h2>
            <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
              Thank you, <strong className="text-gray-800">{orderSuccess.customerName}</strong>! Your order for{" "}
              <strong>{orderSuccess.product}</strong> (₹{orderSuccess.totalAmount}) is registered in our dispatch system.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a
                href={`https://wa.me/917488503664?text=${encodeURIComponent(
                  `Hi Organic Gold Garlic, I just placed Order #${orderSuccess.orderNumber} for ${orderSuccess.product} (Total: ₹${orderSuccess.totalAmount}). Please confirm dispatch details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                Track on WhatsApp &rarr;
              </a>
              <Link
                href="/"
                className="px-6 py-3.5 rounded-full border border-gray-300 hover:border-gold text-gray-700 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Order Placement Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gold/25">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Pack Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-dark mb-3">
                  Step 1 &bull; Choose Peeled Garlic Pack
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACK_OPTIONS.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => setSelectedPack(pack.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                        selectedPack === pack.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-200 hover:border-gold/50 bg-gray-50/50"
                      }`}
                    >
                      {pack.popular && (
                        <span className="absolute top-2.5 right-2.5 text-[9px] uppercase tracking-wider bg-gold text-[#08130b] font-bold px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                      <p className="font-brand font-bold text-base text-gray-900">{pack.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{pack.sub}</p>
                      <p className="text-lg font-bold text-primary">{pack.priceDisplay}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Quantity Selection */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50/60 border border-gold/20">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Step 2 &bull; Quantity
                  </label>
                  <span className="text-xs text-gray-500">Number of packs or kg required</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-lg hover:border-gold shadow-sm"
                  >
                    -
                  </button>
                  <span className="font-brand text-xl font-bold w-12 text-center text-primary">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-lg hover:border-gold shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Step 3: Customer Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gold-dark mb-4">
                  Step 3 &bull; Delivery & Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="For invoice & delivery updates"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Complete Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat / Street / Landmark..."
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">City / Town</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Summary & Submit */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">Estimated Total</span>
                  <div className="flex items-baseline gap-2">
                    <strong className="text-3xl font-brand font-bold text-primary">₹{totalAmount}</strong>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Pay on Delivery (Cash / UPI)
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? "Confirming Order..." : "Place Order Now &rarr;"}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

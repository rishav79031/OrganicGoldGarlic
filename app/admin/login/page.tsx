"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("rishav79031@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        toast.success("Welcome back to Organic Gold Garlic Admin!");
        router.push("/admin");
        router.refresh();
      } else {
        const data = (await res.json()) as { error?: string };
        toast.error(data.error ?? "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08130b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Golden Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #C9A227 0%, transparent 60%)",
        }}
      />

      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md relative z-10 border border-gold/30">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold shadow-lg mb-3">
              <Image
                src="/logo.png"
                alt="Organic Gold Garlic"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-xl font-brand font-bold text-[#14301c] uppercase tracking-wider">
            Portal Sign In
          </h1>
          <p className="text-xs text-[#93782b] font-medium tracking-widest uppercase mt-0.5">
            Organic Gold Garlic
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label
              htmlFor="email"
              className="block font-semibold text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rishav79031@gmail.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel &rarr;"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <Link href="/" className="hover:text-gold transition-colors">
            &larr; Back to Live Website
          </Link>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

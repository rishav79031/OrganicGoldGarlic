"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("rishav79031@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
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
        const msg = data.error ?? "Invalid credentials. Please check your password.";
        setErrorMessage(msg);
        toast.error(msg, {
          icon: "⚠️",
          style: {
            background: "#450a0a",
            color: "#fecaca",
            border: "1px solid #ef4444",
          },
        });
      }
    } catch {
      const msg = "Something went wrong. Please check your network and try again.";
      setErrorMessage(msg);
      toast.error(msg);
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your password"
                required
                className={`w-full px-4 py-3 pr-11 border rounded-xl text-gray-800 text-sm focus:outline-none transition-colors ${
                  errorMessage
                    ? "border-red-400 focus:border-red-500 bg-red-50/20"
                    : "border-gray-200 focus:border-gold"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye Slash (Hide) */
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  /* Eye (Show) */
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel →"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <Link href="/" className="hover:text-gold transition-colors">
            ← Back to Live Website
          </Link>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}
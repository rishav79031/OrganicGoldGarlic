"use client";

import { useEffect } from "react";

export default function InvoicePrintActions({ autoPrint }: { autoPrint?: boolean }) {
  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#043327] text-white text-xs font-bold uppercase tracking-wider shadow flex items-center gap-1.5 transition-all"
    >
      <span>🖨️</span> Print / Save PDF
    </button>
  );
}

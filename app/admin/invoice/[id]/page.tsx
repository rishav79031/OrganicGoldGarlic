import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import InvoicePrintActions from "./InvoicePrintActions";

interface InvoicePageProps {
  params: { id: string };
  searchParams?: { autoPrint?: string };
}

export default async function InvoicePage({ params, searchParams }: InvoicePageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const orderId = Number(params.id);
  if (!orderId) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order || order.isDeleted) {
    notFound();
  }

  const settingsRows = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsRows.forEach((s) => {
    settings[s.key] = s.value;
  });

  const invoiceNum = order.invoiceNumber || `INV-${order.orderNumber}`;
  const invoiceDate = order.invoiceDate
    ? new Date(order.invoiceDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const totalAmount = Number(order.invoiceAmount ?? order.totalAmount ?? 0);
  const formattedAmount = totalAmount.toLocaleString("en-IN");
  const autoPrint = searchParams?.autoPrint === "1" || searchParams?.autoPrint === "true";

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-2 sm:px-4 text-gray-800 font-sans print:p-0 print:bg-white print:min-h-0">
      {/* Top Floating Control Bar - Hidden during print */}
      <div className="max-w-3xl mx-auto mb-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/80 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
        <Link
          href="/admin"
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <InvoicePrintActions autoPrint={autoPrint} />
        </div>
      </div>

      {/* Main Single Page A4 Tax Invoice Card */}
      <div
        id="official-invoice-sheet"
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200/90 p-6 sm:p-10 text-xs text-gray-800 leading-snug print:shadow-none print:border-none print:p-0 print:max-w-full print:rounded-none"
      >
        {/* Header with Legal Info & Tax Invoice Badge */}
        <div className="flex justify-between items-start pb-5 border-b-2 border-[#d4af37]">
          <div>
            <h1 className="text-xl font-extrabold text-[#064e3b] tracking-wider uppercase font-serif">
              {settings.company_legal_name || "ORGANIC GOLD GARLIC"}
            </h1>
            <p className="text-[11px] text-gray-600 mt-0.5 font-medium">
              Premium Hygienic Peeled Garlic Processing & Wholesale Supply
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Shivpuri Ward No. 09, Araria, Bihar – 854311 • Phone: +91 74885 03664
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[10px]">
              {settings.gst_number && (
                <span className="bg-gray-100 px-2 py-0.5 rounded font-bold border border-gray-200">
                  GSTIN: {settings.gst_number}
                </span>
              )}
              {settings.fssai_license && (
                <span className="bg-gray-100 px-2 py-0.5 rounded font-bold border border-gray-200">
                  FSSAI Lic: {settings.fssai_license}
                </span>
              )}
              {settings.pan_number && (
                <span className="bg-gray-100 px-2 py-0.5 rounded font-bold border border-gray-200">
                  PAN: {settings.pan_number}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block bg-[#064e3b] text-[#d4af37] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-1">
              TAX INVOICE
            </span>
            <p className="text-sm font-extrabold text-gray-900 font-mono">{invoiceNum}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Date: {invoiceDate}</p>
            <p className="text-[10px] text-gray-500">Order: #{order.orderNumber}</p>
          </div>
        </div>

        {/* Customer & Delivery Address Details */}
        <div className="grid grid-cols-2 gap-6 py-4 border-b border-gray-100 text-[11px]">
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1 text-[9px]">
              Billed To (Customer)
            </span>
            <strong className="text-gray-900 text-sm block">{order.customerName}</strong>
            <p className="text-gray-600 mt-0.5">Ph: {order.customerPhone}</p>
            {order.customerEmail && <p className="text-gray-600">{order.customerEmail}</p>}
          </div>

          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1 text-[9px]">
              Delivery Destination
            </span>
            <p className="text-gray-800">{order.deliveryAddress}</p>
            <p className="text-gray-800 font-medium">{order.city}, Bihar</p>
            {order.courierName && (
              <p className="text-indigo-700 font-medium mt-1">
                🚚 Dispatch: {order.courierName} ({order.trackingNumber || "Assigned"})
              </p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-4">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[9px] font-bold">
                <th className="pb-2">Description & Grade</th>
                <th className="pb-2 text-center">HSN</th>
                <th className="pb-2 text-center">Quantity</th>
                <th className="pb-2 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 font-medium text-gray-800">
                  <span className="font-bold text-gray-900 block">{order.product}</span>
                  <span className="text-[10px] text-gray-500">
                    100% Pure Peeled Garlic Cloves • Vacuum-Sealed • No Preservatives
                  </span>
                </td>
                <td className="py-3 text-center text-gray-500 font-mono text-[10px]">07032000</td>
                <td className="py-3 text-center font-bold text-gray-800">{order.quantity}</td>
                <td className="py-3 text-right font-bold text-gray-900">₹{formattedAmount}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td colSpan={3} className="pt-3 text-right text-gray-800 font-bold text-xs">
                  Total Invoice Value (INR):
                </td>
                <td className="pt-3 text-right text-base font-extrabold text-[#064e3b]">
                  ₹{formattedAmount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bank & Payment Settlement Details */}
        <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 mt-2 text-[10px]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[9px]">
                Bank Transfer & Settlement Details
              </span>
              <p className="text-gray-600">
                <strong>Bank:</strong> {settings.bank_name || "State Bank of India (Araria)"} •{" "}
                <strong>A/C:</strong> {settings.bank_account_no || "Registered Commercial Account"}
              </p>
              <p className="text-gray-600 mt-0.5">
                <strong>IFSC:</strong> {settings.bank_ifsc || "SBIN0001234"} •{" "}
                <strong>UPI:</strong> {settings.upi_id || "7488503664@upi"}
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-700 block mb-1 uppercase tracking-wider text-[9px]">
                Terms & Conditions
              </span>
              <p className="text-gray-500 italic leading-snug">
                {settings.invoice_terms ||
                  "Payment terms: Pay on Delivery or UPI upon dispatch. 100% natural agricultural produce."}
              </p>
            </div>
          </div>
        </div>

        {/* Signatory Footnote */}
        <div className="pt-5 mt-4 border-t border-gray-200 flex justify-between items-end text-[10px] text-gray-500">
          <div>
            <p className="font-semibold text-gray-700">Thank you for ordering with Organic Gold Garlic!</p>
            <p>Registered peeling facility in Shivpuri Ward 09, Araria, Bihar.</p>
          </div>
          <div className="text-center">
            <div className="w-36 border-b border-gray-400 mb-1"></div>
            <span className="text-[9px] uppercase tracking-wider text-gray-600 font-bold block">
              For {settings.company_legal_name || "Organic Gold Garlic"}
            </span>
            <span className="text-[8px] text-gray-400">Authorized Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
}

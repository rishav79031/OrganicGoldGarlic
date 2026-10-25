"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "Superadmin" | "Admin" | "Staff";
}

interface OrderItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  city: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  invoiceNumber?: string | null;
  invoiceAmount?: number | null;
  invoiceDate?: string | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  shippingDetails?: string | null;
  notes: string | null;
  createdAt: string;
}

interface EnquiryItem {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  product: string;
  quantity: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalEnquiries: number;
  pendingEnquiries: number;
  totalOrders: number;
  orderReceivedCount: number;
  orderAcceptedCount: number;
  invoiceGeneratedCount: number;
  paymentReceivedCount: number;
  orderProcessedCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalRevenue: number;
}

const SHOPIFY_STATUSES = [
  "Order Received",
  "Order Accepted",
  "Invoice Generated",
  "Payment Received",
  "Order Processed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "add-order" | "enquiries" | "users" | "settings">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("All");
  const router = useRouter();

  // Invoice Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderItem | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceAmount: 0,
    notes: "",
  });

  // Invoice Preview / Print Modal State
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<OrderItem | null>(null);

  // Shipping Modal State
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<OrderItem | null>(null);
  const [shippingForm, setShippingForm] = useState({
    courierName: "Delhivery Express",
    trackingNumber: "",
    shippingDetails: "Standard refrigerated / express garlic parcel dispatch.",
  });

  // Add Order Form State
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "Araria",
    product: "1 kg Value Pack",
    quantity: 1,
    totalAmount: 0,
    status: "Order Received",
    paymentStatus: "Pending",
    notes: "",
  });

  // Settings State
  const [settings, setSettings] = useState({
    forward_enquiries_email: "rishav79031@gmail.com",
    forward_orders_email: "rishav79031@gmail.com",
    notify_status_change: "true",
  });

  // OTP State for Superadmin Password Change
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Users State
  const [usersList, setUsersList] = useState<Array<{ id: number; name: string; email: string; role: string; status: string }>>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Staff" });

  useEffect(() => {
    loadDashboardData();
  }, [orderFilter]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const statsData = await statsRes.json();
      if (statsData.user) setUser(statsData.user);
      if (statsData.stats) setStats(statsData.stats);

      const ordersRes = await fetch(`/api/admin/orders?status=${encodeURIComponent(orderFilter)}`);
      const ordersData = await ordersRes.json();
      if (ordersData.orders) setOrders(ordersData.orders);

      const enquiriesRes = await fetch("/api/admin/enquiries");
      const enquiriesData = await enquiriesRes.json();
      if (enquiriesData.enquiries) setEnquiries(enquiriesData.enquiries);

      const settingsRes = await fetch("/api/admin/settings");
      const settingsData = await settingsRes.json();
      if (settingsData.settings) setSettings(settingsData.settings);

      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (usersData.users) setUsersList(usersData.users);
    } catch (e) {
      console.error(e);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out");
    router.push("/admin/login");
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    const targetOrder = orders.find((o) => o.id === orderId);

    // If changing to Invoice Generated and no invoice exists, prompt invoice modal
    if (newStatus === "Invoice Generated" && !targetOrder?.invoiceNumber) {
      openInvoiceModal(targetOrder!);
      return;
    }

    // If changing to Shipped, prompt shipping modal
    if (newStatus === "Shipped") {
      openShippingModal(targetOrder!);
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Order status updated to ${newStatus}`);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to update order status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  function openInvoiceModal(order: OrderItem) {
    setSelectedOrderForInvoice(order);
    const defaultAmount = order.invoiceAmount || order.totalAmount || (order.quantity * 200);
    setInvoiceForm({
      invoiceNumber: order.invoiceNumber || `INV-${order.orderNumber.replace("OGG-", "")}`,
      invoiceAmount: defaultAmount,
      notes: order.notes || "Official tax & mandi invoice generated.",
    });
  }

  async function handleGenerateInvoiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderForInvoice) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderForInvoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Invoice Generated",
          invoiceNumber: invoiceForm.invoiceNumber,
          invoiceAmount: Number(invoiceForm.invoiceAmount),
          notes: invoiceForm.notes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Invoice ${invoiceForm.invoiceNumber} generated & sent to customer!`);
        setSelectedOrderForInvoice(null);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to generate invoice");
      }
    } catch {
      toast.error("Failed to generate invoice");
    }
  }

  function openShippingModal(order: OrderItem) {
    setSelectedOrderForShipping(order);
    setShippingForm({
      courierName: order.courierName || "Delhivery Logistics",
      trackingNumber: order.trackingNumber || `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingDetails: order.shippingDetails || "Refrigerated hygienic packing for farm fresh delivery.",
    });
  }

  async function handleSaveShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderForShipping) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderForShipping.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Shipped",
          courierName: shippingForm.courierName,
          trackingNumber: shippingForm.trackingNumber,
          shippingDetails: shippingForm.shippingDetails,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Order marked as Shipped! Tracking emailed to customer.`);
        setSelectedOrderForShipping(null);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to save shipping details");
      }
    } catch {
      toast.error("Failed to save shipping details");
    }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setNewOrder({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          deliveryAddress: "",
          city: "Araria",
          product: "1 kg Value Pack",
          quantity: 1,
          totalAmount: 0,
          status: "Order Received",
          paymentStatus: "Pending",
          notes: "",
        });
        setActiveTab("orders");
        loadDashboardData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to create order");
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save settings");
    }
  }

  async function handleSendOtp() {
    try {
      const res = await fetch("/api/admin/otp/send", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to send OTP");
    }
  }

  async function handleVerifyOtpReset(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/otp/verify-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setOtpSent(false);
        setOtpCode("");
        setNewPassword("");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to reset password");
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setNewUser({ name: "", email: "", password: "", role: "Staff" });
        loadDashboardData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to create user");
    }
  }

  function getStatusBadgeClass(status: string) {
    switch (status) {
      case "Order Received":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "Order Accepted":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "Invoice Generated":
        return "bg-yellow-50 text-yellow-800 border-yellow-400";
      case "Payment Received":
        return "bg-teal-50 text-teal-800 border-teal-300";
      case "Order Processed":
        return "bg-purple-50 text-purple-800 border-purple-300";
      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-300";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Cancelled":
        return "bg-red-50 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row text-gray-800">
      
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-[#08130b] text-white flex flex-col justify-between p-4 sticky top-0 h-screen z-40 border-r border-gold/20`}
      >
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold shrink-0">
              <Image src="/logo.png" alt="Organic Gold Garlic" fill className="object-contain" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-logo text-xs font-bold tracking-widest text-gold uppercase truncate">
                  Organic Gold Garlic
                </h1>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase block">
                  Shopify Order System
                </span>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                activeTab === "dashboard" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">📊</span>
              {sidebarOpen && <span>Overview</span>}
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                activeTab === "orders" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">📦</span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span>Orders</span>
                  {stats && stats.totalOrders > 0 && (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {stats.totalOrders}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("add-order")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                activeTab === "add-order" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">➕</span>
              {sidebarOpen && <span>Add Order</span>}
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                activeTab === "enquiries" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">💬</span>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span>Enquiries</span>
                  {stats && stats.pendingEnquiries > 0 && (
                    <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {stats.pendingEnquiries}
                    </span>
                  )}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                activeTab === "users" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">👥</span>
              {sidebarOpen && <span>Team & Access</span>}
            </button>

            {user?.role === "Superadmin" && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium ${
                  activeTab === "settings" ? "bg-gold text-[#08130b] font-bold shadow" : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <span className="text-base">⚙️</span>
                {sidebarOpen && <span>Settings & OTP</span>}
              </button>
            )}
          </nav>
        </div>

        {/* Footer Sidebar / User Info */}
        <div className="pt-4 border-t border-white/10">
          {sidebarOpen && user && (
            <div className="mb-3 px-2">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold">{user.role}</span>
              <span className="text-[9px] text-gray-400 truncate block">{user.email}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white text-xs"
              title="Toggle sidebar"
            >
              {sidebarOpen ? "◀ Collapse" : "▶"}
            </button>

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium"
              title="Sign out"
            >
              {sidebarOpen ? "Sign Out" : "🚪"}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-primary capitalize">
              {activeTab === "dashboard" ? "Admin Overview" : activeTab.replace("-", " ")}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Organic Gold Garlic &bull; Shivpuri Ward 09, Araria, Bihar &bull; Pan-India Dispatch System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/order"
              target="_blank"
              className="px-4 py-2 rounded-full border border-gold/60 text-xs font-semibold text-gold-dark hover:bg-gold hover:text-white transition-colors"
            >
              Public Order Page ↗
            </Link>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD METRICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 mt-6">
            
            {/* Top Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Total Revenue</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-primary mt-1">₹{stats?.totalRevenue ?? 0}</p>
                <span className="text-[11px] text-emerald-600 font-medium">Invoiced & fulfilled orders</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-primary mt-1">{stats?.totalOrders ?? 0}</p>
                <span className="text-[11px] text-gray-500 font-medium">{stats?.deliveredCount ?? 0} Delivered</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Awaiting Invoice</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-amber-600 mt-1">
                  {(stats?.orderReceivedCount ?? 0) + (stats?.orderAcceptedCount ?? 0)}
                </p>
                <span className="text-[11px] text-amber-600 font-medium">Ready for invoice creation</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Direct Enquiries</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-primary mt-1">{stats?.totalEnquiries ?? 0}</p>
                <span className="text-[11px] text-red-500 font-medium">{stats?.pendingEnquiries ?? 0} Pending callbacks</span>
              </div>
            </div>

            {/* Shopify Standard Order Status Pipeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-brand text-lg font-bold text-primary">Shopify Order Lifecycle Pipeline</h3>
                <span className="text-xs text-gray-400 font-medium">7 E-Commerce Stages</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">1. Received</span>
                  <strong className="text-lg font-bold text-amber-600">{stats?.orderReceivedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-blue-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">2. Accepted</span>
                  <strong className="text-lg font-bold text-blue-600">{stats?.orderAcceptedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-yellow-300 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">3. Invoiced</span>
                  <strong className="text-lg font-bold text-yellow-700">{stats?.invoiceGeneratedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-teal-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">4. Paid</span>
                  <strong className="text-lg font-bold text-teal-600">{stats?.paymentReceivedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-purple-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">5. Processed</span>
                  <strong className="text-lg font-bold text-purple-600">{stats?.orderProcessedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-indigo-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">6. Shipped</span>
                  <strong className="text-lg font-bold text-indigo-600">{stats?.shippedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">7. Delivered</span>
                  <strong className="text-lg font-bold text-emerald-600">{stats?.deliveredCount ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand text-lg font-bold text-primary">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs text-gold-dark font-bold hover:underline">
                  Manage All Orders &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">No orders recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Invoice Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-semibold text-primary">{ord.orderNumber}</td>
                          <td className="py-3 font-medium text-gray-800">{ord.customerName} ({ord.customerPhone})</td>
                          <td className="py-3 text-gray-600">{ord.product} &times; {ord.quantity}</td>
                          <td className="py-3 font-bold text-gray-900">
                            {ord.invoiceAmount ? `₹${ord.invoiceAmount}` : <span className="text-gray-400 font-normal">Pending Invoice</span>}
                          </td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(ord.status)}`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ORDERS LIST & MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 mt-6">
            
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {["All", ...SHOPIFY_STATUSES].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-colors ${
                    orderFilter === st
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gold"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No orders matching filter.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3">Order #</th>
                        <th className="pb-3">Customer & Contact</th>
                        <th className="pb-3">Address</th>
                        <th className="pb-3">Product & Qty</th>
                        <th className="pb-3">Invoice & Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions & Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 font-bold text-primary">
                            <span>{ord.orderNumber}</span>
                            <span className="block text-[10px] text-gray-400 font-normal">
                              {new Date(ord.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3.5">
                            <strong className="text-gray-900 block">{ord.customerName}</strong>
                            <a
                              href={`https://wa.me/91${ord.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hi ${ord.customerName}, this is Organic Gold Garlic regarding your Order #${ord.orderNumber}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              💬 {ord.customerPhone}
                            </a>
                            {ord.customerEmail && (
                              <span className="text-[10px] text-gray-500 block truncate">{ord.customerEmail}</span>
                            )}
                          </td>

                          <td className="py-3.5 max-w-[160px] text-gray-500 truncate" title={ord.deliveryAddress}>
                            {ord.deliveryAddress}, {ord.city}
                          </td>

                          <td className="py-3.5 text-gray-700">
                            {ord.product} &times; <strong>{ord.quantity}</strong>
                          </td>

                          <td className="py-3.5">
                            {ord.invoiceAmount ? (
                              <div>
                                <strong className="text-gray-900 font-bold block">₹{ord.invoiceAmount}</strong>
                                <span className="text-[10px] text-gold-dark font-medium block">
                                  #{ord.invoiceNumber}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-semibold block w-fit">
                                  Price in Invoice
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              className="px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
                            >
                              {SHOPIFY_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            {ord.trackingNumber && (
                              <div className="mt-1 text-[10px] text-indigo-700 font-mono">
                                🚚 {ord.courierName}: {ord.trackingNumber}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Generate or Re-generate Invoice */}
                              <button
                                onClick={() => openInvoiceModal(ord)}
                                className="px-2.5 py-1 rounded-md bg-gold/15 hover:bg-gold/30 text-gold-dark font-bold text-[10px] uppercase tracking-wider transition-colors"
                                title="Generate or Edit Invoice"
                              >
                                {ord.invoiceNumber ? "Edit Inv" : "+ Invoice"}
                              </button>

                              {/* View / Print Invoice */}
                              {ord.invoiceNumber && (
                                <button
                                  onClick={() => setPreviewInvoiceOrder(ord)}
                                  className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-wider transition-colors"
                                  title="View and Print Invoice"
                                >
                                  📄 Print
                                </button>
                              )}

                              {/* Add / Edit Shipping Details */}
                              <button
                                onClick={() => openShippingModal(ord)}
                                className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase tracking-wider transition-colors"
                                title="Add Courier Tracking"
                              >
                                🚚 Ship
                              </button>

                              {/* WhatsApp Notify */}
                              <a
                                href={`https://wa.me/91${ord.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hi ${ord.customerName}, your Organic Gold Garlic Order #${ord.orderNumber} status is now: ${ord.status}.${
                                    ord.invoiceNumber ? ` Invoice: ${ord.invoiceNumber} (₹${ord.invoiceAmount}).` : ""
                                  }${ord.trackingNumber ? ` Dispatched via ${ord.courierName} tracking: ${ord.trackingNumber}.` : ""}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-[10px] uppercase tracking-wider"
                              >
                                💬
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ADD ORDER (OFFLINE / PHONE / FARM VISIT) */}
        {activeTab === "add-order" && (
          <div className="max-w-2xl mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="font-brand text-xl font-bold text-primary mb-2">Record Direct Order</h2>
            <p className="text-xs text-gray-500 mb-6">Manually record orders taken over telephone, WhatsApp, or farm visits.</p>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street / City / Pincode"
                  value={newOrder.deliveryAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Product Pack</label>
                  <select
                    value={newOrder.product}
                    onChange={(e) => setNewOrder({ ...newOrder, product: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  >
                    <option value="250g Fresh Peeled Pack">250g Fresh Peeled Pack</option>
                    <option value="1 kg Value Pack">1 kg Value Pack</option>
                    <option value="Bulk Commercial Pack (10kg+)">Bulk Commercial Pack (10kg+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: Number(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold font-medium"
                  >
                    {SHOPIFY_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                >
                  Save & Log Order →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <h2 className="font-brand text-lg font-bold text-primary mb-4">Website Direct Enquiries</h2>
            {enquiries.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No website enquiries received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Product / Qty</th>
                      <th className="pb-3">Message</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-gray-50/50">
                        <td className="py-3 font-bold text-gray-900">{enq.name}</td>
                        <td className="py-3">
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hi ${enq.name}, this is Organic Gold Garlic responding to your enquiry about ${enq.product}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 font-semibold hover:underline"
                          >
                            💬 {enq.phone}
                          </a>
                        </td>
                        <td className="py-3 font-medium text-gray-700">{enq.product} ({enq.quantity})</td>
                        <td className="py-3 max-w-[200px] text-gray-500 truncate" title={enq.message || ""}>
                          {enq.message || "—"}
                        </td>
                        <td className="py-3 text-gray-400 text-[11px]">{new Date(enq.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hi ${enq.name}, thank you for contacting Organic Gold Garlic. Our current wholesale rate for ${enq.product} is ready for dispatch.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-wider shadow"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: USERS & ROLES */}
        {activeTab === "users" && (
          <div className="mt-6 space-y-6">
            {/* Create User Form (Superadmin only) */}
            {user?.role === "Superadmin" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-xl">
                <h3 className="font-brand text-base font-bold text-primary mb-3">Add Team Member / Staff</h3>
                <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      >
                        <option value="Staff">Staff (View & Process Orders)</option>
                        <option value="Admin">Admin (Orders & Enquiries)</option>
                        <option value="Superadmin">Superadmin (Full Access)</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-[11px]">
                    Create User
                  </button>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-brand text-base font-bold text-primary mb-4">Registered Users</h3>
              <div className="divide-y divide-gray-100 text-xs">
                {usersList.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div>
                      <strong className="text-gray-900 block">{u.name}</strong>
                      <span className="text-gray-500">{u.email}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === "Superadmin" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"
                    }`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & EMAIL FORWARDING */}
        {activeTab === "settings" && user?.role === "Superadmin" && (
          <div className="mt-6 space-y-6 max-w-2xl">
            
            {/* Email Forwarding Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h3 className="font-brand text-lg font-bold text-primary mb-1">Email Forwarding Configuration</h3>
              <p className="text-xs text-gray-500 mb-6">
                Enquiries, new orders, invoices, and shipping tracking updates are forwarded automatically to these destinations.
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Forward Enquiries To</label>
                  <input
                    type="email"
                    required
                    value={settings.forward_enquiries_email}
                    onChange={(e) => setSettings({ ...settings, forward_enquiries_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Forward Orders To</label>
                  <input
                    type="email"
                    required
                    value={settings.forward_orders_email}
                    onChange={(e) => setSettings({ ...settings, forward_orders_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="notifyStatus"
                    checked={settings.notify_status_change === "true"}
                    onChange={(e) => setSettings({ ...settings, notify_status_change: String(e.target.checked) })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="notifyStatus" className="text-gray-700 font-medium">
                    Send automated customer email on every status change (Invoiced, Shipped, Delivered, etc.)
                  </label>
                </div>

                <div className="pt-2">
                  <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs">
                    Save Forwarding Settings
                  </button>
                </div>
              </form>
            </div>

            {/* Superadmin Password Change with Email OTP */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h3 className="font-brand text-lg font-bold text-primary mb-1">Superadmin Security & Password Reset</h3>
              <p className="text-xs text-gray-500 mb-4">
                Password changes for superadmin (<strong className="text-gray-800">rishav79031@gmail.com</strong>) require a verified 6-digit email OTP.
              </p>

              {!otpSent ? (
                <div>
                  <button
                    onClick={handleSendOtp}
                    className="px-5 py-2.5 rounded-xl border border-gold/70 text-gold-dark font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-white transition-colors"
                  >
                    Request 6-Digit Email OTP →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtpReset} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 582194"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl text-sm tracking-widest font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">New Superadmin Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs">
                      Verify & Change Password
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: GENERATE INVOICE */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gold/30 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-dark block">
                  Official Mandi Billing
                </span>
                <h3 className="font-brand text-xl font-bold text-primary">
                  Generate Invoice for #{selectedOrderForInvoice.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateInvoiceSubmit} className="mt-5 space-y-4 text-xs">
              <div className="bg-amber-50/70 p-3 rounded-xl border border-gold/20 text-gray-700">
                <p><strong>Customer:</strong> {selectedOrderForInvoice.customerName} ({selectedOrderForInvoice.customerPhone})</p>
                <p><strong>Item:</strong> {selectedOrderForInvoice.product} &times; {selectedOrderForInvoice.quantity}</p>
                <p><strong>Delivery:</strong> {selectedOrderForInvoice.deliveryAddress}, {selectedOrderForInvoice.city}</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Invoice Number *</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.invoiceNumber}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Confirmed Total Amount (₹) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={invoiceForm.invoiceAmount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceAmount: Number(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-base font-bold text-primary"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Includes wholesale garlic rates + logistics calculation.
                </span>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Invoice Terms / Notes</label>
                <textarea
                  rows={2}
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Issue Invoice & Notify Customer →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SHIPPING DETAILS & DISPATCH */}
      {selectedOrderForShipping && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-indigo-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-700 block">
                  Dispatch & Courier Logistics
                </span>
                <h3 className="font-brand text-xl font-bold text-primary">
                  Ship Order #{selectedOrderForShipping.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForShipping(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShippingSubmit} className="mt-5 space-y-4 text-xs">
              <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200 text-gray-700">
                <p><strong>Customer:</strong> {selectedOrderForShipping.customerName}</p>
                <p><strong>Destination:</strong> {selectedOrderForShipping.deliveryAddress}, {selectedOrderForShipping.city}</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Courier Partner *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhivery, DTDC, Blue Dart, Speed Post"
                  value={shippingForm.courierName}
                  onChange={(e) => setShippingForm({ ...shippingForm, courierName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tracking Number / AWB # *</label>
                <input
                  type="text"
                  required
                  placeholder="AWB123456789"
                  value={shippingForm.trackingNumber}
                  onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Shipping Details / Transit Notes</label>
                <textarea
                  rows={2}
                  value={shippingForm.shippingDetails}
                  onChange={(e) => setShippingForm({ ...shippingForm, shippingDetails: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForShipping(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow"
                >
                  Mark Shipped & Dispatch Email →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE PREVIEW / PRINT */}
      {previewInvoiceOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200 animate-fadeIn my-8">
            
            {/* Header with Print and Close */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 print:hidden">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">
                Printable Tax & Commercial Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow flex items-center gap-1.5"
                >
                  🖨️ Print Invoice
                </button>
                <button
                  onClick={() => setPreviewInvoiceOrder(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Invoice Printable Sheet */}
            <div className="pt-6">
              {/* Brand Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-gold/40">
                <div>
                  <h2 className="font-logo text-xl font-bold text-primary tracking-widest uppercase">
                    ORGANIC GOLD GARLIC
                  </h2>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    Premium Hygienic Peeled Garlic Processing & Wholesale Supply
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Shivpuri Ward No. 09, Araria, Bihar – 854311<br />
                    Phone / WhatsApp: +91 74885 03664 &bull; Email: rishav79031@gmail.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-primary text-gold text-xs font-bold px-3 py-1 rounded uppercase tracking-widest mb-2">
                    OFFICIAL INVOICE
                  </span>
                  <p className="text-sm font-bold text-gray-900 font-mono">
                    {previewInvoiceOrder.invoiceNumber || `INV-${previewInvoiceOrder.orderNumber}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(previewInvoiceOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Order Ref: #{previewInvoiceOrder.orderNumber}
                  </p>
                </div>
              </div>

              {/* Billed To / Shipped To */}
              <div className="grid grid-cols-2 gap-6 py-6 border-b border-gray-100 text-xs">
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Billed To</span>
                  <p className="font-bold text-gray-900 text-sm">{previewInvoiceOrder.customerName}</p>
                  <p className="text-gray-600">{previewInvoiceOrder.customerPhone}</p>
                  {previewInvoiceOrder.customerEmail && (
                    <p className="text-gray-600">{previewInvoiceOrder.customerEmail}</p>
                  )}
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Dispatch Destination</span>
                  <p className="text-gray-700">{previewInvoiceOrder.deliveryAddress}</p>
                  <p className="text-gray-700">{previewInvoiceOrder.city}, Bihar</p>
                  {previewInvoiceOrder.courierName && (
                    <p className="text-indigo-600 font-medium mt-1">
                      Courier: {previewInvoiceOrder.courierName} ({previewInvoiceOrder.trackingNumber})
                    </p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <div className="py-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-center">Quantity</th>
                      <th className="pb-2 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 font-medium text-gray-800">
                        {previewInvoiceOrder.product}
                        <span className="block text-[11px] text-gray-500">
                          Freshly Peeled Garlic &bull; Vacuum Packed &bull; 100% Preservative Free
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold text-gray-700">{previewInvoiceOrder.quantity}</td>
                      <td className="py-3 text-right font-bold text-gray-900">
                        ₹{previewInvoiceOrder.invoiceAmount ?? previewInvoiceOrder.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={2} className="pt-4 text-right font-bold text-sm text-gray-800">
                        Grand Total:
                      </td>
                      <td className="pt-4 text-right font-bold text-lg text-primary">
                        ₹{previewInvoiceOrder.invoiceAmount ?? previewInvoiceOrder.totalAmount}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Note */}
              <div className="pt-6 border-t border-gray-200 text-[11px] text-gray-500 flex justify-between items-end">
                <div>
                  <p className="font-semibold text-gray-700">Payment Terms: Cash on Delivery / UPI</p>
                  <p>Thank you for choosing Organic Gold Garlic, Araria.</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b border-gray-400 mb-1"></div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Authorized Signatory</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
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
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

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

  // Add Order Form State
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    city: "Araria",
    product: "1 kg Pack",
    quantity: 1,
    totalAmount: 200,
    status: "Confirmed",
    paymentStatus: "COD",
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

      const ordersRes = await fetch(`/api/admin/orders?status=${orderFilter}`);
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
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        loadDashboardData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update status");
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
          product: "1 kg Pack",
          quantity: 1,
          totalAmount: 200,
          status: "Confirmed",
          paymentStatus: "COD",
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
      toast.error("Verification failed");
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

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-gray-800 flex flex-col md:flex-row">
      
      {/* Collapsible Modern Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-[#08130b] text-white flex flex-col justify-between shrink-0 border-r border-gold/20 select-none`}
      >
        <div>
          {/* Brand & Collapse Toggle */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 overflow-hidden">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/60 shrink-0">
                <Image src="/logo.png" alt="Organic Gold Garlic" fill className="object-contain" />
              </div>
              {sidebarOpen && (
                <div className="leading-tight">
                  <span className="font-logo text-xs font-bold text-white tracking-widest uppercase block">
                    Gold Garlic
                  </span>
                  <span className="text-[9px] text-gold-light uppercase tracking-wider block">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title={sidebarOpen ? "Collapse Menu" : "Expand Menu"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
            </button>
          </div>

          {/* Current User Badge */}
          {sidebarOpen && user && (
            <div className="p-3 mx-3 my-3 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-between text-xs">
              <div className="overflow-hidden">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gold-light font-medium uppercase tracking-wider">{user.role}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === "dashboard"
                  ? "bg-gold text-[#08130b] font-bold shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === "orders"
                  ? "bg-gold text-[#08130b] font-bold shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">📦</span>
              {sidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span>Orders</span>
                  {stats?.pendingOrders ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                      {stats.pendingOrders}
                    </span>
                  ) : null}
                </div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("add-order")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === "add-order"
                  ? "bg-gold text-[#08130b] font-bold shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">➕</span>
              {sidebarOpen && <span>Add Order</span>}
            </button>

            <button
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                activeTab === "enquiries"
                  ? "bg-gold text-[#08130b] font-bold shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">✉️</span>
              {sidebarOpen && (
                <div className="flex items-center justify-between w-full">
                  <span>Enquiries</span>
                  {stats?.pendingEnquiries ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                      {stats.pendingEnquiries}
                    </span>
                  ) : null}
                </div>
              )}
            </button>

            {/* Users & Authorization (Superadmin & Admin only) */}
            {(user?.role === "Superadmin" || user?.role === "Admin") && (
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                  activeTab === "users"
                    ? "bg-gold text-[#08130b] font-bold shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">👥</span>
                {sidebarOpen && <span>Users & Roles</span>}
              </button>
            )}

            {/* Settings (Superadmin only) */}
            {user?.role === "Superadmin" && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-all ${
                  activeTab === "settings"
                    ? "bg-gold text-[#08130b] font-bold shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-base">⚙️</span>
                {sidebarOpen && <span>Settings</span>}
              </button>
            )}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>🌐</span>
            {sidebarOpen && <span>Visit Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-primary capitalize">
              {activeTab === "dashboard" ? "Admin Overview" : activeTab.replace("-", " ")}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Organic Gold Garlic &bull; Shivpuri Ward 09, Araria &bull; Pan-India Dispatch System
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
                <span className="text-[11px] text-emerald-600 font-medium">From fulfilled orders</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-primary mt-1">{stats?.totalOrders ?? 0}</p>
                <span className="text-[11px] text-gray-500 font-medium">{stats?.deliveredOrders ?? 0} Delivered</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Pending Orders</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-amber-600 mt-1">{stats?.pendingOrders ?? 0}</p>
                <span className="text-[11px] text-amber-600 font-medium">Awaiting confirmation</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Enquiries</span>
                <p className="text-2xl sm:text-3xl font-brand font-bold text-primary mt-1">{stats?.totalEnquiries ?? 0}</p>
                <span className="text-[11px] text-red-500 font-medium">{stats?.pendingEnquiries ?? 0} Pending callbacks</span>
              </div>
            </div>

            {/* Order Status Breakdown Cards */}
            <div>
              <h3 className="font-brand text-lg font-bold text-primary mb-3">Order Status Pipeline</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white p-4 rounded-xl border border-amber-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Pending</span>
                  <strong className="text-xl font-bold text-amber-600">{stats?.pendingOrders ?? 0}</strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Confirmed</span>
                  <strong className="text-xl font-bold text-blue-600">{stats?.confirmedOrders ?? 0}</strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-purple-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Processing</span>
                  <strong className="text-xl font-bold text-purple-600">{stats?.processingOrders ?? 0}</strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-indigo-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Shipped</span>
                  <strong className="text-xl font-bold text-indigo-600">{stats?.shippedOrders ?? 0}</strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Delivered</span>
                  <strong className="text-xl font-bold text-emerald-600">{stats?.deliveredOrders ?? 0}</strong>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium block">Cancelled</span>
                  <strong className="text-xl font-bold text-gray-400">{stats?.cancelledOrders ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand text-lg font-bold text-primary">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs text-gold-dark font-bold hover:underline">
                  View All Orders &rarr;
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
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3 font-semibold text-primary">{ord.orderNumber}</td>
                          <td className="py-3 font-medium text-gray-800">{ord.customerName} ({ord.customerPhone})</td>
                          <td className="py-3 text-gray-600">{ord.product} &times; {ord.quantity}</td>
                          <td className="py-3 font-bold text-gray-900">₹{ord.totalAmount}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
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
              {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
                    orderFilter === st
                      ? "bg-primary text-white"
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
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 font-bold text-primary">{ord.orderNumber}</td>
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
                          </td>
                          <td className="py-3.5 max-w-[180px] text-gray-500 truncate" title={ord.deliveryAddress}>
                            {ord.deliveryAddress}, {ord.city}
                          </td>
                          <td className="py-3.5 text-gray-700">
                            {ord.product} &times; <strong>{ord.quantity}</strong>
                          </td>
                          <td className="py-3.5 font-bold text-gray-900">₹{ord.totalAmount}</td>
                          <td className="py-3.5">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                              className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5">
                            <a
                              href={`https://wa.me/91${ord.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Hi ${ord.customerName}, your Organic Gold Garlic Order #${ord.orderNumber} status is now: ${ord.status}. Dispatch from Araria, Bihar.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-[10px] uppercase tracking-wider"
                            >
                              Notify
                            </a>
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

        {/* TAB 3: ADD ORDER (MANUAL ENTRY) */}
        {activeTab === "add-order" && (
          <div className="max-w-2xl mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h2 className="font-brand text-xl font-bold text-primary mb-2">Record Offline / Telephone Order</h2>
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
                    onChange={(e) => {
                      const p = e.target.value;
                      let rate = 200;
                      if (p.includes("250g")) rate = 100;
                      if (p.includes("Bulk")) rate = 180;
                      setNewOrder({ ...newOrder, product: p, totalAmount: rate * newOrder.quantity });
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  >
                    <option value="250g Pack">250g Pack (₹100)</option>
                    <option value="1 kg Pack">1 kg Pack (₹200)</option>
                    <option value="Bulk Supply (10kg+)">Bulk Commercial (Custom)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newOrder.quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value) || 1;
                      const unitRate = newOrder.product.includes("250g") ? 100 : newOrder.product.includes("Bulk") ? 180 : 200;
                      setNewOrder({ ...newOrder, quantity: q, totalAmount: unitRate * q });
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Total Amount (₹)</label>
                  <input
                    type="number"
                    value={newOrder.totalAmount}
                    onChange={(e) => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold font-bold text-primary"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                >
                  Save & Log Order &rarr;
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
                Enquiries, new orders, and status updates are forwarded automatically to these destinations.
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
                    Send email alert whenever order status changes (Shipped, Delivered, etc.)
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
                    Request 6-Digit Email OTP &rarr;
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
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "Superadmin" | "Admin" | "Staff";
  permissions?: string[];
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

// Shopify Lifecycle Order with "Order Processed" as the final completed state
const SHOPIFY_STATUSES = [
  "Order Received",
  "Order Accepted",
  "Invoice Generated",
  "Payment Received",
  "Shipped",
  "Delivered",
  "Order Processed",
  "Cancelled",
] as const;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "add-order" | "enquiries" | "settings">("dashboard");
  const [settingsSubTab, setSettingsSubTab] = useState<"general" | "invoice" | "team" | "security">("invoice");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState("All");
  const router = useRouter();

  // Search & Date Filter States for Orders
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");

  // Pagination State for Orders
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk Selection State for Orders
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<string>("Order Accepted");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Enquiry Filter State
  const [enquiryFilter, setEnquiryFilter] = useState<"All" | "Pending" | "Answered">("All");

  // Invoice Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<OrderItem | null>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    invoiceAmount: 0,
    notes: "",
  });

  // Invoice Preview / Print Modal State
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<OrderItem | null>(null);

  // Shipping Modal State (Clean, NO fake defaults)
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState<OrderItem | null>(null);
  const [shippingForm, setShippingForm] = useState({
    courierName: "",
    trackingNumber: "",
    shippingDetails: "",
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

  // Comprehensive Settings State (Email + Invoice GST + Bank)
  const [settings, setSettings] = useState({
    forward_enquiries_email: "rishav79031@gmail.com",
    forward_orders_email: "rishav79031@gmail.com",
    notify_status_change: "true",
    company_legal_name: "Organic Gold Garlic",
    gst_number: "",
    pan_number: "",
    fssai_license: "",
    bank_name: "",
    bank_account_no: "",
    bank_ifsc: "",
    upi_id: "7488503664@upi",
    invoice_terms: "Payment on delivery or UPI upon dispatch. 100% natural agricultural produce.",
  });

  // Guided Password Reset Flow
  const [showPasswordResetFlow, setShowPasswordResetFlow] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Users State (Clean, NO pre-filled credentials)
  const [usersList, setUsersList] = useState<Array<{ id: number; name: string; email: string; role: string; status: string; permissions?: string[] }>>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Staff",
    permissions: ["orders", "enquiries"] as string[],
  });

  const canManageSettingsAndAccess = user?.role === "Superadmin" || user?.role === "Admin";

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
      if (settingsData.settings) {
        setSettings((prev) => ({ ...prev, ...settingsData.settings }));
      }

      if (statsData.user && (statsData.user.role === "Superadmin" || statsData.user.role === "Admin")) {
        const usersRes = await fetch("/api/admin/users");
        const usersData = await usersRes.json();
        if (usersData.users) setUsersList(usersData.users);
      }
    } catch (e) {
      console.error(e);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out successfully. See you soon!", { icon: "👋" });
    router.push("/admin/login");
  }

  // Filtered Orders Calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (orderSearch) {
        const query = orderSearch.toLowerCase();
        const matchesQuery =
          ord.orderNumber.toLowerCase().includes(query) ||
          ord.customerName.toLowerCase().includes(query) ||
          ord.customerPhone.includes(query) ||
          (ord.customerEmail && ord.customerEmail.toLowerCase().includes(query)) ||
          ord.city.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      if (orderStartDate) {
        const orderDate = new Date(ord.createdAt);
        const start = new Date(orderStartDate);
        if (orderDate < start) return false;
      }

      if (orderEndDate) {
        const orderDate = new Date(ord.createdAt);
        const end = new Date(orderEndDate);
        end.setHours(23, 59, 59, 999);
        if (orderDate > end) return false;
      }

      return true;
    });
  }, [orders, orderSearch, orderStartDate, orderEndDate]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const isAllCurrentPageSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((ord) => selectedOrderIds.includes(ord.id));

  function toggleSelectAllCurrentPage() {
    if (isAllCurrentPageSelected) {
      const pageIds = paginatedOrders.map((o) => o.id);
      setSelectedOrderIds(selectedOrderIds.filter((id) => !pageIds.includes(id)));
    } else {
      const pageIds = paginatedOrders.map((o) => o.id);
      const merged = Array.from(new Set([...selectedOrderIds, ...pageIds]));
      setSelectedOrderIds(merged);
    }
  }

  function toggleSelectOrder(id: number) {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  }

  async function handleBulkStatusUpdate() {
    if (selectedOrderIds.length === 0) return;

    if (bulkTargetStatus === "Shipped") {
      toast.error("Shipping requires individual courier tracking details for each package.", { icon: "🚚" });
      return;
    }

    setBulkLoading(true);
    const toastId = toast.loading(`Updating ${selectedOrderIds.length} orders to "${bulkTargetStatus}"...`);

    try {
      await Promise.all(
        selectedOrderIds.map((id) =>
          fetch(`/api/admin/orders/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: bulkTargetStatus }),
          })
        )
      );

      toast.success(`Successfully updated ${selectedOrderIds.length} orders to "${bulkTargetStatus}"!`, {
        id: toastId,
        icon: "✅",
        duration: 4000,
      });

      setSelectedOrderIds([]);
      loadDashboardData();
    } catch {
      toast.error("Failed to update some orders in bulk.", { id: toastId });
    } finally {
      setBulkLoading(false);
    }
  }

  function handleExportCSV() {
    if (filteredOrders.length === 0) {
      toast.error("No orders available to export.");
      return;
    }

    const headers = [
      "Order Number",
      "Date",
      "Customer Name",
      "Phone",
      "Email",
      "Delivery Address",
      "City",
      "Product",
      "Quantity",
      "Invoice Amount (INR)",
      "Status",
      "Invoice Number",
      "Courier Name",
      "Tracking Number",
    ];

    const rows = filteredOrders.map((ord) => [
      `"${ord.orderNumber}"`,
      `"${new Date(ord.createdAt).toLocaleDateString()}"`,
      `"${ord.customerName.replace(/"/g, '""')}"`,
      `"${ord.customerPhone}"`,
      `"${ord.customerEmail || ""}"`,
      `"${ord.deliveryAddress.replace(/"/g, '""')}"`,
      `"${ord.city}"`,
      `"${ord.product}"`,
      ord.quantity,
      ord.invoiceAmount || ord.totalAmount || 0,
      `"${ord.status}"`,
      `"${ord.invoiceNumber || ""}"`,
      `"${ord.courierName || ""}"`,
      `"${ord.trackingNumber || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OrganicGoldGarlic_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredOrders.length} orders to CSV!`, { icon: "📥" });
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    const targetOrder = orders.find((o) => o.id === orderId);

    if (newStatus === "Invoice Generated" && !targetOrder?.invoiceNumber) {
      toast("Please confirm the invoice amount and details.", { icon: "📜" });
      openInvoiceModal(targetOrder!);
      return;
    }

    if (newStatus === "Shipped") {
      toast("Please enter courier partner and tracking details before marking as Shipped.", { icon: "🚚" });
      openShippingModal(targetOrder!);
      return;
    }

    const toastId = toast.loading(`Updating Order #${targetOrder?.orderNumber ?? orderId} to "${newStatus}"...`);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Order #${targetOrder?.orderNumber ?? orderId} updated to "${newStatus}"! Automated email dispatched.`,
          { id: toastId, icon: "✅", duration: 4000 }
        );
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to update order status", { id: toastId });
      }
    } catch {
      toast.error("Failed to update status. Please try again.", { id: toastId });
    }
  }

  function openInvoiceModal(order: OrderItem) {
    setSelectedOrderForInvoice(order);
    const defaultAmount = order.invoiceAmount || order.totalAmount || order.quantity * 200;
    setInvoiceForm({
      invoiceNumber: order.invoiceNumber || `INV-${order.orderNumber.replace("OGG-", "")}`,
      invoiceAmount: defaultAmount,
      notes: order.notes || "Official tax & mandi invoice generated.",
    });
  }

  async function handleGenerateInvoiceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderForInvoice) return;

    const toastId = toast.loading("Generating official invoice & dispatching email...");
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
        toast.success(
          `Invoice #${invoiceForm.invoiceNumber} (₹${invoiceForm.invoiceAmount}) issued & emailed to customer!`,
          { id: toastId, icon: "📜", duration: 4500 }
        );
        setSelectedOrderForInvoice(null);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to generate invoice", { id: toastId });
      }
    } catch {
      toast.error("Failed to generate invoice", { id: toastId });
    }
  }

  function openShippingModal(order: OrderItem) {
    setSelectedOrderForShipping(order);
    setShippingForm({
      courierName: order.courierName || "",
      trackingNumber: order.trackingNumber || "",
      shippingDetails: order.shippingDetails || "",
    });
  }

  async function handleSaveShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrderForShipping) return;

    if (!shippingForm.courierName.trim() || !shippingForm.trackingNumber.trim()) {
      toast.error("Courier Partner and Tracking Number are required to dispatch.", { icon: "⚠️" });
      return;
    }

    const toastId = toast.loading("Recording shipment & dispatching tracking notification...");
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrderForShipping.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Shipped",
          courierName: shippingForm.courierName.trim(),
          trackingNumber: shippingForm.trackingNumber.trim(),
          shippingDetails: shippingForm.shippingDetails.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Order marked as Shipped! Tracking details emailed to customer.`,
          { id: toastId, icon: "🚚", duration: 4500 }
        );
        setSelectedOrderForShipping(null);
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to save shipping details", { id: toastId });
      }
    } catch {
      toast.error("Failed to save shipping details", { id: toastId });
    }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Saving new order...");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Order #${data.order?.orderNumber || "New"} recorded successfully!`,
          { id: toastId, icon: "📦", duration: 4000 }
        );
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
        toast.error(data.error || "Failed to create order", { id: toastId });
      }
    } catch {
      toast.error("Failed to create order", { id: toastId });
    }
  }

  async function updateEnquiryStatus(enquiryId: number, status: string, name: string) {
    const toastId = toast.loading(`Updating enquiry status to "${status}"...`);
    try {
      const res = await fetch(`/api/admin/enquiry/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Enquiry from ${name} marked as ${status}!`, { id: toastId, icon: "💬" });
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to update enquiry", { id: toastId });
      }
    } catch {
      toast.error("Failed to update enquiry status", { id: toastId });
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Saving settings configuration...");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Settings saved successfully!", { id: toastId, icon: "⚙️" });
      } else {
        toast.error(data.error || "Failed to save settings", { id: toastId });
      }
    } catch {
      toast.error("Failed to save settings", { id: toastId });
    }
  }

  async function handleSendOtp() {
    const toastId = toast.loading("Sending 6-digit OTP to rishav79031@gmail.com...");
    try {
      const res = await fetch("/api/admin/otp/send", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success("6-Digit OTP sent to your registered email!", { id: toastId, icon: "📩" });
        setOtpSent(true);
      } else {
        toast.error(data.error || "Failed to send OTP", { id: toastId });
      }
    } catch {
      toast.error("Failed to send OTP", { id: toastId });
    }
  }

  async function handleVerifyOtpReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.", { icon: "⚠️" });
      return;
    }

    const toastId = toast.loading("Verifying OTP & updating password...");
    try {
      const res = await fetch("/api/admin/otp/verify-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Superadmin password updated successfully!", { id: toastId, icon: "🔒" });
        setShowPasswordResetFlow(false);
        setOtpSent(false);
        setOtpCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Invalid OTP or reset failed", { id: toastId });
      }
    } catch {
      toast.error("Failed to reset password", { id: toastId });
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      toast.error("Please fill in name, email, and password.", { icon: "⚠️" });
      return;
    }

    const toastId = toast.loading(`Adding team member ${newUser.name}...`);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Team member ${newUser.name} (${newUser.role}) added successfully!`, { id: toastId, icon: "👤" });
        setNewUser({ name: "", email: "", password: "", role: "Staff", permissions: ["orders", "enquiries"] });
        loadDashboardData();
      } else {
        toast.error(data.error || "Failed to create user", { id: toastId });
      }
    } catch {
      toast.error("Failed to create user", { id: toastId });
    }
  }

  function togglePermission(perm: string) {
    if (newUser.permissions.includes(perm)) {
      setNewUser({
        ...newUser,
        permissions: newUser.permissions.filter((p) => p !== perm),
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: [...newUser.permissions, perm],
      });
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
      case "Shipped":
        return "bg-indigo-50 text-indigo-800 border-indigo-300";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "Order Processed":
        return "bg-purple-50 text-purple-800 border-purple-300 font-bold";
      case "Cancelled":
        return "bg-red-50 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  }

  const displayedEnquiries = useMemo(() => {
    if (enquiryFilter === "Pending") {
      return enquiries.filter((e) => e.status === "Pending");
    }
    if (enquiryFilter === "Answered") {
      return enquiries.filter((e) => e.status === "Answered" || e.status === "Contacted" || e.status === "Confirmed");
    }
    return enquiries;
  }, [enquiries, enquiryFilter]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row text-gray-800 w-full">
      
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-[#08130b] text-white flex flex-col justify-between p-4 sticky top-0 h-screen z-40 border-r border-gold/20 shrink-0 print:hidden`}
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
                  Management Portal
                </span>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1.5 text-xs">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium ${
                activeTab === "dashboard" ? "bg-gold text-[#08130b] font-bold shadow-md" : "text-gray-300 hover:bg-white/5"
              }`}
              title="Dashboard"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              {sidebarOpen && <span>Dashboard</span>}
            </button>

            {/* Orders */}
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium ${
                activeTab === "orders" ? "bg-gold text-[#08130b] font-bold shadow-md" : "text-gray-300 hover:bg-white/5"
              }`}
              title="Orders"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {sidebarOpen && <span>Orders</span>}
            </button>

            {/* Add Order */}
            <button
              onClick={() => setActiveTab("add-order")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium ${
                activeTab === "add-order" ? "bg-gold text-[#08130b] font-bold shadow-md" : "text-gray-300 hover:bg-white/5"
              }`}
              title="Add Order"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {sidebarOpen && <span>Add Order</span>}
            </button>

            {/* Enquiries (Fresh badge only) */}
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium ${
                activeTab === "enquiries" ? "bg-gold text-[#08130b] font-bold shadow-md" : "text-gray-300 hover:bg-white/5"
              }`}
              title="Enquiries"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {sidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span>Enquiries</span>
                  {stats && stats.pendingEnquiries > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {stats.pendingEnquiries} New
                    </span>
                  )}
                </div>
              )}
            </button>

            {/* Settings (Admin and Superadmin only, includes Team & Access submenu) */}
            {canManageSettingsAndAccess && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all font-medium ${
                  activeTab === "settings" ? "bg-gold text-[#08130b] font-bold shadow-md" : "text-gray-300 hover:bg-white/5"
                }`}
                title="Settings"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {sidebarOpen && <span>Settings</span>}
              </button>
            )}
          </nav>
        </div>

        {/* Footer Sidebar / User Info + Icon-Only Collapse Button */}
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
              className="p-2.5 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center justify-center"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h10M4 18h16" />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 text-red-300 hover:text-white transition-colors text-xs font-medium flex items-center justify-center gap-1.5"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Exit</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 2xl:p-12 overflow-y-auto w-full max-w-none print:p-0 print:overflow-visible">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 print:hidden">
          <div>
            <h1 className="font-brand text-2xl sm:text-3xl 2xl:text-4xl font-bold text-primary capitalize">
              {activeTab === "dashboard" ? "Dashboard" : activeTab.replace("-", " ")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/order"
              target="_blank"
              className="px-4 py-2.5 rounded-full border border-gold/60 text-xs font-semibold text-gold-dark hover:bg-gold hover:text-white transition-colors"
            >
              Public Order Page ↗
            </Link>
            <button
              onClick={() => {
                loadDashboardData();
                toast.success("Dashboard refreshed with latest data!", { icon: "↻" });
              }}
              className="px-4 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD METRICS */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 mt-6">
            
            <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4 2xl:gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Total Revenue</span>
                <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary mt-1">₹{stats?.totalRevenue ?? 0}</p>
                <span className="text-[11px] text-emerald-600 font-medium">Invoiced & fulfilled orders</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Total Orders</span>
                <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary mt-1">{stats?.totalOrders ?? 0}</p>
                <span className="text-[11px] text-gray-500 font-medium">{stats?.deliveredCount ?? 0} Delivered</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Awaiting Invoice</span>
                <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-amber-600 mt-1">
                  {(stats?.orderReceivedCount ?? 0) + (stats?.orderAcceptedCount ?? 0)}
                </p>
                <span className="text-[11px] text-amber-600 font-medium">Ready for invoice creation</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">Direct Enquiries</span>
                <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary mt-1">{stats?.totalEnquiries ?? 0}</p>
                <span className="text-[11px] text-red-500 font-medium">{stats?.pendingEnquiries ?? 0} Pending callbacks</span>
              </div>
            </div>

            {/* Shopify Pipeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-brand text-lg 2xl:text-xl font-bold text-primary">Shopify Order Lifecycle Pipeline</h3>
                <span className="text-xs text-gray-400 font-medium">Final Stage: Order Processed (Done)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 2xl:grid-cols-7 gap-3">
                <div className="bg-white p-4 rounded-xl border border-amber-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">1. Received</span>
                  <strong className="text-xl font-bold text-amber-600">{stats?.orderReceivedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">2. Accepted</span>
                  <strong className="text-xl font-bold text-blue-600">{stats?.orderAcceptedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-yellow-300 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">3. Invoiced</span>
                  <strong className="text-xl font-bold text-yellow-700">{stats?.invoiceGeneratedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-teal-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">4. Paid</span>
                  <strong className="text-xl font-bold text-teal-600">{stats?.paymentReceivedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-indigo-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">5. Shipped</span>
                  <strong className="text-xl font-bold text-indigo-600">{stats?.shippedCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block">6. Delivered</span>
                  <strong className="text-xl font-bold text-emerald-600">{stats?.deliveredCount ?? 0}</strong>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-300 text-center shadow-sm bg-purple-50/20">
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold block">7. Processed (Done)</span>
                  <strong className="text-xl font-bold text-purple-700">{stats?.orderProcessedCount ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 2xl:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand text-lg 2xl:text-xl font-bold text-primary">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-xs text-gold-dark font-bold hover:underline">
                  Manage All Orders &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">No orders recorded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs 2xl:text-sm">
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
                      {orders.slice(0, 6).map((ord) => (
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
                  onClick={() => {
                    setOrderFilter(st);
                    setCurrentPage(1);
                  }}
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

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative min-w-[200px] flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search by order #, name, phone..."
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-[11px] font-semibold text-gray-500">From:</span>
                  <input
                    type="date"
                    value={orderStartDate}
                    onChange={(e) => {
                      setOrderStartDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                  />
                  <span className="text-[11px] font-semibold text-gray-500">To:</span>
                  <input
                    type="date"
                    value={orderEndDate}
                    onChange={(e) => {
                      setOrderEndDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                  />
                  {(orderStartDate || orderEndDate || orderSearch) && (
                    <button
                      onClick={() => {
                        setOrderStartDate("");
                        setOrderEndDate("");
                        setOrderSearch("");
                      }}
                      className="text-xs text-red-500 hover:underline px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors"
                >
                  <span>📥</span> Export CSV
                </button>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Action Sticky Bar */}
            {selectedOrderIds.length > 0 && (
              <div className="bg-primary text-white p-3.5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold bg-gold text-[#08130b] px-2.5 py-1 rounded-full text-xs">
                    {selectedOrderIds.length} Selected
                  </span>
                  <span>Bulk Change Status:</span>
                  <select
                    value={bulkTargetStatus}
                    onChange={(e) => setBulkTargetStatus(e.target.value)}
                    className="px-3 py-1.5 bg-white text-gray-800 font-semibold rounded-xl text-xs focus:outline-none"
                  >
                    {SHOPIFY_STATUSES.filter((s) => s !== "Shipped").map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkStatusUpdate}
                    disabled={bulkLoading}
                    className="px-4 py-1.5 bg-gold text-[#08130b] font-bold rounded-xl hover:bg-gold-light text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {bulkLoading ? "Updating..." : "Apply Status →"}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedOrderIds([])}
                  className="text-xs text-white/70 hover:text-white underline"
                >
                  Deselect All
                </button>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 2xl:p-8">
              {filteredOrders.length === 0 ? (
                <p className="text-xs text-gray-400 py-8 text-center">No orders matching your filters.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs 2xl:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold">
                        <th className="pb-3 w-8">
                          <input
                            type="checkbox"
                            checked={isAllCurrentPageSelected}
                            onChange={toggleSelectAllCurrentPage}
                            className="w-4 h-4 rounded text-primary focus:ring-gold"
                            title="Select all on current page"
                          />
                        </th>
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
                      {paginatedOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedOrderIds.includes(ord.id)}
                              onChange={() => toggleSelectOrder(ord.id)}
                              className="w-4 h-4 rounded text-primary focus:ring-gold"
                            />
                          </td>

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

                          <td className="py-3.5 max-w-[200px] text-gray-500 truncate" title={ord.deliveryAddress}>
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
                              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-gold"
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
                              <button
                                onClick={() => openInvoiceModal(ord)}
                                className="px-2.5 py-1 rounded-md bg-gold/15 hover:bg-gold/30 text-gold-dark font-bold text-[10px] uppercase tracking-wider transition-colors"
                                title="Generate or Edit Invoice"
                              >
                                {ord.invoiceNumber ? "Edit Inv" : "+ Invoice"}
                              </button>

                              {ord.invoiceNumber && (
                                <button
                                  onClick={() => setPreviewInvoiceOrder(ord)}
                                  className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-wider transition-colors"
                                  title="View and Print Invoice"
                                >
                                  📄 Print
                                </button>
                              )}

                              <button
                                onClick={() => openShippingModal(ord)}
                                className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase tracking-wider transition-colors"
                                title="Add Courier Tracking"
                              >
                                🚚 Ship
                              </button>

                              <a
                                href={`https://wa.me/91${ord.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                                  `Hi ${ord.customerName}, your Organic Gold Garlic Order #${ord.orderNumber} status is now: ${ord.status}.${
                                    ord.invoiceNumber ? ` Invoice: ${ord.invoiceNumber} (₹${ord.invoiceAmount}).` : ""
                                  }${ord.trackingNumber ? ` Dispatched via ${ord.courierName} tracking: ${ord.trackingNumber}.` : ""}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-[10px] uppercase tracking-wider"
                                title="Notify on WhatsApp"
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

              {/* Pagination Controls */}
              {filteredOrders.length > 0 && (
                <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                  <span>
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      ← Previous
                    </button>

                    <span className="font-semibold text-gray-700 px-2">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ADD ORDER */}
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
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 2xl:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="font-brand text-lg 2xl:text-xl font-bold text-primary">Website Direct Enquiries</h2>
              
              <div className="flex items-center gap-2">
                {(["All", "Pending", "Answered"] as const).map((fil) => (
                  <button
                    key={fil}
                    onClick={() => setEnquiryFilter(fil)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      enquiryFilter === fil
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {fil === "Pending" ? "Fresh (Pending)" : fil}
                  </button>
                ))}
              </div>
            </div>

            {displayedEnquiries.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No enquiries matching filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs 2xl:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Product / Qty</th>
                      <th className="pb-3">Message</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedEnquiries.map((enq) => (
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
                        <td className="py-3 max-w-[240px] text-gray-500 truncate" title={enq.message || ""}>
                          {enq.message || "—"}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            enq.status === "Pending" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-[11px]">{new Date(enq.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {enq.status === "Pending" ? (
                              <button
                                onClick={() => updateEnquiryStatus(enq.id, "Answered", enq.name)}
                                className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] uppercase tracking-wider transition-colors"
                              >
                                Mark Answered ✓
                              </button>
                            ) : (
                              <button
                                onClick={() => updateEnquiryStatus(enq.id, "Pending", enq.name)}
                                className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] uppercase tracking-wider transition-colors"
                              >
                                Re-open
                              </button>
                            )}

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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS & SUBMENUS (Invoice GST, Team & Access, General, Security) */}
        {activeTab === "settings" && canManageSettingsAndAccess && (
          <div className="mt-6 space-y-6 max-w-4xl">
            
            {/* Settings Sub-Navigation Menu */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
              {[
                { id: "invoice", label: "📜 Invoice & GST Settings" },
                { id: "team", label: "👥 Team & Access Control" },
                { id: "general", label: "⚙️ Email Forwarding" },
                { id: "security", label: "🔒 Password & Security" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSettingsSubTab(sub.id as typeof settingsSubTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    settingsSubTab === sub.id
                      ? "bg-primary text-white shadow"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-gold"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUBMENU 1: INVOICE & GST SETTINGS */}
            {settingsSubTab === "invoice" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="font-brand text-lg font-bold text-primary mb-1">Official Invoice & GST Settings</h3>
                  <p className="text-xs text-gray-500">
                    These tax, license, and banking details dynamically render on your generated A4 customer invoices.
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Company Legal Billing Name</label>
                      <input
                        type="text"
                        value={settings.company_legal_name}
                        onChange={(e) => setSettings({ ...settings, company_legal_name: e.target.value })}
                        placeholder="e.g. Organic Gold Garlic"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">GSTIN Number (Goods & Services Tax)</label>
                      <input
                        type="text"
                        value={settings.gst_number}
                        onChange={(e) => setSettings({ ...settings, gst_number: e.target.value.toUpperCase() })}
                        placeholder="e.g. 10AAAAA0000A1Z5"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">FSSAI License / Registration No.</label>
                      <input
                        type="text"
                        value={settings.fssai_license}
                        onChange={(e) => setSettings({ ...settings, fssai_license: e.target.value })}
                        placeholder="e.g. 10423000000000"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">PAN Number</label>
                      <input
                        type="text"
                        value={settings.pan_number}
                        onChange={(e) => setSettings({ ...settings, pan_number: e.target.value.toUpperCase() })}
                        placeholder="e.g. AAAFO1234A"
                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Bank Details for Direct Invoice Settlement */}
                  <div className="pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-700 uppercase tracking-wider block mb-3 text-[11px]">
                      Bank & UPI Payment Details (Printed on Invoice)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={settings.bank_name}
                          onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                          placeholder="e.g. State Bank of India"
                          className="w-full px-3.5 py-2 border rounded-xl"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Bank Account Number</label>
                        <input
                          type="text"
                          value={settings.bank_account_no}
                          onChange={(e) => setSettings({ ...settings, bank_account_no: e.target.value })}
                          placeholder="Account Number"
                          className="w-full px-3.5 py-2 border rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-1">Bank IFSC Code</label>
                        <input
                          type="text"
                          value={settings.bank_ifsc}
                          onChange={(e) => setSettings({ ...settings, bank_ifsc: e.target.value.toUpperCase() })}
                          placeholder="e.g. SBIN0001234"
                          className="w-full px-3.5 py-2 border rounded-xl font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 font-medium mb-1">UPI ID (VPA)</label>
                        <input
                          type="text"
                          value={settings.upi_id}
                          onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                          placeholder="e.g. 7488503664@upi"
                          className="w-full px-3.5 py-2 border rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Terms */}
                  <div className="pt-2">
                    <label className="block text-gray-700 font-semibold mb-1">Standard Invoice Terms & Conditions</label>
                    <textarea
                      rows={2}
                      value={settings.invoice_terms}
                      onChange={(e) => setSettings({ ...settings, invoice_terms: e.target.value })}
                      placeholder="Terms printed at the bottom of the invoice..."
                      className="w-full px-3.5 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow">
                      Save Invoice & GST Settings →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SUBMENU 2: TEAM & ACCESS CONTROL (Admin & Superadmin only) */}
            {settingsSubTab === "team" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                  <h3 className="font-brand text-lg font-bold text-primary mb-1">Add Team Member / Staff</h3>
                  <p className="text-xs text-gray-500 mb-4">Grant access to specific dashboard modules with granular permissions.</p>

                  <form onSubmit={handleCreateUser} className="space-y-4 text-xs" autoComplete="off">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          autoComplete="off"
                          placeholder="Staff Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          autoComplete="off"
                          placeholder="staff@organicgoldgarlic.com"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          autoComplete="new-password"
                          placeholder="Create strong password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 font-semibold mb-1">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-gold"
                        >
                          <option value="Staff">Staff (Restricted Access)</option>
                          <option value="Admin">Admin (Orders & Enquiries)</option>
                          <option value="Superadmin">Superadmin (Full Control)</option>
                        </select>
                      </div>
                    </div>

                    {/* Module Permission Checkboxes */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Module Access Permissions</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                        {[
                          { id: "orders", label: "Orders & Invoicing" },
                          { id: "enquiries", label: "Enquiries & Leads" },
                          { id: "shipping", label: "Shipping Tracking" },
                          { id: "settings", label: "System Settings" },
                        ].map((mod) => (
                          <label key={mod.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                            <input
                              type="checkbox"
                              checked={newUser.permissions.includes(mod.id)}
                              onChange={() => togglePermission(mod.id)}
                              className="w-4 h-4 rounded text-primary focus:ring-gold"
                            />
                            <span>{mod.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow">
                      Create User & Assign Permissions →
                    </button>
                  </form>
                </div>

                {/* Users List with Module Badges */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                  <h3 className="font-brand text-base font-bold text-primary mb-4">Registered Users & Permissions</h3>
                  <div className="divide-y divide-gray-100 text-xs">
                    {usersList.map((u) => (
                      <div key={u.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <strong className="text-gray-900 block text-sm">{u.name}</strong>
                          <span className="text-gray-500">{u.email}</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">Access:</span>
                            {u.role === "Superadmin" ? (
                              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded">All Modules (Full)</span>
                            ) : (
                              ["Orders", "Enquiries", "Shipping"].map((m) => (
                                <span key={m} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {m}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
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

            {/* SUBMENU 3: EMAIL FORWARDING */}
            {settingsSubTab === "general" && (
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
            )}

            {/* SUBMENU 4: SECURITY & GUIDED PASSWORD RESET */}
            {settingsSubTab === "security" && user?.role === "Superadmin" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h3 className="font-brand text-lg font-bold text-primary mb-1">Superadmin Security & Password Reset</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Password changes for superadmin (<strong className="text-gray-800">rishav79031@gmail.com</strong>) require a verified 6-digit email OTP.
                </p>

                {!showPasswordResetFlow ? (
                  <div>
                    <button
                      onClick={() => setShowPasswordResetFlow(true)}
                      className="px-5 py-2.5 rounded-xl bg-gold/15 hover:bg-gold/30 text-gold-dark font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <span>🔐</span> Reset Superadmin Password
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-gold/30 space-y-4">
                    {!otpSent ? (
                      <div>
                        <p className="text-xs text-gray-700 mb-3">
                          Click below to receive a secure 6-digit one-time password on <strong>rishav79031@gmail.com</strong>:
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleSendOtp}
                            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider shadow"
                          >
                            Request 6-Digit Email OTP →
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPasswordResetFlow(false)}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOtpReset} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-1">Enter 6-Digit OTP *</label>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="e.g. 582194"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full px-3.5 py-2.5 border rounded-xl text-sm tracking-widest font-mono font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">New Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="At least 6 characters"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 font-semibold mb-1">Confirm New Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="Repeat new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-3.5 py-2.5 border rounded-xl text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow">
                            Verify & Change Password
                          </button>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            Resend OTP
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPasswordResetFlow(false);
                              setOtpSent(false);
                            }}
                            className="text-xs text-gray-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

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
                  placeholder="Enter real AWB / Tracking Code"
                  value={shippingForm.trackingNumber}
                  onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Shipping Details / Transit Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or expected delivery window"
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
                  Save Tracking & Mark Shipped →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INVOICE PREVIEW / PRINT - Guaranteed Exact Single-Page A4 Sheet */}
      {previewInvoiceOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:bg-white print:p-0">
          
          {/* Print Specific CSS to Force Single Page A4 Format */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-invoice-sheet, #printable-invoice-sheet * {
                visibility: visible !important;
              }
              #printable-invoice-sheet {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 190mm !important;
                margin: 0 auto !important;
                padding: 4mm 6mm !important;
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          `}} />

          <div
            id="printable-invoice-sheet"
            className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 animate-fadeIn my-4 text-xs font-sans text-gray-800 leading-snug"
          >
            
            {/* Header Toolbar (Hidden during print) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 print:hidden">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest block">
                  Single-Page Tax Invoice (A4 Standard)
                </span>
                <span className="text-[11px] text-gray-500">Optimized for 1-page paper printing & PDF export</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider shadow flex items-center gap-1.5"
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => setPreviewInvoiceOrder(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* A4 Sheet Header with Dynamic GST & Legal Information */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-gold/40">
              <div>
                <h2 className="font-logo text-lg font-bold text-primary tracking-widest uppercase">
                  {settings.company_legal_name || "ORGANIC GOLD GARLIC"}
                </h2>
                <p className="text-[11px] text-gray-600 mt-0.5 font-light">
                  Premium Hygienic Peeled Garlic Processing & Wholesale Supply
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Shivpuri Ward No. 09, Araria, Bihar – 854311 &bull; Phone: +91 74885 03664
                </p>
                
                {/* Tax & License Badges */}
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-gray-700 font-mono">
                  {settings.gst_number && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">
                      GSTIN: {settings.gst_number}
                    </span>
                  )}
                  {settings.fssai_license && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">
                      FSSAI Lic: {settings.fssai_license}
                    </span>
                  )}
                  {settings.pan_number && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded font-bold">
                      PAN: {settings.pan_number}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block bg-primary text-gold text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider mb-1">
                  TAX INVOICE
                </span>
                <p className="text-xs font-bold text-gray-900 font-mono">
                  {previewInvoiceOrder.invoiceNumber || `INV-${previewInvoiceOrder.orderNumber}`}
                </p>
                <p className="text-[10px] text-gray-500">
                  Date: {new Date(previewInvoiceOrder.createdAt).toLocaleDateString()}
                </p>
                <p className="text-[10px] text-gray-500">
                  Ref: #{previewInvoiceOrder.orderNumber}
                </p>
              </div>
            </div>

            {/* Billed To / Shipped To Grid */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 text-[11px]">
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block mb-0.5 text-[9px]">Billed To (Customer)</span>
                <p className="font-bold text-gray-900 text-xs">{previewInvoiceOrder.customerName}</p>
                <p className="text-gray-600">Ph: {previewInvoiceOrder.customerPhone}</p>
                {previewInvoiceOrder.customerEmail && (
                  <p className="text-gray-600">{previewInvoiceOrder.customerEmail}</p>
                )}
              </div>
              <div>
                <span className="font-bold text-gray-400 uppercase tracking-wider block mb-0.5 text-[9px]">Delivery Destination</span>
                <p className="text-gray-700">{previewInvoiceOrder.deliveryAddress}</p>
                <p className="text-gray-700">{previewInvoiceOrder.city}, Bihar</p>
                {previewInvoiceOrder.courierName && (
                  <p className="text-indigo-600 font-medium mt-0.5">
                    Dispatch: {previewInvoiceOrder.courierName} ({previewInvoiceOrder.trackingNumber || "Assigned"})
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-3">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[9px] font-bold">
                    <th className="pb-1.5">Description & Grade</th>
                    <th className="pb-1.5 text-center">HSN</th>
                    <th className="pb-1.5 text-center">Quantity</th>
                    <th className="pb-1.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2.5 font-medium text-gray-800">
                      {previewInvoiceOrder.product}
                      <span className="block text-[10px] text-gray-500 font-light">
                        100% Pure Peeled Garlic Cloves &bull; Vacuum-Sealed &bull; No Preservatives
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-gray-500 font-mono text-[10px]">07032000</td>
                    <td className="py-2.5 text-center font-bold text-gray-700">{previewInvoiceOrder.quantity}</td>
                    <td className="py-2.5 text-right font-bold text-gray-900">
                      ₹{previewInvoiceOrder.invoiceAmount ?? previewInvoiceOrder.totalAmount}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 font-bold">
                    <td colSpan={3} className="pt-2 text-right text-gray-800 text-xs">
                      Total Invoice Value (INR):
                    </td>
                    <td className="pt-2 text-right text-sm text-primary">
                      ₹{previewInvoiceOrder.invoiceAmount ?? previewInvoiceOrder.totalAmount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bank Details & UPI Section (Dynamic from Settings) */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 mt-2 text-[10px]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-gray-700 block mb-0.5 uppercase tracking-wider text-[9px]">
                    Bank Transfer & Settlement Details
                  </span>
                  <p className="text-gray-600">
                    <strong>Bank:</strong> {settings.bank_name || "State Bank of India (Araria)"} &bull; 
                    <strong> A/C:</strong> {settings.bank_account_no || "Registered Commercial Account"}
                  </p>
                  <p className="text-gray-600">
                    <strong>IFSC:</strong> {settings.bank_ifsc || "SBIN0001234"} &bull; 
                    <strong> UPI:</strong> {settings.upi_id || "7488503664@upi"}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-0.5 uppercase tracking-wider text-[9px]">
                    Terms & Commercial Conditions
                  </span>
                  <p className="text-gray-500 italic leading-snug">
                    {settings.invoice_terms || "Payment terms: Pay on Delivery or UPI upon dispatch. 100% natural agricultural produce."}
                  </p>
                </div>
              </div>
            </div>

            {/* Authorized Signatory Footnote */}
            <div className="pt-4 mt-3 border-t border-gray-200 flex justify-between items-end text-[10px] text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">Thank you for ordering with Organic Gold Garlic!</p>
                <p>Registered peeling facility in Shivpuri Ward 09, Araria, Bihar.</p>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-gray-400 mb-1"></div>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">
                  For {settings.company_legal_name || "Organic Gold Garlic"}
                </span>
                <span className="text-[8px] text-gray-400">Authorized Signatory</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
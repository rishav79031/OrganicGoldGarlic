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

type AdminTheme = "classic" | "neomorphism" | "dark-neomorphism" | "dark";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "add-order" | "enquiries" | "settings">("dashboard");
  const [settingsSubTab, setSettingsSubTab] = useState<"themes" | "invoice" | "team" | "general" | "security">("themes");
  const [theme, setTheme] = useState<AdminTheme>("classic");
  const [statsPeriod, setStatsPeriod] = useState<"all" | "30d" | "3m" | "6m">("all");
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
    active_theme: "classic",
  });

  // Theme Persistence & Handlers
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("admin_theme") as AdminTheme | null;
      if (savedTheme && ["classic", "dark", "neomorphism", "dark-neomorphism"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const handleThemeChange = (newTheme: AdminTheme) => {
    setTheme(newTheme);
    setSettings((prev) => ({ ...prev, active_theme: newTheme }));
    try {
      localStorage.setItem("admin_theme", newTheme);
    } catch {
      // ignore
    }
    const themeNames: Record<AdminTheme, string> = {
      classic: "Classic Gold (Light)",
      neomorphism: "Neomorphism Light (Soft UI)",
      "dark-neomorphism": "Dark Neomorphism (Cyber Soft-UI)",
      dark: "Midnight Gold (Dark)",
    };
    toast.success(`${themeNames[newTheme]} theme activated!`, { icon: "🎨" });
  };

  const handleSaveDefaultTheme = async () => {
    const toastId = toast.loading("Saving default theme preference...");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, active_theme: theme }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Theme "${theme}" saved as store default!`, { id: toastId, icon: "💾" });
      } else {
        toast.error(data.error || "Failed to save theme setting", { id: toastId });
      }
    } catch {
      toast.error("Network error saving default theme", { id: toastId });
    }
  };

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

  async function loadDashboardData(periodParam?: string) {
    setLoading(true);
    try {
      const activePeriod = periodParam !== undefined ? periodParam : statsPeriod;
      const statsRes = await fetch(`/api/admin/stats?period=${activePeriod}`);
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
        if (settingsData.settings.active_theme && !localStorage.getItem("admin_theme")) {
          setTheme(settingsData.settings.active_theme as AdminTheme);
        }
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

  async function handlePeriodChange(p: "all" | "30d" | "3m" | "6m") {
    setStatsPeriod(p);
    const labelMap = { all: "All Time", "30d": "Last 30 Days", "3m": "Last 3 Months", "6m": "Last 6 Months" };
    toast.success(`Displaying metrics for ${labelMap[p]}`, { icon: "📅" });
    loadDashboardData(p);
  }

  // Realtime User Status Toggle (Active <-> Disabled)
  async function handleToggleUserStatus(userId: number, newStatus: string) {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    // Optimistic UI update
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`User ${targetUser.name} is now ${newStatus}!`, { icon: newStatus === "Active" ? "✅" : "⏸️" });
      } else {
        toast.error(data.error || "Failed to update user status");
        loadDashboardData();
      }
    } catch {
      toast.error("Failed to update user status");
      loadDashboardData();
    }
  }

  // Realtime Module Permission Toggle for User
  async function handleToggleUserPermissionRealtime(userId: number, moduleKey: string) {
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return;

    const currentPerms = targetUser.permissions || ["orders", "enquiries"];
    const updatedPerms = currentPerms.includes(moduleKey)
      ? currentPerms.filter((m) => m !== moduleKey)
      : [...currentPerms, moduleKey];

    // Optimistic UI update
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions: updatedPerms } : u))
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, permissions: updatedPerms }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Updated ${moduleKey} permission for ${targetUser.name}!`, { icon: "🔐" });
      } else {
        toast.error(data.error || "Failed to update permissions");
        loadDashboardData();
      }
    } catch {
      toast.error("Failed to update user permissions");
      loadDashboardData();
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
    <div
      data-theme={theme}
      className={`admin-root min-h-screen flex flex-col md:flex-row w-full transition-colors duration-200 ${
        theme === "dark" || theme === "dark-neomorphism"
          ? "bg-[#0b130e] text-gray-100"
          : theme === "neomorphism"
          ? "bg-[#e8ecf4] text-slate-700"
          : "bg-[#f8f9fa] text-gray-800"
      }`}
    >
      {/* Theme Dynamic Scoped CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ================= DARK THEME ================= */
        .admin-root[data-theme="dark"] {
          background-color: #0b130e !important;
          color: #e5e7eb !important;
        }
        .admin-root[data-theme="dark"] aside {
          background-color: #060b08 !important;
          border-color: rgba(212, 175, 55, 0.25) !important;
        }
        .admin-root[data-theme="dark"] .bg-white {
          background-color: #122017 !important;
          border-color: #1f3627 !important;
          color: #f3f4f6 !important;
        }
        .admin-root[data-theme="dark"] .bg-gray-50,
        .admin-root[data-theme="dark"] .bg-gray-100 {
          background-color: #16281d !important;
          border-color: #23422e !important;
          color: #e5e7eb !important;
        }
        .admin-root[data-theme="dark"] input:not([type="checkbox"]),
        .admin-root[data-theme="dark"] select,
        .admin-root[data-theme="dark"] textarea {
          background-color: #182c20 !important;
          border-color: #2b4e39 !important;
          color: #ffffff !important;
        }
        .admin-root[data-theme="dark"] input::placeholder,
        .admin-root[data-theme="dark"] textarea::placeholder {
          color: #9ca3af !important;
        }
        .admin-root[data-theme="dark"] thead tr {
          background-color: #0d1710 !important;
          color: #9ca3af !important;
          border-color: #1f3627 !important;
        }
        .admin-root[data-theme="dark"] tbody tr {
          border-color: #1f3627 !important;
        }
        .admin-root[data-theme="dark"] tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        .admin-root[data-theme="dark"] .text-gray-900,
        .admin-root[data-theme="dark"] .text-gray-800,
        .admin-root[data-theme="dark"] .text-gray-700 {
          color: #f3f4f6 !important;
        }
        .admin-root[data-theme="dark"] .text-gray-600,
        .admin-root[data-theme="dark"] .text-gray-500 {
          color: #9ca3af !important;
        }
        .admin-root[data-theme="dark"] .border-gray-200,
        .admin-root[data-theme="dark"] .border-gray-300,
        .admin-root[data-theme="dark"] .border-gray-100 {
          border-color: #1f3627 !important;
        }
        .admin-root[data-theme="dark"] .text-primary {
          color: #e5a93c !important;
        }

        /* ================= NEOMORPHISM (SOFT UI) THEME ================= */
        .admin-root[data-theme="neomorphism"] {
          background-color: #e8ecf4 !important;
          color: #2d3748 !important;
        }
        .admin-root[data-theme="neomorphism"] aside {
          background-color: #e8ecf4 !important;
          border: none !important;
          box-shadow: 6px 0 20px rgba(163, 177, 198, 0.45) !important;
        }
        .admin-root[data-theme="neomorphism"] aside .text-white {
          color: #1a202c !important;
        }
        .admin-root[data-theme="neomorphism"] aside .text-gray-300,
        .admin-root[data-theme="neomorphism"] aside .text-gray-400 {
          color: #4a5568 !important;
        }
        .admin-root[data-theme="neomorphism"] aside button {
          transition: all 0.2s ease !important;
        }
        .admin-root[data-theme="neomorphism"] aside button.bg-gold {
          background-color: #e8ecf4 !important;
          color: #b3831b !important;
          box-shadow: inset 4px 4px 8px #c8d0de, inset -4px -4px 8px #ffffff !important;
        }
        .admin-root[data-theme="neomorphism"] aside button:not(.bg-gold):hover {
          box-shadow: 4px 4px 8px #c8d0de, -4px -4px 8px #ffffff !important;
          background-color: #e8ecf4 !important;
          color: #1a202c !important;
        }
        .admin-root[data-theme="neomorphism"] .bg-white,
        .admin-root[data-theme="neomorphism"] .bg-gray-50 {
          background-color: #e8ecf4 !important;
          border: none !important;
          border-radius: 1.25rem !important;
          box-shadow: 8px 8px 18px #c8d0de, -8px -8px 18px #ffffff !important;
          color: #2d3748 !important;
        }
        .admin-root[data-theme="neomorphism"] input:not([type="checkbox"]),
        .admin-root[data-theme="neomorphism"] select,
        .admin-root[data-theme="neomorphism"] textarea {
          background-color: #e8ecf4 !important;
          border: none !important;
          border-radius: 0.85rem !important;
          box-shadow: inset 3px 3px 6px #c8d0de, inset -3px -3px 6px #ffffff !important;
          color: #1a202c !important;
        }
        .admin-root[data-theme="neomorphism"] input:focus,
        .admin-root[data-theme="neomorphism"] select:focus,
        .admin-root[data-theme="neomorphism"] textarea:focus {
          box-shadow: inset 3px 3px 6px #c8d0de, inset -3px -3px 6px #ffffff, 0 0 0 2px #d4af37 !important;
          outline: none !important;
        }
        .admin-root[data-theme="neomorphism"] thead tr {
          background-color: #dbe2ef !important;
          color: #4a5568 !important;
          border: none !important;
        }
        .admin-root[data-theme="neomorphism"] tbody tr {
          border-color: #dbe2ef !important;
        }
        .admin-root[data-theme="neomorphism"] tbody tr:hover {
          background-color: rgba(219, 226, 239, 0.45) !important;
        }
        .admin-root[data-theme="neomorphism"] .border-gray-200,
        .admin-root[data-theme="neomorphism"] .border-gray-300,
        .admin-root[data-theme="neomorphism"] .border-gray-100 {
          border-color: #dbe2ef !important;
        }
        .admin-root[data-theme="neomorphism"] .text-primary {
          color: #0b1c10 !important;
        }

        /* ================= DARK NEOMORPHISM (CYBER SOFT-UI) ================= */
        .admin-root[data-theme="dark-neomorphism"] {
          background-color: #0c140e !important;
          color: #e2e8f0 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] aside {
          background-color: #0c140e !important;
          border: none !important;
          box-shadow: 6px 0 20px #050906 !important;
          color: #cbd5e1 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] aside .text-white {
          color: #f8fafc !important;
        }
        .admin-root[data-theme="dark-neomorphism"] aside .text-gray-300,
        .admin-root[data-theme="dark-neomorphism"] aside .text-gray-400 {
          color: #94a3b8 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] aside button.bg-gold {
          background-color: #0c140e !important;
          color: #fbbf24 !important;
          box-shadow: inset 4px 4px 8px #050906, inset -4px -4px 8px #18281e !important;
        }
        .admin-root[data-theme="dark-neomorphism"] aside button:not(.bg-gold):hover {
          box-shadow: 4px 4px 8px #050906, -4px -4px 8px #18281e !important;
          background-color: #0c140e !important;
          color: #f8fafc !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .bg-white,
        .admin-root[data-theme="dark-neomorphism"] .bg-gray-50 {
          background-color: #101c15 !important;
          border: none !important;
          border-radius: 1.25rem !important;
          box-shadow: 8px 8px 18px #060b08, -8px -8px 18px #1a2d22 !important;
          color: #f3f4f6 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .bg-white:hover,
        .admin-root[data-theme="dark-neomorphism"] .bg-gray-50:hover {
          box-shadow: 12px 12px 24px #040805, -12px -12px 24px #20372a !important;
          transform: translateY(-3px) !important;
        }
        .admin-root[data-theme="dark-neomorphism"] input:not([type="checkbox"]),
        .admin-root[data-theme="dark-neomorphism"] select,
        .admin-root[data-theme="dark-neomorphism"] textarea {
          background-color: #0b130e !important;
          border: none !important;
          border-radius: 0.85rem !important;
          box-shadow: inset 3px 3px 6px #050906, inset -3px -3px 6px #16261c !important;
          color: #ffffff !important;
        }
        .admin-root[data-theme="dark-neomorphism"] input:focus,
        .admin-root[data-theme="dark-neomorphism"] select:focus,
        .admin-root[data-theme="dark-neomorphism"] textarea:focus {
          box-shadow: inset 3px 3px 6px #050906, inset -3px -3px 6px #16261c, 0 0 0 2px #d4af37 !important;
          outline: none !important;
        }
        .admin-root[data-theme="dark-neomorphism"] thead tr {
          background-color: #090f0b !important;
          color: #94a3b8 !important;
          border: none !important;
        }
        .admin-root[data-theme="dark-neomorphism"] tbody tr {
          border-color: #16261c !important;
        }
        .admin-root[data-theme="dark-neomorphism"] tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .text-gray-900,
        .admin-root[data-theme="dark-neomorphism"] .text-gray-800,
        .admin-root[data-theme="dark-neomorphism"] .text-gray-700 {
          color: #f1f5f9 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .text-gray-600,
        .admin-root[data-theme="dark-neomorphism"] .text-gray-500 {
          color: #94a3b8 !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .border-gray-200,
        .admin-root[data-theme="dark-neomorphism"] .border-gray-300,
        .admin-root[data-theme="dark-neomorphism"] .border-gray-100 {
          border-color: #16261c !important;
        }
        .admin-root[data-theme="dark-neomorphism"] .text-primary {
          color: #f59e0b !important;
        }

        /* ================= CARD HOVER & UI ANIMATIONS ================= */
        .admin-root .bg-white {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease !important;
        }
        .admin-root .bg-white:hover {
          border-color: rgba(212, 175, 55, 0.35) !important;
        }

        /* Dark Theme Card Hover Effect */
        .admin-root[data-theme="dark"] .bg-white:hover {
          box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.7), 0 0 16px rgba(212, 175, 55, 0.15) !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
        }

        /* Neomorphism Card Hover Effect */
        .admin-root[data-theme="neomorphism"] .bg-white:hover,
        .admin-root[data-theme="neomorphism"] .bg-gray-50:hover {
          box-shadow: 12px 12px 24px #c2c9d6, -12px -12px 24px #ffffff !important;
        }

        /* Keep printed invoice strictly clean white on paper */
        @media print {
          .admin-root, .admin-root * {
            background-color: transparent !important;
            color: initial !important;
            box-shadow: none !important;
          }
          #printable-invoice-sheet {
            background-color: #ffffff !important;
            color: #111827 !important;
          }
        }
      `}} />
      
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

          <div className="flex flex-col gap-2 w-full">
            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-full py-2.5 px-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center ${
                sidebarOpen ? "justify-start gap-3" : "justify-center"
              }`}
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              aria-label={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
              {sidebarOpen && <span className="text-xs font-medium">Collapse Menu</span>}
            </button>

            {/* Sign Out / Exit Button */}
            <button
              onClick={handleLogout}
              className={`w-full py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/30 text-red-300 hover:text-white transition-all text-xs font-semibold flex items-center ${
                sidebarOpen ? "justify-start gap-3" : "justify-center"
              }`}
              title="Sign Out"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 2xl:p-12 overflow-y-auto w-full max-w-none print:p-0 print:overflow-visible">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="font-brand text-2xl sm:text-3xl 2xl:text-4xl font-bold text-primary capitalize">
              {activeTab === "dashboard" ? "Dashboard" : activeTab.replace("-", " ")}
            </h1>

            {/* Time Period Filter for Dashboard Metrics */}
            {activeTab === "dashboard" && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm text-xs font-semibold">
                {[
                  { id: "all", label: "All Time" },
                  { id: "30d", label: "Last 30 Days" },
                  { id: "3m", label: "Last 3 Months" },
                  { id: "6m", label: "Last 6 Months" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handlePeriodChange(t.id as typeof statsPeriod)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      statsPeriod === t.id
                        ? "bg-primary text-white shadow font-bold"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
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
            
            {/* 4 Interactive Dashboard Metrics Cards with Micro-Interactions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
              
              {/* Metric 1: Total Revenue */}
              <div className="group relative bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gold/50 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-default overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">Total Revenue</span>
                    <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary group-hover:text-gold-dark transition-colors duration-200">
                      ₹{stats?.totalRevenue ?? 0}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center text-lg font-bold group-hover:scale-110 group-hover:bg-gold group-hover:text-white transition-all duration-300 shadow-sm">
                    ₹
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Invoiced & fulfilled orders
                </div>
                {/* Modern Hover Glow Line */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold via-emerald-500 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

              {/* Metric 2: Total Orders */}
              <div
                onClick={() => { setOrderFilter("All"); setActiveTab("orders"); }}
                className="group relative bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">Total Orders</span>
                    <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary group-hover:text-blue-600 transition-colors duration-200">
                      {stats?.totalOrders ?? 0}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    📦
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium">{stats?.deliveredCount ?? 0} Delivered</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">View All &rarr;</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

              {/* Metric 3: Awaiting Invoice */}
              <div
                onClick={() => { setOrderFilter("Order Received"); setActiveTab("orders"); }}
                className="group relative bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">Awaiting Invoice</span>
                    <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-amber-600 group-hover:text-amber-700 transition-colors duration-200">
                      {(stats?.orderReceivedCount ?? 0) + (stats?.orderAcceptedCount ?? 0)}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    📜
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-amber-600 font-semibold">Ready for invoice creation</span>
                  <span className="text-amber-700 font-bold group-hover:underline">Process &rarr;</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

              {/* Metric 4: Direct Enquiries */}
              <div
                onClick={() => setActiveTab("enquiries")}
                className="group relative bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-red-400/50 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">Direct Enquiries</span>
                    <p className="text-2xl sm:text-3xl 2xl:text-4xl font-brand font-bold text-primary group-hover:text-red-600 transition-colors duration-200">
                      {stats?.totalEnquiries ?? 0}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-600 flex items-center justify-center text-lg font-bold group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    💬
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-red-500 font-semibold flex items-center gap-1">
                    {stats && stats.pendingEnquiries > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                    {stats?.pendingEnquiries ?? 0} Pending callbacks
                  </span>
                  <span className="text-red-600 font-bold group-hover:underline">Respond &rarr;</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-400 to-rose-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

            </div>

            {/* Shopify Pipeline with Clickable Steps */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-brand text-lg 2xl:text-xl font-bold text-primary">Shopify Order Lifecycle Pipeline</h3>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-semibold">Click to filter</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">Final Stage: Order Processed (Done)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 2xl:grid-cols-7 gap-3">
                {[
                  { stage: "1. Received", count: stats?.orderReceivedCount ?? 0, filter: "Order Received", color: "border-amber-300/80 hover:border-amber-500 text-amber-600" },
                  { stage: "2. Accepted", count: stats?.orderAcceptedCount ?? 0, filter: "Order Accepted", color: "border-blue-300/80 hover:border-blue-500 text-blue-600" },
                  { stage: "3. Invoiced", count: stats?.invoiceGeneratedCount ?? 0, filter: "Invoice Generated", color: "border-yellow-400/80 hover:border-yellow-600 text-yellow-700" },
                  { stage: "4. Paid", count: stats?.paymentReceivedCount ?? 0, filter: "Payment Received", color: "border-teal-300/80 hover:border-teal-500 text-teal-600" },
                  { stage: "5. Shipped", count: stats?.shippedCount ?? 0, filter: "Shipped", color: "border-indigo-300/80 hover:border-indigo-500 text-indigo-600" },
                  { stage: "6. Delivered", count: stats?.deliveredCount ?? 0, filter: "Delivered", color: "border-emerald-300/80 hover:border-emerald-500 text-emerald-600" },
                  { stage: "7. Processed", count: stats?.orderProcessedCount ?? 0, filter: "Order Processed", color: "border-purple-300/80 hover:border-purple-500 text-purple-700 bg-purple-50/20" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setOrderFilter(item.filter);
                      setActiveTab("orders");
                    }}
                    className={`group cursor-pointer bg-white p-3.5 rounded-xl border ${item.color} text-center shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 transition-all duration-200 select-none relative overflow-hidden`}
                    title={`Click to view all ${item.filter} orders`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block truncate">
                      {item.stage}
                    </span>
                    <strong className="text-xl font-bold mt-0.5 block group-hover:scale-110 transition-transform duration-200">
                      {item.count}
                    </strong>
                    <span className="text-[9px] text-gray-400 block group-hover:text-primary transition-colors">
                      View &rarr;
                    </span>
                  </div>
                ))}
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
                { id: "themes", label: "🎨 Themes & Appearance" },
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

            {/* SUBMENU 0: THEMES & APPEARANCE */}
            {settingsSubTab === "themes" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-brand text-lg font-bold text-primary mb-1">Themes & Visual Appearance</h3>
                      <p className="text-xs text-gray-500">
                        Customize your management portal. Choose between Classic Gold, Soft-UI Neomorphism, or Midnight Dark Mode.
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/40">
                      Active: <span className="capitalize font-black">{theme}</span>
                    </span>
                  </div>
                </div>

                {/* 4 Theme Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  
                  {/* Option 1: Classic Light */}
                  <div
                    onClick={() => handleThemeChange("classic")}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      theme === "classic"
                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div>
                      {/* Mini UI Mockup */}
                      <div className="h-28 rounded-xl bg-[#f8f9fa] border border-gray-200 p-2.5 mb-4 flex gap-2 overflow-hidden shadow-inner">
                        <div className="w-8 bg-[#08130b] rounded-lg shrink-0 flex flex-col items-center pt-2 gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-gold"></div>
                          <div className="w-4 h-1 rounded bg-white/40"></div>
                          <div className="w-4 h-1 rounded bg-white/20"></div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-4 bg-white rounded border border-gray-200 flex items-center px-1.5 justify-between">
                            <div className="w-8 h-1.5 bg-gray-300 rounded"></div>
                            <div className="w-3 h-1.5 bg-gold rounded"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-10 bg-white rounded border border-gray-200 p-1 flex flex-col justify-between">
                              <div className="w-6 h-1 bg-gray-300 rounded"></div>
                              <div className="w-8 h-2 bg-emerald-600 rounded"></div>
                            </div>
                            <div className="h-10 bg-white rounded border border-gray-200 p-1 flex flex-col justify-between">
                              <div className="w-6 h-1 bg-gray-300 rounded"></div>
                              <div className="w-8 h-2 bg-primary rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-gray-900">Classic Gold</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          Light
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        Crisp white cards, forest green sidebar, and emerald status badges. Optimized for bright daylight clarity.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-700">
                        {theme === "classic" ? "✓ Currently Active" : "Click to Activate"}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        theme === "classic" ? "border-primary bg-primary text-white" : "border-gray-300"
                      }`}>
                        {theme === "classic" && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Neomorphism (Soft UI) */}
                  <div
                    onClick={() => handleThemeChange("neomorphism")}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      theme === "neomorphism"
                        ? "border-gold bg-[#e8ecf4] shadow-[8px_8px_18px_#c8d0de,-8px_-8px_18px_#ffffff] ring-2 ring-gold/30"
                        : "border-gray-200 bg-[#e8ecf4] hover:shadow-[5px_5px_12px_#c8d0de,-5px_-5px_12px_#ffffff]"
                    }`}
                  >
                    <div>
                      {/* Mini UI Mockup */}
                      <div className="h-28 rounded-xl bg-[#e8ecf4] p-2.5 mb-4 flex gap-2 overflow-hidden shadow-[inset_3px_3px_6px_#c8d0de,inset_-3px_-3px_6px_#ffffff]">
                        <div className="w-8 bg-[#e8ecf4] rounded-lg shrink-0 flex flex-col items-center pt-2 gap-1.5 shadow-[2px_2px_5px_#c8d0de,-2px_-2px_5px_#ffffff]">
                          <div className="w-3 h-3 rounded-full bg-gold"></div>
                          <div className="w-4 h-1 rounded bg-[#c8d0de]"></div>
                          <div className="w-4 h-1 rounded bg-[#c8d0de]"></div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-4 bg-[#e8ecf4] rounded-lg flex items-center px-1.5 justify-between shadow-[inset_2px_2px_4px_#c8d0de,inset_-2px_-2px_4px_#ffffff]">
                            <div className="w-8 h-1.5 bg-[#a0aec0] rounded"></div>
                            <div className="w-3 h-1.5 bg-gold rounded"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-10 bg-[#e8ecf4] rounded-lg p-1 flex flex-col justify-between shadow-[3px_3px_6px_#c8d0de,-3px_-3px_6px_#ffffff]">
                              <div className="w-6 h-1 bg-[#a0aec0] rounded"></div>
                              <div className="w-8 h-2 bg-gold-dark rounded"></div>
                            </div>
                            <div className="h-10 bg-[#e8ecf4] rounded-lg p-1 flex flex-col justify-between shadow-[3px_3px_6px_#c8d0de,-3px_-3px_6px_#ffffff]">
                              <div className="w-6 h-1 bg-[#a0aec0] rounded"></div>
                              <div className="w-8 h-2 bg-[#2d3748] rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-slate-800">Neomorphism</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                          Soft UI
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Modern extruded dual-shadow panels, recessed inset form fields, and smooth tactile buttons.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#c8d0de] flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">
                        {theme === "neomorphism" ? "✓ Currently Active" : "Click to Activate"}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        theme === "neomorphism" ? "border-gold bg-gold text-[#08130b] font-bold" : "border-slate-400"
                      }`}>
                        {theme === "neomorphism" && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Dark Neomorphism (Dark Soft-UI) */}
                  <div
                    onClick={() => handleThemeChange("dark-neomorphism")}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      theme === "dark-neomorphism"
                        ? "border-gold bg-[#0c140e] shadow-[8px_8px_18px_#050906,-8px_-8px_18px_#18281e] ring-2 ring-gold/40"
                        : "border-gray-800 bg-[#0c140e] hover:shadow-[5px_5px_12px_#050906,-5px_-5px_12px_#18281e]"
                    }`}
                  >
                    <div>
                      {/* Mini UI Mockup */}
                      <div className="h-28 rounded-xl bg-[#0c140e] p-2.5 mb-4 flex gap-2 overflow-hidden shadow-[inset_3px_3px_6px_#050906,inset_-3px_-3px_6px_#18281e]">
                        <div className="w-8 bg-[#0c140e] rounded-lg shrink-0 flex flex-col items-center pt-2 gap-1.5 shadow-[2px_2px_5px_#050906,-2px_-2px_5px_#18281e]">
                          <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                          <div className="w-4 h-1 rounded bg-[#203428]"></div>
                          <div className="w-4 h-1 rounded bg-[#203428]"></div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-4 bg-[#0c140e] rounded-lg flex items-center px-1.5 justify-between shadow-[inset_2px_2px_4px_#050906,inset_-2px_-2px_4px_#18281e]">
                            <div className="w-8 h-1.5 bg-[#4a6354] rounded"></div>
                            <div className="w-3 h-1.5 bg-gold rounded"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-10 bg-[#101c15] rounded-lg p-1 flex flex-col justify-between shadow-[3px_3px_6px_#050906,-3px_-3px_6px_#1a2d21]">
                              <div className="w-6 h-1 bg-[#4a6354] rounded"></div>
                              <div className="w-8 h-2 bg-gold-dark rounded"></div>
                            </div>
                            <div className="h-10 bg-[#101c15] rounded-lg p-1 flex flex-col justify-between shadow-[3px_3px_6px_#050906,-3px_-3px_6px_#1a2d21]">
                              <div className="w-6 h-1 bg-[#4a6354] rounded"></div>
                              <div className="w-8 h-2 bg-emerald-400 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-gold">Dark Neomorphism</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/20 px-2 py-0.5 rounded border border-gold/40">
                          Dark Soft-UI
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed mb-4">
                        Dark obsidian soft surfaces with dual shadows, recessed dark inputs & gold glow.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#18281e] flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-200">
                        {theme === "dark-neomorphism" ? "✓ Currently Active" : "Click to Activate"}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        theme === "dark-neomorphism" ? "border-gold bg-gold text-[#08130b] font-bold" : "border-gray-700"
                      }`}>
                        {theme === "dark-neomorphism" && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                  {/* Option 4: Midnight Gold (Dark Theme) */}
                  <div
                    onClick={() => handleThemeChange("dark")}
                    className={`cursor-pointer rounded-2xl p-5 border-2 transition-all relative flex flex-col justify-between ${
                      theme === "dark"
                        ? "border-gold bg-[#0b130e] shadow-xl ring-2 ring-gold/30"
                        : "border-gray-700 bg-[#0b130e] hover:border-gold/50"
                    }`}
                  >
                    <div>
                      {/* Mini UI Mockup */}
                      <div className="h-28 rounded-xl bg-[#060b08] border border-[#1f3627] p-2.5 mb-4 flex gap-2 overflow-hidden shadow-inner">
                        <div className="w-8 bg-[#030604] rounded-lg shrink-0 flex flex-col items-center pt-2 gap-1.5 border-r border-[#1f3627]">
                          <div className="w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
                          <div className="w-4 h-1 rounded bg-white/20"></div>
                          <div className="w-4 h-1 rounded bg-white/10"></div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-4 bg-[#122017] rounded border border-[#1f3627] flex items-center px-1.5 justify-between">
                            <div className="w-8 h-1.5 bg-gray-500 rounded"></div>
                            <div className="w-3 h-1.5 bg-gold rounded"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-10 bg-[#122017] rounded border border-[#1f3627] p-1 flex flex-col justify-between">
                              <div className="w-6 h-1 bg-gray-500 rounded"></div>
                              <div className="w-8 h-2 bg-gold rounded"></div>
                            </div>
                            <div className="h-10 bg-[#122017] rounded border border-[#1f3627] p-1 flex flex-col justify-between">
                              <div className="w-6 h-1 bg-gray-500 rounded"></div>
                              <div className="w-8 h-2 bg-emerald-400 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-bold text-sm text-gray-100">Midnight Gold</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                          Dark Mode
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        Deep obsidian emerald backdrop with glowing gold accents. Minimizes eye fatigue for night work.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1f3627] flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-200">
                        {theme === "dark" ? "✓ Currently Active" : "Click to Activate"}
                      </span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        theme === "dark" ? "border-gold bg-gold text-[#08130b] font-bold" : "border-gray-600"
                      }`}>
                        {theme === "dark" && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Theme Persistence Toolbar */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💾</span>
                    <div>
                      <p className="font-semibold text-gray-800">Store-Wide Theme Persistence</p>
                      <p className="text-[11px] text-gray-500">
                        Save your active theme as the permanent default for all admin sessions and devices.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleThemeChange("classic")}
                      className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
                    >
                      Reset Default
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveDefaultTheme}
                      className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow uppercase tracking-wider text-[11px]"
                    >
                      Save Theme As Default
                    </button>
                  </div>
                </div>

              </div>
            )}

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
                          onChange={(e) => {
                            const newRole = e.target.value;
                            const newPerms = newRole === "Superadmin" || newRole === "Admin"
                              ? ["dashboard", "orders", "add-order", "enquiries", "settings"]
                              : ["orders", "enquiries"];
                            setNewUser({ ...newUser, role: newRole, permissions: newPerms });
                          }}
                          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:border-gold"
                        >
                          <option value="Staff">Staff (Custom Access)</option>
                          <option value="Admin">Admin (All Modules Auto-Checked)</option>
                          <option value="Superadmin">Superadmin (All Modules Master)</option>
                        </select>
                      </div>
                    </div>

                    {/* Module Permission Checkboxes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-gray-700 font-semibold">Module Access Permissions</label>
                        <span className="text-[11px] text-gray-500">
                          {newUser.role === "Superadmin" || newUser.role === "Admin" ? "✓ All checked by default" : "Select permitted modules"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                        {[
                          { id: "dashboard", label: "Dashboard" },
                          { id: "orders", label: "Orders" },
                          { id: "add-order", label: "Add Order" },
                          { id: "enquiries", label: "Enquiries" },
                          { id: "settings", label: "Settings" },
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

                {/* Users List with Realtime Status Toggle & Realtime Module Permissions */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-brand text-base font-bold text-primary">Registered Users & Realtime Access Control</h3>
                      <p className="text-xs text-gray-500">Toggle status or click module checkboxes to edit permissions in realtime.</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                      ⚡ Live Sync Active
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {usersList.map((u) => {
                      const isSuperadminUser = u.role === "Superadmin";
                      const currentPerms = u.permissions || (isSuperadminUser || u.role === "Admin" ? ["dashboard", "orders", "add-order", "enquiries", "settings"] : ["orders", "enquiries"]);

                      return (
                        <div key={u.id} className="py-4 space-y-3">
                          {/* User Header Row with Status Toggle */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-gray-900 text-sm font-bold">{u.name}</strong>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  u.role === "Superadmin" ? "bg-amber-100 text-amber-800" : u.role === "Admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
                                }`}>
                                  {u.role}
                                </span>
                              </div>
                              <span className="text-gray-500 text-[11px]">{u.email}</span>
                            </div>

                            {/* Realtime Status Toggle Button */}
                            <div className="flex items-center gap-2.5">
                              {isSuperadminUser ? (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                  ● Active (Protected)
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleUserStatus(u.id, u.status === "Active" ? "Disabled" : "Active")}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                      u.status === "Active" ? "bg-emerald-600" : "bg-gray-300"
                                    }`}
                                    title={`Click to ${u.status === "Active" ? "Disable" : "Enable"} ${u.name}`}
                                  >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                                      u.status === "Active" ? "translate-x-6" : "translate-x-1"
                                    }`} />
                                  </button>
                                  <span className={`text-[11px] font-bold ${u.status === "Active" ? "text-emerald-700" : "text-gray-400"}`}>
                                    {u.status}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Realtime Module Permission Checkboxes */}
                          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200/80">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                              Module Permissions (Realtime Toggle):
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              {[
                                { id: "dashboard", label: "Dashboard" },
                                { id: "orders", label: "Orders" },
                                { id: "add-order", label: "Add Order" },
                                { id: "enquiries", label: "Enquiries" },
                                { id: "settings", label: "Settings" },
                              ].map((mod) => {
                                const hasPerm = currentPerms.includes(mod.id);
                                return (
                                  <label
                                    key={mod.id}
                                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                                      hasPerm
                                        ? "bg-white border-gold text-gray-900 shadow-xs font-semibold"
                                        : "bg-gray-100/60 border-transparent text-gray-400 hover:text-gray-600"
                                    } ${isSuperadminUser ? "opacity-60 cursor-not-allowed" : ""}`}
                                  >
                                    <input
                                      type="checkbox"
                                      disabled={isSuperadminUser}
                                      checked={hasPerm}
                                      onChange={() => handleToggleUserPermissionRealtime(u.id, mod.id)}
                                      className="w-3.5 h-3.5 rounded text-primary focus:ring-gold"
                                    />
                                    <span>{mod.label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
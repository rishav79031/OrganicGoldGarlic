"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { formatDate, STATUS_COLORS, STATUSES, type Status } from "@/lib/utils";

interface Enquiry {
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

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const router = useRouter();

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json() as { enquiries?: Enquiry[] };
      setEnquiries(data.enquiries ?? []);
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchEnquiries();
  }, [fetchEnquiries]);

  async function handleStatusChange(id: number, status: Status) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/enquiry/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        toast.success(`Status updated to ${status}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const filtered = enquiries.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      (e.city ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "Pending").length,
    confirmed: enquiries.filter((e) => e.status === "Confirmed").length,
    completed: enquiries.filter((e) => e.status === "Completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm leading-none">Admin Panel</p>
              <p className="text-gray-400 text-xs">Organic Fresh Gold Garlic</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="text-gray-400 hover:text-primary text-sm flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Enquiries", value: stats.total, color: "text-gray-800", bg: "bg-gray-100" },
            { label: "Pending", value: stats.pending, color: "text-yellow-700", bg: "bg-yellow-50" },
            { label: "Confirmed", value: stats.confirmed, color: "text-purple-700", bg: "bg-purple-50" },
            { label: "Completed", value: stats.completed, color: "text-green-700", bg: "bg-green-50" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-5 border border-gray-100`}
            >
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, phone, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 cursor-pointer"
            >
              <option value="All">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={fetchEnquiries}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-gray-400">Loading enquiries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-500 font-medium">No enquiries found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || filterStatus !== "All"
                  ? "Try adjusting your filters"
                  : "No enquiries submitted yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["ID", "Name", "Phone", "City", "Product", "Qty", "Date", "Status", "Action"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((enq) => (
                    <tr
                      key={enq.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-gray-400 font-mono text-xs">
                        #{enq.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-800">{enq.name}</div>
                        {enq.email && (
                          <div className="text-gray-400 text-xs">{enq.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-gray-700">
                        {enq.phone}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {enq.city ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-lg">
                          🧄 {enq.product}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700 font-medium">
                        {enq.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(enq.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block text-xs font-medium px-2.5 py-1 rounded-lg border ${STATUS_COLORS[enq.status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="relative">
                          <select
                            value={enq.status}
                            disabled={updatingId === enq.id}
                            onChange={(e) =>
                              handleStatusChange(enq.id, e.target.value as Status)
                            }
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-gold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          {updatingId === enq.id && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                              <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {filtered.length} of {enquiries.length} enquiries
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

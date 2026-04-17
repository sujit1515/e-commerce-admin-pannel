"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, Mail, Phone, MapPin, ShoppingBag, Star, XCircle, Loader2 } from "lucide-react";
import { getAllUsers } from "@/api/auth"

type CustomerStatus = "Active" | "Inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  spent: string;
  status: CustomerStatus;
  joined: string;
  avatar: string;
  avatarBg: string;
}

type FilterOption = "All" | CustomerStatus;

const PER_PAGE = 6;

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string): string => {
  const colors = [
    "bg-violet-100 text-violet-600",
    "bg-indigo-100 text-indigo-600",
    "bg-emerald-100 text-emerald-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
    "bg-cyan-100 text-cyan-600",
    "bg-yellow-100 text-yellow-600",
    "bg-red-100 text-red-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
  ];
  const index = name.length % colors.length;
  return colors[index];
};

const statusBadge = (status: CustomerStatus): string =>
  status === "Active"
    ? "bg-green-50 text-green-600 border-green-200"
    : "bg-gray-100 text-gray-500 border-gray-200";

export default function Customers() {
  const [search, setSearch] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterOption>("All");
  const [page, setPage] = useState<number>(1);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllUsers();
        
        if (response.success && response.users) {
          // Transform API users to match our Customer interface
          const transformedCustomers: Customer[] = response.users.map((user: any, index: number) => {
            // Generate mock data for fields that might not come from API
            // In a real app, you'd have these fields from your backend
            const name = user.name || user.fullName || "Unknown User";
            const email = user.email;
            const phone = user.phone || "+1 555-0000";
            const location = user.location || "Unknown Location";
            const orders = user.totalOrders || Math.floor(Math.random() * 20) + 1;
            const spent = user.totalSpent || `$${Math.floor(Math.random() * 5000)}`;
            const status = user.isActive ? "Active" : "Inactive";
            const joined = user.createdAt 
              ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "Jan 1, 2025";
            
            return {
              id: user.id || user._id || index.toString(),
              name,
              email,
              phone,
              location,
              orders,
              spent: typeof spent === "number" ? `$${spent.toLocaleString()}` : spent,
              status,
              joined,
              avatar: getInitials(name),
              avatarBg: getRandomColor(name),
            };
          });
          
          setCustomers(transformedCustomers);
        } else {
          setError("Failed to load customers");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("An error occurred while loading customers");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = customers.filter((c) => {
    const s = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s);
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = (id: string): void => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setDeleteId(null);
    // In a real app, you would also call an API to delete the user
    // await deleteUser(id);
  };

  const activeCount = customers.filter((c) => c.status === "Active").length;
  const totalSpent = customers.reduce(
    (sum, c) => sum + parseFloat(c.spent.replace(/[$,]/g, "")),
    0
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer accounts and activity.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-semibold">
            {activeCount} Active
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold">
            ${totalSpent.toLocaleString()} Total Spent
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search customers..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <div className="flex gap-1.5">
          {(["All", "Active", "Inactive"] as FilterOption[]).map((f) => (
            <button
              key={f}
              onClick={() => { setFilterStatus(f); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                filterStatus === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Customer", "Contact", "Location", "Orders", "Total Spent", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
                ))}
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${c.avatarBg}`}>
                        {c.avatar}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    </div>
                   </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-600">{c.email}</p>
                    <p className="text-xs text-gray-400">{c.phone}</p>
                   </td>
                  <td className="px-5 py-4 text-xs text-gray-500">{c.location}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-700">{c.orders}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-800">{c.spent}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge(c.status)}`}>
                      {c.status}
                    </span>
                   </td>
                  <td className="px-5 py-4 text-xs text-gray-400">{c.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewCustomer(c)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-gray-50">
          {paginated.map((c) => (
            <div key={c.id} className="p-4 flex gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${c.avatarBg}`}>
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{c.orders} orders</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-700">{c.spent}</span>
                  <span>•</span>
                  <span>{c.location}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setViewCustomer(c)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 font-medium hover:bg-red-100"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">{total === 0 ? 0 : (page - 1) * PER_PAGE + 1}</span> to{" "}
            <span className="font-semibold text-gray-800">{Math.min(page * PER_PAGE, total)}</span> of{" "}
            <span className="font-semibold text-gray-800">{total}</span> customers
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 text-sm font-medium rounded-lg ${n === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Customer Profile</h2>
              <button onClick={() => setViewCustomer(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${viewCustomer.avatarBg}`}>
                  {viewCustomer.avatar}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{viewCustomer.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(viewCustomer.status)}`}>
                    {viewCustomer.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {(
                  [
                    [Mail,        viewCustomer.email],
                    [Phone,       viewCustomer.phone],
                    [MapPin,      viewCustomer.location],
                    [ShoppingBag, `${viewCustomer.orders} orders placed`],
                    [Star,        `${viewCustomer.spent} total spent`],
                  ] as [React.ElementType, string][]
                ).map(([Icon, label]) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">Member since {viewCustomer.joined}</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setViewCustomer(null)}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Remove Customer?</h2>
            <p className="text-sm text-gray-500 mb-6">This will permanently delete the customer account.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { LucideIcon, Search, Eye, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";

// type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

// interface Order {
//   id: string;
//   customer: string;
//   email: string;
//   items: number;
//   amount: string;
//   status: OrderStatus;
//   date: string;
//   payment: string;
// }

// interface StatusConfig {
//   cls: string;
//   icon: LucideIcon;
// }

// const ALL_ORDERS: Order[] = [
//   { id: "#ORD-1042", customer: "Alice Johnson", email: "alice@mail.com", items: 2, amount: "$129.00", status: "Delivered",  date: "Mar 12, 2026", payment: "Credit Card" },
//   { id: "#ORD-1041", customer: "Bob Martinez",  email: "bob@mail.com",   items: 1, amount: "$299.00", status: "Processing", date: "Mar 12, 2026", payment: "PayPal" },
//   { id: "#ORD-1040", customer: "Carol White",   email: "carol@mail.com", items: 3, amount: "$85.00",  status: "Shipped",    date: "Mar 11, 2026", payment: "Credit Card" },
//   { id: "#ORD-1039", customer: "David Lee",     email: "david@mail.com", items: 1, amount: "$199.00", status: "Cancelled",  date: "Mar 11, 2026", payment: "Debit Card" },
//   { id: "#ORD-1038", customer: "Eva Brown",     email: "eva@mail.com",   items: 4, amount: "$429.00", status: "Delivered",  date: "Mar 10, 2026", payment: "Credit Card" },
//   { id: "#ORD-1037", customer: "Frank Wilson",  email: "frank@mail.com", items: 1, amount: "$85.00",  status: "Shipped",    date: "Mar 10, 2026", payment: "PayPal" },
//   { id: "#ORD-1036", customer: "Grace Kim",     email: "grace@mail.com", items: 2, amount: "$258.00", status: "Processing", date: "Mar 9, 2026",  payment: "Credit Card" },
//   { id: "#ORD-1035", customer: "Henry Chen",    email: "henry@mail.com", items: 1, amount: "$129.00", status: "Delivered",  date: "Mar 9, 2026",  payment: "Debit Card" },
//   { id: "#ORD-1034", customer: "Isla Park",     email: "isla@mail.com",  items: 2, amount: "$384.00", status: "Cancelled",  date: "Mar 8, 2026",  payment: "PayPal" },
//   { id: "#ORD-1033", customer: "Jake Turner",   email: "jake@mail.com",  items: 1, amount: "$199.00", status: "Delivered",  date: "Mar 8, 2026",  payment: "Credit Card" },
// ];

// const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
//   Delivered:  { cls: "bg-green-50 text-green-600 border border-green-200",    icon: CheckCircle2 },
//   Processing: { cls: "bg-blue-50 text-blue-600 border border-blue-200",       icon: Clock },
//   Shipped:    { cls: "bg-indigo-50 text-indigo-600 border border-indigo-200", icon: Truck },
//   Cancelled:  { cls: "bg-red-50 text-red-500 border border-red-200",          icon: XCircle },
// };

// type FilterOption = "All" | OrderStatus;
// const FILTERS: FilterOption[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
// const PER_PAGE = 6;

// export default function Orders() {
//   const [search, setSearch]           = useState<string>("");
//   const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
//   const [page, setPage]               = useState<number>(1);
//   const [viewOrder, setViewOrder]     = useState<Order | null>(null);

//   const filtered = ALL_ORDERS.filter((o) => {
//     const matchSearch =
//       o.customer.toLowerCase().includes(search.toLowerCase()) ||
//       o.id.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = activeFilter === "All" || o.status === activeFilter;
//     return matchSearch && matchFilter;
//   });

//   const total      = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
//   const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

//   const statusCount = (s: OrderStatus): number => ALL_ORDERS.filter((o) => o.status === s).length;

//   return (
//     <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
//           <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders.</p>
//         </div>
//         <div className="flex items-center gap-2 flex-wrap">
//           {(["Processing", "Shipped"] as OrderStatus[]).map((s) => (
//             <div key={s} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${STATUS_CONFIG[s].cls}`}>
//               {statusCount(s)} {s}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Filters + Search */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           <input
//             value={search}
//             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//             placeholder="Search orders or customers..."
//             className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
//           />
//         </div>
//         <div className="flex gap-1.5 flex-wrap">
//           {FILTERS.map((f) => (
//             <button
//               key={f}
//               onClick={() => { setActiveFilter(f); setPage(1); }}
//               className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
//                 activeFilter === f
//                   ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
//                   : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//         {/* Desktop */}
//         <div className="hidden sm:block overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b border-gray-100">
//                 {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date", ""].map((h) => (
//                   <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {paginated.map((o) => {
//                 const { cls, icon: SIcon } = STATUS_CONFIG[o.status];
//                 return (
//                   <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
//                     <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-600">{o.id}</td>
//                     <td className="px-5 py-4">
//                       <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
//                       <p className="text-xs text-gray-400">{o.email}</p>
//                     </td>
//                     <td className="px-5 py-4 text-sm text-gray-600">{o.items} item{o.items > 1 ? "s" : ""}</td>
//                     <td className="px-5 py-4 text-sm font-bold text-gray-800">{o.amount}</td>
//                     <td className="px-5 py-4 text-xs text-gray-500">{o.payment}</td>
//                     <td className="px-5 py-4">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
//                         <SIcon className="w-3 h-3" />{o.status}
//                       </span>
//                     </td>
//                     <td className="px-5 py-4 text-xs text-gray-400">{o.date}</td>
//                     <td className="px-5 py-4">
//                       <button
//                         onClick={() => setViewOrder(o)}
//                         className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile */}
//         <div className="sm:hidden divide-y divide-gray-50">
//           {paginated.map((o) => {
//             const { cls, icon: SIcon } = STATUS_CONFIG[o.status];
//             return (
//               <div key={o.id} className="p-4">
//                 <div className="flex items-start justify-between gap-2 mb-2">
//                   <div>
//                     <p className="text-xs font-mono text-indigo-600 font-semibold">{o.id}</p>
//                     <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
//                     <p className="text-xs text-gray-400">{o.email}</p>
//                   </div>
//                   <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
//                     <SIcon className="w-3 h-3" />{o.status}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex gap-3 text-xs text-gray-500">
//                     <span>{o.items} item{o.items > 1 ? "s" : ""}</span>
//                     <span>•</span>
//                     <span>{o.payment}</span>
//                     <span>•</span>
//                     <span>{o.date}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-bold text-gray-800">{o.amount}</span>
//                     <button onClick={() => setViewOrder(o)} className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
//           <p className="text-sm text-gray-500">
//             Showing{" "}
//             <span className="font-semibold text-gray-800">{total === 0 ? 0 : (page - 1) * PER_PAGE + 1}</span> to{" "}
//             <span className="font-semibold text-gray-800">{Math.min(page * PER_PAGE, total)}</span> of{" "}
//             <span className="font-semibold text-gray-800">{total}</span> orders
//           </p>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="w-4 h-4" /> Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
//               <button
//                 key={n}
//                 onClick={() => setPage(n)}
//                 className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${n === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
//               >
//                 {n}
//               </button>
//             ))}
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               Next <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Order Detail Modal */}
//       {viewOrder && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <h2 className="text-base font-bold text-gray-900">Order Details</h2>
//               <button onClick={() => setViewOrder(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
//                 <XCircle className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6 space-y-3">
//               {(
//                 [
//                   ["Order ID",  viewOrder.id],
//                   ["Customer",  viewOrder.customer],
//                   ["Email",     viewOrder.email],
//                   ["Items",     `${viewOrder.items} item${viewOrder.items > 1 ? "s" : ""}`],
//                   ["Amount",    viewOrder.amount],
//                   ["Payment",   viewOrder.payment],
//                   ["Date",      viewOrder.date],
//                 ] as [string, string][]
//               ).map(([k, v]) => (
//                 <div key={k} className="flex justify-between text-sm">
//                   <span className="text-gray-400 font-medium">{k}</span>
//                   <span className="text-gray-800 font-semibold">{v}</span>
//                 </div>
//               ))}
//               <div className="flex justify-between items-center text-sm pt-1">
//                 <span className="text-gray-400 font-medium">Status</span>
//                 <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[viewOrder.status].cls}`}>
//                   {viewOrder.status}
//                 </span>
//               </div>
//             </div>
//             <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
//               <button
//                 onClick={() => setViewOrder(null)}
//                 className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Eye, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, XCircle, Truck, RefreshCw,
  Package, X, ChevronDown, Loader2
} from "lucide-react";
import {
  getAllOrdersAdmin,
  getSingleOrderAdmin,
  updateOrderStatusAdmin,
  AdminOrder,
  OrderDetails,
} from "@/api/orders"; 

/* ─── Types ─────────────────────────────────────────────── */
type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";
type FilterOption = "All" | OrderStatus;

/* ─── Config ─────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  OrderStatus,
  { cls: string; dot: string; icon: React.ElementType }
> = {
  Delivered:  { cls: "bg-emerald-50 text-emerald-600 border border-emerald-200",  dot: "bg-emerald-500", icon: CheckCircle2 },
  Processing: { cls: "bg-amber-50 text-amber-600 border border-amber-200",         dot: "bg-amber-500",   icon: Clock        },
  Shipped:    { cls: "bg-sky-50 text-sky-600 border border-sky-200",               dot: "bg-sky-500",     icon: Truck        },
  Cancelled:  { cls: "bg-red-50 text-red-500 border border-red-200",              dot: "bg-red-500",     icon: XCircle      },
};

const FILTERS: FilterOption[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
const PER_PAGE = 6;
const STATUS_OPTIONS: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Cancelled"];

/* ─── Helpers ────────────────────────────────────────────── */
function Badge({ status }: { status: OrderStatus }) {
  const { cls, icon: Icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function Spinner() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Orders() {
  /* list state */
  const [orders, setOrders]           = useState<AdminOrder[]>([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [loading, setLoading]         = useState(false);

  /* filter state */
  const [search, setSearch]           = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [page, setPage]               = useState(1);

  /* detail modal state */
  const [viewOrder, setViewOrder]     = useState<OrderDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  /* status update state */
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [statusMsg, setStatusMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Fetch orders list ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await getAllOrdersAdmin({
      page,
      limit: PER_PAGE,
      search: search || undefined,
      status: activeFilter !== "All" ? activeFilter : undefined,
    });
    setOrders(result.orders);
    setTotal(result.total);
    setTotalPages(result.totalPages);
    setLoading(false);
  }, [page, search, activeFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* debounce search → reset page */
  useEffect(() => {
    setPage(1);
  }, [search, activeFilter]);

  /* ── Open detail modal ── */
  const openDetail = async (rawId: string) => {
    // rawId here is the formatted "#ORD-XXXX" id from AdminOrder
    // We need to find the MongoDB _id — the backend returns it as part of the list
    // So we store the real _id in AdminOrder.displayId (see note below)
    setDetailOrderId(rawId);
    setDetailLoading(true);
    setViewOrder(null);
    setStatusMsg(null);
    setSelectedStatus("");

    const detail = await getSingleOrderAdmin(rawId);
    if (detail) {
      setViewOrder(detail);
      // Pre-select current status mapped to frontend label
      const dbToFrontend: Record<string, OrderStatus> = {
        confirmed: "Processing",
        shipped:   "Shipped",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };
      setSelectedStatus(dbToFrontend[detail.orderStatus] || "Processing");
    }
    setDetailLoading(false);
  };

  const closeDetail = () => {
    setViewOrder(null);
    setDetailOrderId(null);
    setStatusMsg(null);
  };

  /* ── Update status ── */
  const handleStatusUpdate = async () => {
    if (!viewOrder || !selectedStatus) return;
    setUpdatingStatus(true);
    setStatusMsg(null);

    const ok = await updateOrderStatusAdmin(viewOrder._id, selectedStatus as OrderStatus);
    if (ok) {
      setStatusMsg({ type: "success", text: "Status updated successfully!" });
      fetchOrders(); // refresh list
      // optimistically update modal
      const dbMap: Record<OrderStatus, string> = {
        Processing: "confirmed",
        Shipped: "shipped",
        Delivered: "delivered",
        Cancelled: "cancelled",
      };
      setViewOrder((prev) => prev ? { ...prev, orderStatus: dbMap[selectedStatus as OrderStatus] } : prev);
    } else {
      setStatusMsg({ type: "error", text: "Failed to update status. Try again." });
    }
    setUpdatingStatus(false);
  };

  /* ── Status counts (from loaded orders — approximate) ── */
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount    = orders.filter((o) => o.status === "Shipped").length;

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 font-sans">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} total orders · manage and track all customer activity
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {processingCount > 0 && (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${STATUS_CONFIG.Processing.cls}`}>
              {processingCount} Processing
            </div>
          )}
          {shippedCount > 0 && (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${STATUS_CONFIG.Shipped.cls}`}>
              {shippedCount} Shipped
            </div>
          )}
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer or order ID..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                activeFilter === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {["Order ID", "Customer", "Items", "Amount", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      <p className="text-sm">Loading orders…</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <Package className="w-10 h-10" />
                      <p className="text-sm font-medium">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const status = o.status as OrderStatus;
                  const { cls, icon: SIcon } = STATUS_CONFIG[status] ?? STATUS_CONFIG.Processing;
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-sm font-mono font-semibold text-indigo-600">{o.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{o.items} item{o.items > 1 ? "s" : ""}</td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-800">{o.amount}</td>
                      <td className="px-5 py-4 text-xs text-gray-500">{o.payment}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
                          <SIcon className="w-3 h-3" />{status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">{o.date}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openDetail(o.displayId || o.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="View details"
                        >
                          {detailLoading && detailOrderId === (o.displayId || o.id)
                            ? <Spinner />
                            : <Eye className="w-4 h-4" />
                          }
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-gray-50">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm">Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <Package className="w-10 h-10" />
              <p className="text-sm font-medium">No orders found</p>
            </div>
          ) : (
            orders.map((o) => {
              const status = o.status as OrderStatus;
              const { cls, icon: SIcon } = STATUS_CONFIG[status] ?? STATUS_CONFIG.Processing;
              return (
                <div key={o.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-mono text-indigo-600 font-semibold">{o.id}</p>
                      <p className="text-sm font-semibold text-gray-800">{o.customer}</p>
                      <p className="text-xs text-gray-400">{o.email}</p>
                    </div>
                    <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                      <SIcon className="w-3 h-3" />{status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{o.items} item{o.items > 1 ? "s" : ""}</span>
                      <span>·</span>
                      <span>{o.payment}</span>
                      <span>·</span>
                      <span>{o.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">{o.amount}</span>
                      <button
                        onClick={() => openDetail(o.displayId || o.id)}
                        className="p-1 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        {detailLoading && detailOrderId === (o.displayId || o.id)
                          ? <Spinner />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Pagination ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {total === 0 ? 0 : (page - 1) * PER_PAGE + 1}
            </span>{" "}to{" "}
            <span className="font-semibold text-gray-800">
              {Math.min(page * PER_PAGE, total)}
            </span>{" "}of{" "}
            <span className="font-semibold text-gray-800">{total}</span> orders
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
                className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                  n === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
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

      {/* ── Order Detail Modal ── */}
      {(detailOrderId) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Order Details</h2>
              <button
                onClick={closeDetail}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {detailLoading ? (
                <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Fetching order details…</p>
                </div>
              ) : !viewOrder ? (
                <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
                  <Package className="w-10 h-10" />
                  <p className="text-sm font-medium">Order not found</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Info rows */}
                  <div className="space-y-3">
                    {[
                      ["Order ID",  viewOrder._id],
                      ["Customer",  viewOrder.user?.name || "—"],
                      ["Email",     viewOrder.user?.email || "—"],
                      ["Items",     `${viewOrder.items?.length ?? 0} item${(viewOrder.items?.length ?? 0) !== 1 ? "s" : ""}`],
                      ["Total",     `₹${viewOrder.totalAmount?.toFixed(2) ?? "0.00"}`],
                      ["Payment",   viewOrder.paymentMethod || "—"],
                      ["Placed",    new Date(viewOrder.createdAt).toDateString()],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">{k}</span>
                        <span className="text-gray-800 font-semibold text-right max-w-[60%] truncate" title={v}>{v}</span>
                      </div>
                    ))}

                    {/* Current status badge */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-medium">Current Status</span>
                      {(() => {
                        const dbToFrontend: Record<string, OrderStatus> = {
                          confirmed: "Processing",
                          shipped:   "Shipped",
                          delivered: "Delivered",
                          cancelled: "Cancelled",
                        };
                        const s = dbToFrontend[viewOrder.orderStatus] || "Processing";
                        return <Badge status={s} />;
                      })()}
                    </div>
                  </div>

                  {/* Items list */}
                  {viewOrder.items?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                      <div className="space-y-2">
                        {viewOrder.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-2.5 text-sm">
                            <div>
                              <p className="font-semibold text-gray-800">{item.product?.name || "Product"}</p>
                              {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">₹{item.price}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Status Update ── */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Update Status</p>
                    <div className="flex gap-2">
                      {/* Custom dropdown */}
                      <div className="relative flex-1">
                        <button
                          onClick={() => setStatusDropdownOpen((v) => !v)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-colors"
                        >
                          {selectedStatus ? (
                            <Badge status={selectedStatus as OrderStatus} />
                          ) : (
                            <span className="text-gray-400">Select status…</span>
                          )}
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {statusDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setSelectedStatus(s);
                                  setStatusDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedStatus === s ? "bg-indigo-50" : ""}`}
                              >
                                <Badge status={s} />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleStatusUpdate}
                        disabled={updatingStatus || !selectedStatus}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {updatingStatus ? <Spinner /> : null}
                        {updatingStatus ? "Saving…" : "Update"}
                      </button>
                    </div>

                    {/* Feedback message */}
                    {statusMsg && (
                      <p className={`mt-2 text-xs font-medium ${statusMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {statusMsg.text}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={closeDetail}
                className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import {
  LucideIcon, ShoppingCart, Users, DollarSign,
  ArrowUpRight, Package, Clock, CheckCircle2,
  XCircle, Truck, TrendingUp, RefreshCw,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getOrderStatusSummary,
  DashboardStats,
  RecentOrder,
  TopProduct,
  OrderStatusSummary,
} from "@/api/dashboard";

/* ─── Types ─────────────────────────────────────────────── */
type OrderStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled";

interface StatusConfig {
  cls: string;
  icon: LucideIcon;
}

/* ─── Config ─────────────────────────────────────────────── */
const STATUS_MAP: Record<OrderStatus, StatusConfig> = {
  Delivered:  { cls: "bg-green-50 text-green-600 border border-green-200",    icon: CheckCircle2 },
  Processing: { cls: "bg-blue-50 text-blue-600 border border-blue-200",       icon: Clock },
  Shipped:    { cls: "bg-indigo-50 text-indigo-600 border border-indigo-200", icon: Truck },
  Cancelled:  { cls: "bg-red-50 text-red-500 border border-red-200",          icon: XCircle },
};

const BAR_COLORS: string[] = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-orange-400"];

const VALID_STATUSES: OrderStatus[] = ["Delivered", "Processing", "Shipped", "Cancelled"];

/* ─── Helper: safely convert any string → valid OrderStatus ── */
function toOrderStatus(s: string): OrderStatus {
  return VALID_STATUSES.includes(s as OrderStatus) ? (s as OrderStatus) : "Processing";
}

/* ─── Skeleton ───────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

/* ─── Stat Card ──────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  border: string;
  loading: boolean;
}

function StatCard({ label, value, icon: Icon, color, border, loading }: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl border ${border} p-4 sm:p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-200" />
      </div>
      {loading ? (
        <>
          <Skeleton className="h-7 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </>
      ) : (
        <>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function Dashboard() {
  const [stats, setStats]                 = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders]   = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts]     = useState<TopProduct[]>([]);
  const [statusSummary, setStatusSummary] = useState<OrderStatusSummary | null>(null);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  const fetchAll = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const [s, ro, tp, ss] = await Promise.all([
      getDashboardStats(),
      getRecentOrders(5),
      getTopProducts(),
      getOrderStatusSummary(),
    ]);

    setStats(s);
    setRecentOrders(ro);
    setTopProducts(tp);
    setStatusSummary(ss);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchAll(); }, []);

  /* ─── Stat card definitions ─── */
  const statCards = [
    {
      label:  "Total Revenue",
      value:  stats ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "—",
      icon:   DollarSign,
      color:  "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100",
    },
    {
      label:  "Total Orders",
      value:  stats ? stats.totalOrders.toLocaleString() : "—",
      icon:   ShoppingCart,
      color:  "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      label:  "Total Customers",
      value:  stats ? stats.totalCustomers.toLocaleString() : "—",
      icon:   Users,
      color:  "bg-violet-50 text-violet-600",
      border: "border-violet-100",
    },
    {
      label:  "Products",
      value:  stats ? stats.totalProducts.toLocaleString() : "—",
      icon:   Package,
      color:  "bg-orange-50 text-orange-500",
      border: "border-orange-100",
    },
  ];

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening today.</p>
        </div>
        <button
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Status Summary Pills */}
      <div className="flex flex-wrap gap-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24 rounded-full" />
          ))
        ) : statusSummary ? (
          (Object.entries(statusSummary) as [string, number][]).map(([rawStatus, count]) => {
            const status = toOrderStatus(rawStatus);
            const { cls, icon: Icon } = STATUS_MAP[status];
            return (
              <span
                key={rawStatus}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
              >
                <Icon className="w-3 h-3" />
                {count} {rawStatus}
              </span>
            );
          })
        ) : null}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
            <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">View all</span>
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => {
                    const status = toOrderStatus(o.status);
                    const { cls, icon: SIcon } = STATUS_MAP[status];
                    return (
                      <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3 text-sm font-mono font-medium text-indigo-600">{o.id}</td>
                        <td className="px-5 py-3 text-sm text-gray-700">{o.customer}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-800">{o.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                            <SIcon className="w-3 h-3" />
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-400">{o.date}</td>
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
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between gap-2">
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-1.5 flex flex-col items-end">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
                <Package className="w-8 h-8" />
                <p className="text-xs">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((o) => {
                const status = toOrderStatus(o.status);
                const { cls, icon: SIcon } = STATUS_MAP[status];
                return (
                  <div key={o.id} className="px-4 py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono text-indigo-600 font-semibold">{o.id}</p>
                      <p className="text-sm text-gray-700 font-medium">{o.customer}</p>
                      <p className="text-xs text-gray-400">{o.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{o.amount}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                        <SIcon className="w-3 h-3" />
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Top Products</h2>
            <TrendingUp className="w-4 h-4 text-gray-300" />
          </div>
          <div className="px-5 py-4 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))
            ) : topProducts.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                <Package className="w-8 h-8" />
                <p className="text-xs">No product data yet</p>
              </div>
            ) : (
              topProducts.map(({ name, sold, revenue, pct }, i) => (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-700 truncate max-w-[140px]">{name}</p>
                    <p className="text-xs font-bold text-gray-800 flex-shrink-0 ml-2">{revenue}</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${BAR_COLORS[i] ?? "bg-gray-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{sold} sold</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
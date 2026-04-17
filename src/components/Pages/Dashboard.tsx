"use client";

import { LucideIcon, ShoppingCart, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";

interface StatCard {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: LucideIcon;
  color: string;
  border: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  date: string;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: string;
  pct: number;
}

interface StatusConfig {
  cls: string;
  icon: LucideIcon;
}

const stats: StatCard[] = [
  { label: "Total Revenue",    value: "$48,295", change: "+12.5%", up: true,  icon: DollarSign,   color: "bg-indigo-50 text-indigo-600",  border: "border-indigo-100" },
  { label: "Total Orders",     value: "1,842",   change: "+8.2%",  up: true,  icon: ShoppingCart, color: "bg-emerald-50 text-emerald-600", border: "border-emerald-100" },
  { label: "Total Customers",  value: "3,210",   change: "+5.1%",  up: true,  icon: Users,        color: "bg-violet-50 text-violet-600",   border: "border-violet-100" },
  { label: "Products",         value: "42",      change: "-2.0%",  up: false, icon: Package,      color: "bg-orange-50 text-orange-500",   border: "border-orange-100" },
];

const recentOrders: RecentOrder[] = [
  { id: "#ORD-1042", customer: "Alice Johnson", amount: "$129.00", status: "Delivered",  date: "Mar 12, 2026" },
  { id: "#ORD-1041", customer: "Bob Martinez",  amount: "$299.00", status: "Processing", date: "Mar 12, 2026" },
  { id: "#ORD-1040", customer: "Carol White",   amount: "$85.00",  status: "Shipped",    date: "Mar 11, 2026" },
  { id: "#ORD-1039", customer: "David Lee",     amount: "$199.00", status: "Cancelled",  date: "Mar 11, 2026" },
  { id: "#ORD-1038", customer: "Eva Brown",     amount: "$429.00", status: "Delivered",  date: "Mar 10, 2026" },
];

const topProducts: TopProduct[] = [
  { name: "Smart Fitness Watch",       sold: 142, revenue: "$28,258", pct: 85 },
  { name: "Wireless Noise Headphones", sold: 98,  revenue: "$29,302", pct: 70 },
  { name: "Premium Leather Backpack",  sold: 76,  revenue: "$9,804",  pct: 52 },
  { name: "Minimalist Desk Lamp",      sold: 44,  revenue: "$3,740",  pct: 30 },
];

const STATUS_MAP: Record<RecentOrder["status"], StatusConfig> = {
  Delivered:  { cls: "bg-green-50 text-green-600 border border-green-200",    icon: CheckCircle2 },
  Processing: { cls: "bg-blue-50 text-blue-600 border border-blue-200",       icon: Clock },
  Shipped:    { cls: "bg-indigo-50 text-indigo-600 border border-indigo-200", icon: Truck },
  Cancelled:  { cls: "bg-red-50 text-red-500 border border-red-200",          icon: XCircle },
};

const BAR_COLORS: string[] = ["bg-indigo-500", "bg-violet-500", "bg-emerald-500", "bg-orange-400"];

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, Jane! Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, change, up, icon: Icon, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-4 sm:p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
                {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {change}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
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
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => {
                  const { cls, icon: SIcon } = STATUS_MAP[o.status];
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono font-medium text-indigo-600">{o.id}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{o.customer}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-800">{o.amount}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
                          <SIcon className="w-3 h-3" />{o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400">{o.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-gray-50">
            {recentOrders.map((o) => {
              const { cls } = STATUS_MAP[o.status];
              return (
                <div key={o.id} className="px-4 py-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-mono text-indigo-600 font-semibold">{o.id}</p>
                    <p className="text-sm text-gray-700 font-medium">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{o.amount}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{o.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Top Products</h2>
            <TrendingUp className="w-4 h-4 text-gray-300" />
          </div>
          <div className="px-5 py-4 space-y-4">
            {topProducts.map(({ name, sold, revenue, pct }, i) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-gray-700 truncate max-w-[140px]">{name}</p>
                  <p className="text-xs font-bold text-gray-800 flex-shrink-0 ml-2">{revenue}</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${BAR_COLORS[i]}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{sold} sold</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
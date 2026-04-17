"use client";

import { useState } from "react";
import { Bell, Search, Menu, ChevronDown } from "lucide-react";

interface Notification {
  msg: string;
  time: string;
}

interface TopNavbarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

const notifications: Notification[] = [
  { msg: "New order #1042 received", time: "2m ago" },
  { msg: "Low stock alert: Desk Lamp",  time: "1h ago" },
  { msg: "Customer refund request",     time: "3h ago" },
];

export default function TopNavbar({ onMenuClick, pageTitle }: TopNavbarProps) {
  const [notifOpen, setNotifOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 h-16 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Notifications
              </p>
              {notifications.map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <p className="text-sm text-gray-700">{n.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-semibold text-sm flex-shrink-0">
            JC
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">Jane Cooper</p>
            <p className="text-xs text-gray-400 mt-0.5">Super Admin</p>
          </div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}
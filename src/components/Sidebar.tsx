"use client";

import { useState } from "react";
import { LucideIcon, LayoutDashboard, Package, ShoppingCart, Users, X, Store, LogOut, Loader2 } from "lucide-react";
import { logoutApi } from "@/api/auth"
import { useRouter } from "next/navigation";

type PageKey = "dashboard" | "products" | "orders" | "customers";

interface NavItem {
  label: string;
  key: PageKey;
  icon: LucideIcon;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  onLogout?: () => void; // Optional callback for additional logout handling
}

const navItems: NavItem[] = [
  { label: "Dashboard", key: "dashboard", icon: LayoutDashboard },
  { label: "Products",  key: "products",  icon: Package },
  { label: "Orders",    key: "orders",    icon: ShoppingCart },
  { label: "Customers", key: "customers", icon: Users },
];

export default function Sidebar({ isOpen, onClose, activePage, setActivePage, onLogout }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNav = (key: PageKey): void => {
    setActivePage(key);
    onClose();
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API
      const response = await logoutApi();
      
      if (response.success) {
        // Call the optional onLogout callback if provided
        if (onLogout) {
          onLogout();
        }
        
        // Redirect to login page
        router.push("/login");
        router.refresh(); // Refresh to clear any cached data
      } else {
        console.error("Logout failed:", response.message);
        // Still redirect to login even if API fails (tokens are already removed)
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Still redirect to login on error
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">StoreAdmin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, key, icon: Icon }) => {
            const active = activePage === key;
            return (
              <button
                key={key}
                onClick={() => handleNav(key)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left
                  transition-all duration-150
                  ${active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Footer with Logout Button */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left
              text-red-600 hover:bg-red-50 hover:text-red-700
              transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Logout</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">StoreAdmin v1.0</p>
        </div>
      </aside>
    </>
  );
}
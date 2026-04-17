"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import Dashboard from "@/components/Pages/Dashboard";
import ProductManagement from "@/components/Pages/ProductManagement";
import Orders from "@/components/Pages/Orders";
import Customers from "@/components/Pages/Customers";

export type PageKey = "dashboard" | "products" | "orders" | "customers";

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: "Dashboard",
  products:  "Products",
  orders:    "Orders",
  customers: "Customers",
};

function renderPage(page: PageKey): React.ReactNode {
  switch (page) {
    case "dashboard": return <Dashboard />;
    case "products":  return <ProductManagement />;
    case "orders":    return <Orders />;
    case "customers": return <Customers />;
    default:          return <Dashboard />;
  }
}

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activePage, setActivePage]   = useState<PageKey>("dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNavbar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={PAGE_TITLES[activePage]}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage(activePage)}
        </main>
      </div>
    </div>
  );
}
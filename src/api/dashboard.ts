import axiosInstance from "./axiosInstance";

   //📊 TYPES

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  date: string;
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: string;
  pct: number;
}

export interface OrderStatusSummary {
  Delivered: number;
  Processing: number;
  Shipped: number;
  Cancelled: number;
}

   //📊 GET DASHBOARD STATS

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const res = await axiosInstance.get("/admin/dashboard/stats");
    return res.data;
  } catch (error: any) {
    console.error("Dashboard Stats Error:", error.response?.data || error.message);
    return null;
  }
};


   //📄 GET RECENT ORDERS

export const getRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const res = await axiosInstance.get("/admin/orders/recent", {
      params: { limit },
    });

    return res.data || [];
  } catch (error: any) {
    console.error("Recent Orders Error:", error.response?.data || error.message);
    return [];
  }
};


   //🏆 GET TOP PRODUCTS

export const getTopProducts = async (): Promise<TopProduct[]> => {
  try {
    const res = await axiosInstance.get("/admin/products/top");
    return res.data || [];
  } catch (error: any) {
    console.error("Top Products Error:", error.response?.data || error.message);
    return [];
  }
};

   //📦 ORDER STATUS SUMMARY

export const getOrderStatusSummary = async (): Promise<OrderStatusSummary | null> => {
  try {
    const res = await axiosInstance.get("/admin/orders/status-summary");
    return res.data;
  } catch (error: any) {
    console.error("Order Summary Error:", error.response?.data || error.message);
    return null;
  }
};
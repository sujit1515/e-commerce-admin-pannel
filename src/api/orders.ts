import axiosInstance from "./axiosInstance";

/* =========================
   📦 TYPES
========================= */
export interface AdminOrder {
  id: string;        // formatted "#ORD-XXXX" — display only
  displayId: string; // real MongoDB _id — used for getSingleOrderAdmin API call
  customer: string;
  email: string;
  items: number;
  amount: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  payment: string;
}

export interface OrderDetails {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    product: { name: string; price: number; images?: string[] };
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  address?: any;
  createdAt: string;
}


  // 📄 GET ALL ORDERS (ADMIN)

export const getAllOrdersAdmin = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{
  orders: AdminOrder[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const res = await axiosInstance.get("/order/admin/orders", { params });

    // Backend now returns displayId — map it through
    const orders: AdminOrder[] = (res.data.orders || []).map((o: any) => ({
      id:        o.id,
      displayId: o.displayId || o._id || "",  // real MongoDB _id from backend
      customer:  o.customer,
      email:     o.email,
      items:     o.items,
      amount:    o.amount,
      status:    o.status,
      date:      o.date,
      payment:   o.payment,
    }));

    return {
      orders,
      total:      res.data.total      || 0,
      page:       res.data.page       || 1,
      totalPages: res.data.totalPages || 1,
    };
  } catch (error: any) {
    console.error("Get Admin Orders Error:", error.response?.data || error.message);
    return { orders: [], total: 0, page: 1, totalPages: 1 };
  }
};


  // 🔍 GET SINGLE ORDER

export const getSingleOrderAdmin = async (
  orderId: string  // expects real MongoDB _id (displayId)
): Promise<OrderDetails | null> => {
  try {
    const res = await axiosInstance.get(`/order/admin/orders/${orderId}`);
    return res.data.order;
  } catch (error: any) {
    console.error("Get Single Order Error:", error.response?.data || error.message);
    return null;
  }
};


  // ✏️ UPDATE ORDER STATUS

export const updateOrderStatusAdmin = async (
  orderId: string,
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/order/admin/orders/${orderId}/status`, { status });
    return true;
  } catch (error: any) {
    console.error("Update Order Status Error:", error.response?.data || error.message);
    return false;
  }
};
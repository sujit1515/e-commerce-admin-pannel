// import axiosInstance from "./axiosInstance";

// // Types
// export interface AdminLoginResponse {
//   success: boolean;
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
// }

// export interface UsersResponse {
//   success: boolean;
//   users: any[];
// }

// export interface DashboardStatsResponse {
//   success: boolean;
//   stats: {
//     totalUsers: number;
//     totalAdmins: number;
//   };
// }

// // Types
// export interface LogoutResponse {
//   success: boolean;
//   message: string;
// }

 
// //LOGIN
// export const adminLogin = async (email: string, password: string) => {
//   try {
//     const res = await axiosInstance.post<AdminLoginResponse>(
//       "/auth/admin/login",
//       { email, password }
//     );

//     // Save token (optional)
//     localStorage.setItem("adminToken", res.data.token);

//     return res.data;
//   } catch (error: any) {
//     return error.response?.data || { success: false, message: "Login failed" };
//   }
// };

// //CREATE ADMIN
// export const createFirstAdmin = async () => {
//   try {
//     const res = await axiosInstance.post("/setup/admin");
//     return res.data;
//   } catch (error: any) {
//     return error.response?.data;
//   }
// };

// //GET ALL-USER
// export const getAllUsers = async () => {
//   try {
//     const token = localStorage.getItem("adminToken");

//     const res = await axiosInstance.get<UsersResponse>("/auth/admin/users", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return res.data;
//   } catch (error: any) {
//     return error.response?.data;
//   }
// };

// //GET DASHBOARD
// export const getDashboardStats = async () => {
//   try {
//     const token = localStorage.getItem("adminToken");

//     const res = await axiosInstance.get<DashboardStatsResponse>(
//       "/admin/dashboard",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return res.data;
//   } catch (error: any) {
//     return error.response?.data;
//   }
// };

// // LOGOUT API
// export const logoutApi = async (): Promise<LogoutResponse> => {
//   try {
//     const res = await axiosInstance.post<LogoutResponse>("/auth/logout");

//     // ✅ Remove both tokens (user + admin)
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminToken");

//     return res.data;
//   } catch (error: any) {
//     // Still remove token even if API fails (important)
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminToken");

//     return (
//       error.response?.data || {
//         success: false,
//         message: "Logout failed",
//       }
//     );
//   }
// };

import axiosInstance from "./axiosInstance";

// Types
export interface AdminLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UsersResponse {
  success: boolean;
  users: any[];
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: {
    totalUsers: number;
    totalAdmins: number;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// LOGIN
export const adminLogin = async (email: string, password: string) => {
  try {
    const res = await axiosInstance.post<AdminLoginResponse>(
      "/auth/admin/login",
      { email, password }
    );

    // Save token with correct key
    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
    }

    return res.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Login failed" };
  }
};

// CREATE ADMIN
export const createFirstAdmin = async () => {
  try {
    const res = await axiosInstance.post("/setup/admin");
    return res.data;
  } catch (error: any) {
    return error.response?.data;
  }
};

// GET ALL USERS (removed manual Authorization header)
export const getAllUsers = async () => {
  try {
    const res = await axiosInstance.get<UsersResponse>("/auth/admin/users");
    return res.data;
  } catch (error: any) {
    return error.response?.data;
  }
};

// GET DASHBOARD STATS (removed manual Authorization header)
export const getDashboardStats = async () => {
  try {
    const res = await axiosInstance.get<DashboardStatsResponse>("/admin/dashboard");
    return res.data;
  } catch (error: any) {
    return error.response?.data;
  }
};

// LOGOUT API
export const logoutApi = async (): Promise<LogoutResponse> => {
  try {
    const res = await axiosInstance.post<LogoutResponse>("/auth/logout");

    // Remove both tokens (user + admin)
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    return res.data;
  } catch (error: any) {
    // Still remove token even if API fails (important)
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    return (
      error.response?.data || {
        success: false,
        message: "Logout failed",
      }
    );
  }
};
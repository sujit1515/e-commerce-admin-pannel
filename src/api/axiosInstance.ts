import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ✅ REQUEST INTERCEPTOR — attaches token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Check for both user token and admin token
      const userToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      
      // Prioritize admin token for admin routes, otherwise use user token
      const token = adminToken || userToken;
      
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // For debugging - log which token is being used (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log(`Using ${adminToken ? "Admin" : userToken ? "User" : "No"} token for ${config.url}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR — handles token expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear both tokens
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
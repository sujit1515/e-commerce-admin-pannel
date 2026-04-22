// // import axiosInstance from "./axiosInstance";

// // // Product Types
// // export interface Product {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   category: string;
// //   stock: number;
// //   images: File[]
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // // Add Product
// // export const addProduct = async (
// //   productData: Omit<Product, "_id">
// // ): Promise<Product | null> => {
// //   try {
// //     const res = await axiosInstance.post("/product/add", productData);
// //     return res.data.product;
// //   } catch (error: any) {
// //     console.error(
// //       "Add Product Error:",
// //       error.response?.data || error.message
// //     );
// //     return null;
// //   }
// // };


// import axiosInstance from "./axiosInstance";

// /* =========================
//    📦 TYPES
// ========================= */
// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   sizes: string[];
//   colors: string[];
//   images: string[]; // backend returns URLs
//   createdAt?: string;
//   updatedAt?: string;
// }

// /* =========================
//    🔧 HELPER (FormData)
// ========================= */
// const buildFormData = (data: any) => {
//   const formData = new FormData();

//   Object.keys(data).forEach((key) => {
//     const value = data[key];

//     if (key === "images" && value) {
//       // multiple images
//       value.forEach((file: File) => {
//         formData.append("images", file);
//       });
//     } else if (Array.isArray(value)) {
//       // sizes, colors
//       value.forEach((item) => {
//         formData.append(key, item);
//       });
//     } else if (value !== undefined && value !== null) {
//       formData.append(key, value);
//     }
//   });

//   return formData;
// };

// /* =========================
//    ➕ ADD PRODUCT
// ========================= */
// export const addProduct = async (
//   productData: any
// ): Promise<Product | null> => {
//   try {
//     const formData = buildFormData(productData);

//     const res = await axiosInstance.post("/product/add", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data.product;
//   } catch (error: any) {
//     console.error(
//       "Add Product Error:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// };

// /* =========================
//    📄 GET ALL PRODUCTS
// ========================= */
// export const getAllProducts = async (params?: {
//   category?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   size?: string;
//   color?: string;
//   search?: string;
//   sortBy?: string;
//   sortOrder?: "asc" | "desc";
//   page?: number;
//   limit?: number;
// }) => {
//   try {
//     const res = await axiosInstance.get("/product", { params });

//     return {
//       products: res.data.products,
//       totalProducts: res.data.totalProducts,
//       currentPage: res.data.currentPage,
//       totalPages: res.data.totalPages,
//     };
//   } catch (error: any) {
//     console.error(
//       "Get Products Error:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// };

// /* =========================
//    🔍 GET SINGLE PRODUCT
// ========================= */
// export const getProductById = async (
//   id: string
// ): Promise<Product | null> => {
//   try {
//     const res = await axiosInstance.get(`/product/${id}`);
//     return res.data.product;
//   } catch (error: any) {
//     console.error(
//       "Get Product Error:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// };

// /* =========================
//    ✏️ UPDATE PRODUCT
// ========================= */
// export const updateProduct = async (
//   id: string,
//   productData: any
// ): Promise<Product | null> => {
//   try {
//     const formData = buildFormData(productData);

//     const res = await axiosInstance.put(`/product/${id}`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data.product;
//   } catch (error: any) {
//     console.error(
//       "Update Product Error:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// };

// /* =========================
//    ❌ DELETE PRODUCT
// ========================= */
// export const deleteProduct = async (id: string): Promise<boolean> => {
//   try {
//     await axiosInstance.delete(`/product/${id}`);
//     return true;
//   } catch (error: any) {
//     console.error(
//       "Delete Product Error:",
//       error.response?.data || error.message
//     );
//     return false;
//   }
// };

import axiosInstance from "./axiosInstance";

/* =========================
   📦 TYPES
========================= */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
   season?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================
   🔧 HELPER (FormData)
========================= */
const buildFormData = (data: any) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (key === "images" && value) {
      // multiple images
      if (Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("images", file);
        });
      }
    } else if (Array.isArray(value)) {
      // sizes, colors
      value.forEach((item) => {
        formData.append(key, item);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};

/* =========================
   ➕ ADD PRODUCT
========================= */
export const addProduct = async (productData: any): Promise<Product | null> => {
  try {
    // ✅ Just send JSON — images are already URLs at this point
    const res = await axiosInstance.post("/product/add", productData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.product;
  } catch (error: any) {
    console.error("Add Product Error:", error.response?.data || error.message);
    return null;
  }
};

/* =========================
   📄 GET ALL PRODUCTS
========================= */
export const getAllProducts = async (params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await axiosInstance.get("/product", { params });

    return {
      products: res.data.products || [],
      totalProducts: res.data.totalProducts || 0,
      currentPage: res.data.currentPage || 1,
      totalPages: res.data.totalPages || 1,
    };
  } catch (error: any) {
    console.error("Get Products Error:", error.response?.data || error.message);
    return {
      products: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 1,
    };
  }
};

/* =========================
   🔍 GET SINGLE PRODUCT
========================= */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const res = await axiosInstance.get(`/product/${id}`);
    return res.data.product;
  } catch (error: any) {
    console.error("Get Product Error:", error.response?.data || error.message);
    return null;
  }
};

/* =========================
   ✏️ UPDATE PRODUCT
========================= */
export const updateProduct = async (
  id: string,
  productData: any
): Promise<Product | null> => {
  try {
    const formData = buildFormData(productData);

    const res = await axiosInstance.put(`/product/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.product;
  } catch (error: any) {
    console.error("Update Product Error:", error.response?.data || error.message);
    return null;
  }
};

/* =========================
   ❌ DELETE PRODUCT
========================= */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/product/${id}`);
    return true;
  } catch (error: any) {
    console.error("Delete Product Error:", error.response?.data || error.message);
    return false;
  }
};
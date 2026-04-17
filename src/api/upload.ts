import axiosInstance from "./axiosInstance";

// Upload Image Response Type
export interface UploadResponse {
  success: boolean;
  imageUrl: string;
  public_id: string;
  message?: string;
}

// Upload Image Function
export const uploadImage = async (file: File): Promise<UploadResponse | null> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    // The interceptor will automatically add the token
    const res = await axiosInstance.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Upload Image Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    return {
      success: false,
      imageUrl: "",
      public_id: "",
      message: error.response?.data?.message || error.message || "Upload failed"
    };
  }
};
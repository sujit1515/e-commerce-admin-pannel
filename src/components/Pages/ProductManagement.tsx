"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  Search,
  Upload,
  Loader2,
} from "lucide-react";
import { addProduct, updateProduct, getAllProducts, deleteProduct, Product } from "@/api/product";
import { uploadImage } from "@/api/upload";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  sizes: string;
  colors: string;
}

const STATUS_STYLES: Record<StockStatus, string> = {
  "In Stock": "bg-green-50 text-green-600 border border-green-200",
  "Low Stock": "bg-yellow-50 text-yellow-600 border border-yellow-200",
  "Out of Stock": "bg-red-50 text-red-600 border border-red-200",
};

const ITEMS_PER_PAGE = 4;

function getStatus(stock: number): StockStatus {
  if (stock === 0) return "Out of Stock";
  if (stock < 15) return "Low Stock";
  return "In Stock";
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  sizes: "",
  colors: "",
};

// ✅ Reusable image component with no infinite loop
function ProductImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [broken, setBroken] = useState(false);

  if (broken || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Package className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)} // ✅ No infinite loop — just shows icon
    />
  );
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err: any) {
      console.error("Fetch products error:", err);
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = Array.isArray(products)
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const cleanupPreviews = (previews: string[]) => {
    previews.forEach((preview) => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    });
  };

  const openAdd = (): void => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setSelectedFiles([]);
    cleanupPreviews(imagePreviews);
    setImagePreviews([]);
    setShowModal(true);
  };

  const openEdit = (p: Product): void => {
    setEditProduct(p);
    setForm({
      name: p.name || "",
      description: p.description || "",
      category: p.category || "",
      price: String(p.price || 0),
      stock: String(p.stock || 0),
      sizes: p.sizes?.join(", ") || "",
      colors: p.colors?.join(", ") || "",
    });
    setSelectedFiles([]);
    setImagePreviews(p.images || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    cleanupPreviews(imagePreviews);
    setImagePreviews([]);
    setSelectedFiles([]);
    setEditProduct(null);
    setForm(EMPTY_FORM);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) alert(`${file.name} is not an image file`);
      if (!isValidSize) alert(`${file.name} exceeds 5MB limit`);
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // ✅ Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    if (imagePreviews[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // ✅ Only remove from selectedFiles if it's a newly added file (blob URL)
    if (imagePreviews[index]?.startsWith("blob:")) {
      // Find which blob index this is among blob previews
      const blobIndex = imagePreviews
        .slice(0, index + 1)
        .filter((p) => p.startsWith("blob:")).length - 1;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== blobIndex));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const result = await uploadImage(file);
      if (result && result.success && result.imageUrl) {
        uploadedUrls.push(result.imageUrl);
      } else {
        throw new Error(`Failed to upload image: ${file.name}`);
      }
    }
    return uploadedUrls;
  };

  const handleSave = async (): Promise<void> => {
    const stock = parseInt(form.stock) || 0;
    const price = parseFloat(form.price) || 0;

    if (!form.name || !form.description || !form.category || !form.price || !form.stock) {
      alert("Please fill in all required fields");
      return;
    }

    if (!editProduct && selectedFiles.length === 0) {
      alert("Please select at least one product image");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Please login again");
        return;
      }

      // ✅ Upload new images if any selected
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages(selectedFiles);
      } else if (editProduct && editProduct.images) {
        imageUrls = editProduct.images; // keep existing images
      }

      const productData = {
        name: form.name,
        description: form.description,
        category: form.category.toLowerCase(),
        price,
        stock,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
        images: imageUrls,
      };

      let result;

      if (editProduct) {
        // ✅ Update product
        result = await updateProduct(editProduct._id, productData);
        if (result) {
          alert("Product updated successfully!");
        } else {
          alert("Failed to update product");
          return;
        }
      } else {
        // ✅ Add new product
        result = await addProduct(productData);
        if (result) {
          alert("Product added successfully!");
        } else {
          alert("Failed to add product");
          return;
        }
      }

      closeModal();
      await fetchProducts();
      setPage(1);

    } catch (error: any) {
      console.error("Save Product Failed:", error);
      alert(error.message || "Failed to save product");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const success = await deleteProduct(id);
    if (success) {
      alert("Product deleted successfully!");
      await fetchProducts();
    } else {
      alert("Failed to delete product");
    }
    setDeleteId(null);
  };

  const updateForm = (key: keyof ProductForm, value: string): void => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const formFields: {
    label: string;
    key: keyof ProductForm;
    placeholder: string;
    type?: string;
    required?: boolean;
  }[] = [
    { label: "Product Name", key: "name", placeholder: "e.g. Premium Backpack", required: true },
    { label: "Description", key: "description", placeholder: "Detailed product description...", required: true },
    { label: "Category", key: "category", placeholder: "men, women, or kids", required: true },
    { label: "Price ($)", key: "price", placeholder: "0.00", type: "number", required: true },
    { label: "Stock (units)", key: "stock", placeholder: "0", type: "number", required: true },
    { label: "Sizes (comma-separated)", key: "sizes", placeholder: "S, M, L, XL" },
    { label: "Colors (comma-separated)", key: "colors", placeholder: "Black, White, Blue" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your inventory, pricing and stock status.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-95 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products by name, category, or description..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={fetchProducts} className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium">
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && !search ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-sm text-gray-500 mb-6">Get started by adding your first product to the inventory.</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Your First Product
          </button>
        </div>
      ) : (
        !loading && !error && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Product", "Description", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className={`text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-4 ${
                          h === "Product" ? "px-6" : h === "Actions" ? "px-6 text-right" : "px-4"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* ✅ Fixed image with no infinite loop */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <ProductImage
                              src={product.images?.[0] || ""}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{product.description}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{product.stock} units</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[getStatus(product.stock)]}`}>
                          {getStatus(product.stock)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(product._id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {paginated.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex gap-3">
                    {/* ✅ Fixed image with no infinite loop */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <ProductImage
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.category}</p>
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[getStatus(product.stock)]}`}>
                          {getStatus(product.stock)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <span className="font-semibold text-gray-700">${product.price.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-gray-500">{product.stock} units</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openEdit(product)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(product._id)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">{(page - 1) * ITEMS_PER_PAGE + 1}</span>
                  {" "}to{" "}
                  <span className="font-semibold text-gray-800">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span>
                  {" "}of{" "}
                  <span className="font-semibold text-gray-800">{filtered.length}</span> products
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        n === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-base font-bold text-gray-900">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {formFields.map(({ label, key, placeholder, type = "text", required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  {key === "description" ? (
                    <textarea
                      value={form[key]}
                      onChange={(e) => updateForm(key, e.target.value)}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    />
                  ) : (
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => updateForm(key, e.target.value)}
                      placeholder={placeholder}
                      step={key === "price" ? "0.01" : undefined}
                      min={key === "price" || key === "stock" ? "0" : undefined}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all"
                    />
                  )}
                </div>
              ))}

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Product Images {!editProduct && <span className="text-red-500">*</span>}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB each</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      {imagePreviews.length} image(s) selected
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {imagePreviews.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  uploading ||
                  !form.name ||
                  !form.description ||
                  !form.category ||
                  !form.price ||
                  !form.stock ||
                  (!editProduct && selectedFiles.length === 0)
                }
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editProduct ? "Updating..." : "Uploading Images..."}
                  </>
                ) : (
                  editProduct ? "Save Changes" : "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
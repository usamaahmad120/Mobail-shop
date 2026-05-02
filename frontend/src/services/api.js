// API Base URL
const API_BASE_URL = "http://127.0.0.1:8000/api";

// ✅ Get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ✅ Get all products (with optional category filter)
export const getProducts = async (categorySlug = null) => {
  try {
    const url = categorySlug
      ? `${API_BASE_URL}/products?category=${categorySlug}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ✅ Get single product by slug
export const getProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// ✅ Get homepage sections (newest, trending, men's fashion, etc.)
export const getHomeSections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/home`);
    if (!response.ok) throw new Error("Failed to fetch home sections");
    return await response.json();
  } catch (error) {
    console.error("Error fetching home sections:", error);
    throw error;
  }
};

// ✅ Format product data for consistency
export const formatProduct = (product) => ({
  ...product,
  img: product.image,
  category: product.category?.name || "Unknown",
  categorySlug: product.category?.slug || "",
});

export default {
  getCategories,
  getProducts,
  getProductBySlug,
  getHomeSections,
  formatProduct,
};

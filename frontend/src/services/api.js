const API_BASE_URL = "http://127.0.0.1:8000/api";

export const unwrapData = (payload) => payload?.data ?? payload;

export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return unwrapData(await response.json());
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProducts = async ({
  category = null,
  search = null,
  page = 1,
  perPage = 12,
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (category) params.set("category", category);
    if (search) params.set("search", search);

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return unwrapData(await response.json());
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getHomeSections = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/home`);
    if (!response.ok) throw new Error("Failed to fetch home sections");
    return unwrapData(await response.json());
  } catch (error) {
    console.error("Error fetching home sections:", error);
    throw error;
  }
};

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
  unwrapData,
};

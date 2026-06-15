import { resolveProductImage } from "../utils/productImage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export const unwrapData = (payload) => payload?.data ?? payload;

const requestJson = async (url, errorMessage) => {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(`${errorMessage}: expected JSON response`);
  }

  return response.json();
};

export const getCategories = async () => {
  return unwrapData(await requestJson(`${API_BASE_URL}/categories`, "Failed to fetch categories"));
};

export const getProducts = async ({
  category = null,
  search = null,
  page = 1,
  perPage = 12,
} = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (category) params.set("category", category);
  if (search) params.set("search", search);

  return await requestJson(`${API_BASE_URL}/products?${params.toString()}`, "Failed to fetch products");
};

export const getProductBySlug = async (slug) => {
  return unwrapData(await requestJson(`${API_BASE_URL}/products/${slug}`, "Failed to fetch product"));
};

export const getHomeSections = async () => {
  return unwrapData(await requestJson(`${API_BASE_URL}/products/home`, "Failed to fetch home sections"));
};

export const formatProduct = (product) => {
  const category = typeof product.category === "string" ? product.category : product.category?.name;
  const categorySlug = typeof product.category === "string" ? product.category : product.category?.slug;
  const image = resolveProductImage(product.image || product.img);

  return {
    ...product,
    image,
    img: image,
    category: category || "Unknown",
    categorySlug: categorySlug || "",
  };
};

export default {
  getCategories,
  getProducts,
  getProductBySlug,
  getHomeSections,
  formatProduct,
  unwrapData,
};

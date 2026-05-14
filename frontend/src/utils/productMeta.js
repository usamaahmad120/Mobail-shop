const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const getProductStock = (product) => {
  const stock = Number(product?.maxStock ?? product?.stock ?? 0);

  return Number.isFinite(stock) ? Math.max(stock, 0) : 0;
};

export const getRemainingStock = (product, cartQuantity = 0) => {
  const remaining = getProductStock(product) - Number(cartQuantity || 0);

  return Math.max(remaining, 0);
};

export const isProductInStock = (product) => getProductStock(product) > 0;

export const getStockStatus = (product) =>
  isProductInStock(product) ? "In Stock" : "Out of Stock";

export const getProductRating = (product) => {
  const rating = Number(product?.rating ?? 0);

  return Number.isFinite(rating) ? clamp(rating, 0, 5) : 0;
};

export const getReviewCount = (product) => {
  const count = Number(product?.review_count ?? product?.reviewCount ?? 0);

  return Number.isFinite(count) ? Math.max(Math.trunc(count), 0) : 0;
};

export const formatRating = (product) => {
  const rating = getProductRating(product);

  return rating > 0 ? rating.toFixed(1) : "No rating";
};

export const formatReviewCount = (product) => {
  const count = getReviewCount(product);

  if (count === 0) {
    return "No reviews";
  }

  return `${count} ${count === 1 ? "review" : "reviews"}`;
};

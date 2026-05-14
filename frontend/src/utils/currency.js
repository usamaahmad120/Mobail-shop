export const parsePrice = (price) => {
  if (typeof price === "number") {
    return price;
  }

  const numericPrice = parseFloat(String(price ?? "").replace(/[$Rs,\s]/g, ""));
  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

export const formatPrice = (price) => {
  const numericPrice = parsePrice(price);

  return `Rs ${numericPrice.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

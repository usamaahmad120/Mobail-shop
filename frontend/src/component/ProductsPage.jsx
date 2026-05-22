import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../store";
import {
  addToCart,
  selectCartItemQuantity,
} from "../store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../store/wishlistSlice";
import {
  FaHeart,
  FaEye,
  FaThList,
  FaThLarge,
  FaSync,
} from "react-icons/fa";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { TiHeartOutline } from "react-icons/ti";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { setSelectedProduct as setSelectedProductAction } from "../store/cartSlice";
import { formatPrice, parsePrice } from "../utils/currency";
import {
  formatRating,
  formatReviewCount,
  getProductRating,
  getProductStock,
  getRemainingStock,
  getStockStatus,
  isProductInStock,
} from "../utils/productMeta";
import { formatProduct } from "../services/api";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { category: categoryParam } = useParams(); // Get category from URL

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all"); // Always start with "all"
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange] = useState([0, 1000000]);

  // Debug: Log when filter changes
  useEffect(() => {
    console.log("🎯 Filter changed to:", filterCategory);
  }, [filterCategory]);

// SHOW ALL PRODUCTS FROM API
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/products?per_page=48"
      );

      const payload = await response.json();
      const data = payload.data || payload;
      
      console.log("✅ Fetched products from API:", data.length, "products");

      const formattedProducts = data.map(formatProduct);

      setProducts(formattedProducts);
      console.log("✅ Formatted products:", formattedProducts.length, "products");
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


// SHOW ALL UNIQUE CATEGORIES
const categories = [
  "all",
  ...new Set(
    products.map(
      (product) =>
        product.category
    )
  ),
];

// Debug: Log available categories
console.log("📂 Available categories:", categories);


// FILTER PRODUCTS BY CATEGORY
// const filteredProducts =
//   filterCategory === "all"
//     ? products
//     : products.filter(
//         (product) =>
//           product.category ===
//           filterCategory
//       );

  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    // Handle category from URL parameter (/category/:category)
    if (categoryParam) {
      console.log("📍 Category from URL:", categoryParam);
      setFilterCategory(categoryParam);
      return;
    }
    
    // Always reset to "all" when on main products page without category in URL
    if (location.pathname === "/products") {
      setFilterCategory("all");
      setSearchTerm("");
    }
    // Handle state-based category
    else if (location.state && location.state.category) {
      setFilterCategory(location.state.category);
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // Handle query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryQueryParam = queryParams.get("category");
    const searchParam = queryParams.get("search");
    
    if (categoryQueryParam) {
      setFilterCategory(categoryQueryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.pathname, location.search, location.state, categoryParam, navigate]);

  // Add to cart handler with toast
  const handleAddToCart = (product) => {
    if (!isProductInStock(product)) {
      toast.warning("Product is out of stock!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
      return;
    }

    setAddingToCart(product.id);
    const cartItems = store.getState().cart.items;
    const existingItem = cartItems.find((item) => String(item.id) === String(product.id));

    if (existingItem) {
      toast.warning("Product already in cart!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    } else {
      dispatch(addToCart(product));
      toast.success("Product added to cart!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    }

    setTimeout(() => setAddingToCart(null), 500);
  };

  // Toggle wishlist handler with toast
  const handleToggleWishlist = (product) => {
    setAddingToWishlist(product.id);
    const isInWishlist = selectIsInWishlist(store.getState(), product.id);

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.warning("💔 Removed from wishlist!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    } else {
      dispatch(addToWishlist(product));
      toast.success("❤️ Added to wishlist!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    }

    setTimeout(() => setAddingToWishlist(null), 300);
  };

  // Navigate to product detail/cart
  const handleEyeClick = (product) => {
    dispatch(setSelectedProductAction(product.id));
    navigate(`/cart`);
  };

  // Filter & sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        filterCategory === "all" ||
        product.category.toLowerCase() === filterCategory.toLowerCase() ||
        product.categorySlug.toLowerCase() === filterCategory.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const price = parsePrice(product.price);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      // Debug individual product
      if (!matchesCategory && filterCategory !== "all") {
        console.log(`❌ Product "${product.name}" filtered out:`, {
          productCategory: product.category,
          filterCategory: filterCategory,
          match: product.category.toLowerCase() === filterCategory.toLowerCase()
        });
      }
      
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parsePrice(a.price) - parsePrice(b.price);
        case "rating":
          return getProductRating(b) - getProductRating(a);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  console.log("🔍 Filter status:", {
    totalProducts: products.length,
    filterCategory,
    filteredCount: filteredProducts.length,
    categories: [...new Set(products.map(p => p.category))]
  });

  const renderStars = (rating = 5) =>
    [...Array(5)].map((_, i) =>
      i < Math.round(rating) ? (
        <IoIosStar key={i} className="text-yellow-400 text-sm" />
      ) : (
        <IoIosStarOutline key={i} className="text-gray-300 text-sm" />
      )
    );

  const ProductCard = ({ product, isListView = false }) => {
    const cartQuantity = useSelector((state) =>
      selectCartItemQuantity(state, product.id)
    );
    const isInWishlist = useSelector((state) =>
      selectIsInWishlist(state, product.id)
    );
    const isAddingToCart = addingToCart === product.id;
    const isAddingToWishlistState = addingToWishlist === product.id;
    const price = parsePrice(product.price);
    const originalPrice = product.discount_price ? parsePrice(product.discount_price) : price * 1.16;
    const remainingStock = getRemainingStock(product, cartQuantity);
    const inStock = isProductInStock(product, cartQuantity);
    const rating = getProductRating(product);

    if (isListView) {
      return (
        <div className="shop-card shop-card-hover p-4 sm:p-6 flex flex-col sm:flex-row gap-5 sm:gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={product.img || product.image}
              alt={product.name}
              className="w-full sm:w-32 h-44 sm:h-32 object-cover rounded-lg"
            />
            {cartQuantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartQuantity}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-2">
              <div className="min-w-0">
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`p-2 transition ${
                    isInWishlist
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  disabled={isAddingToWishlistState}
                >
                  {isAddingToWishlistState ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : isInWishlist ? (
                    <FaHeart />
                  ) : (
                    <TiHeartOutline />
                  )}
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-500 transition"
                  onClick={() => handleEyeClick(product)}
                >
                  <FaEye />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex">{renderStars(rating)}</div>
              <span className="text-sm text-gray-500">
                {formatRating(product)} · {formatReviewCount(product)}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="shop-price text-2xl">
                  {formatPrice(product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isAddingToCart || getProductStock(product) <= 0}
                className={`w-full md:w-auto px-6 py-2 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                  isAddingToCart
                    ? "bg-green-500 text-white"
                    : "shop-button-primary"
                }`}
              >
                {getProductStock(product) <= 0 ? "Out of Stock" : isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="shop-card shop-card-hover group overflow-hidden">
        <div className="relative">
          <img
            src={product.img || product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
          {cartQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
              {cartQuantity} in cart
            </div>
          )}
          <div className="absolute inset-0 bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => handleEyeClick(product)}
              className="shop-icon-button transition transform hover:scale-110"
            >
              <FaEye />
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#5C2EC0] transition">
            {product.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-sm text-gray-500">
              {formatRating(product)} · {formatReviewCount(product)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="shop-price text-xl">{formatPrice(product.price)}</span>
            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isAddingToCart || getProductStock(product) <= 0}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                isAddingToCart
                  ? "bg-green-500 text-white"
                  : "shop-button-primary"
              }`}
            >
              {getProductStock(product) <= 0 ? "Out of Stock" : isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => handleToggleWishlist(product)}
              disabled={isAddingToWishlistState}
              className={`p-2 border rounded-lg transition ${
                isInWishlist
                  ? "border-red-500 text-red-500 bg-red-50 hover:bg-red-100"
                  : "border-gray-300 hover:border-[#5C2EC0] hover:text-[#5C2EC0]"
              }`}
            >
              {isAddingToWishlistState ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : isInWishlist ? (
                <FaHeart />
              ) : (
                <TiHeartOutline />
              )}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className={inStock ? "text-green-600" : "text-red-600"}>
              {inStock ? "✓" : "!"} {getStockStatus(product, cartQuantity)}
            </span>
            <span className="text-gray-500">
              {remainingStock} left
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of premium electronics and accessories. Find everything you need.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5C2EC0]"></div>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <div className="shop-card p-4 sm:p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => {
                  console.log("📝 Category dropdown changed to:", e.target.value);
                  setFilterCategory(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 py-2 px-4 rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-[#5C2EC0] text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <FaThLarge className="mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 py-2 px-4 rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-[#5C2EC0] text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <FaThList className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid/List */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-4">No products found</p>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search term</p>
            {filterCategory !== "all" && (
              <button
                onClick={() => setFilterCategory("all")}
                className="bg-[#5C2EC0] text-white px-6 py-2 rounded-lg hover:bg-[#4a25a3] transition"
              >
                Show All Products
              </button>
            )}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isListView={viewMode === "list"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;

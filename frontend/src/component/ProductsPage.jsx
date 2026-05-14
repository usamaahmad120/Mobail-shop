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
  const [priceRange] = useState([0, 1000]);

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
        "http://127.0.0.1:8000/api/products"
      );

      const data = await response.json();
      
      console.log("✅ Fetched products from API:", data.length, "products");

      const formattedProducts = data.map(
        (product) => ({
          ...product,
          img: product.image,
          category:
            product.category?.name ||
            "Unknown",
        })
      );

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
    setAddingToCart(product.id);
    const cartItems = store.getState().cart.items;
    const existingItem = cartItems.find((item) => String(item.id) === String(product.id));

    dispatch(addToCart(product));
    toast.success(existingItem ? "Cart quantity increased!" : "Product added to cart!", {
      position: "top-right",
      autoClose: 1800,
      theme: "colored",
    });

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
        product.category.toLowerCase() === filterCategory.toLowerCase();
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
          return 0;
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
      i < rating ? (
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

    if (isListView) {
      return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 p-6 flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={product.img || product.image}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            {cartQuantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartQuantity}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
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
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">{renderStars(5)}</div>
              <span className="text-sm text-gray-500">(4.5)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#5C2EC0]">
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
                disabled={isAddingToCart}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-300 flex items-center gap-2 ${
                  isAddingToCart
                    ? "bg-green-500 text-white"
                    : "bg-[#5C2EC0] text-white hover:bg-[#4a25a3]"
                }`}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition duration-300 overflow-hidden">
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
              className="bg-[#5C2EC0] p-3 rounded-full hover:bg-white transition transform hover:scale-110"
            >
              <FaEye className="text-white hover:text-[#5C2EC0]" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#5C2EC0] transition">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">{renderStars(5)}</div>
            <span className="text-sm text-gray-500">(4.5)</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-[#5C2EC0]">{formatPrice(product.price)}</span>
            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isAddingToCart}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                isAddingToCart
                  ? "bg-green-500 text-white"
                  : "bg-[#5C2EC0] text-white hover:bg-[#4a25a3]"
              }`}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
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
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-green-600">✓ In Stock</span>
            <span className="text-gray-500">
              {(product.maxStock || 99) - (cartQuantity || 0)} left
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
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
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
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

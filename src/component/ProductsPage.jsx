import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../store";
import {
  addToCart,
  selectCartItemQuantity,
  setSelectedProduct,
} from "../store/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "../store/wishlistSlice";
import { products } from "../export";
import { latestProducts } from "../Latest";
import {
  FaHeart,
  FaEye,
  FaThList,
  FaThLarge,
} from "react-icons/fa";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { TiHeartOutline } from "react-icons/ti";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { setSelectedProduct as setSelectedProductAction } from "../store/cartSlice";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const allProducts = [...products, ...latestProducts];
  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];

  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
  }, []);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    if (pathSegments[1] === "category" && pathSegments[2]) {
      setFilterCategory(decodeURIComponent(pathSegments[2]));
    } else if (location.state && location.state.category) {
      setFilterCategory(location.state.category);
      navigate(location.pathname, { replace: true, state: {} });
    }

    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    if (categoryParam) setFilterCategory(categoryParam);

    const searchParam = queryParams.get("search");
    if (searchParam) setSearchTerm(searchParam);
  }, [location, navigate]);

  // Add to cart handler with toast
  const handleAddToCart = (product) => {
    setAddingToCart(product.id);
    const cartItems = store.getState().cart.items;
    const alreadyInCart = cartItems.some((item) => item.id === product.id);

    if (alreadyInCart) {
      toast.warning("⚠️ Product already in cart!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    } else {
      dispatch(addToCart(product));
      toast.success("🛒 Product added to cart!", {
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
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const price = parseFloat(product.price.replace(/[$Rs,]/g, ""));
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (
            parseFloat(a.price.replace(/[$Rs,]/g, "")) -
            parseFloat(b.price.replace(/[$Rs,]/g, ""))
          );
        case "rating":
          return 0;
        default:
          return a.name.localeCompare(b.name);
      }
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
    const price = parseFloat(product.price.replace(/[$Rs,]/g, ""));
    const originalPrice = price * 1.16;

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
                  {product.price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
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
            <span className="text-xl font-bold text-[#5C2EC0]">{product.price}</span>
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
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

        {/* Filters */}
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
              onChange={(e) => setFilterCategory(e.target.value)}
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

        {/* Product Grid/List */}
        <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}`}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isListView={viewMode === "list"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

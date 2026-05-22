import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { FaEye, FaHeart } from "react-icons/fa";
import { TiHeartOutline } from "react-icons/ti";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { formatPrice } from "../utils/currency";
import {
  formatRating,
  formatReviewCount,
  getProductRating,
  isProductInStock,
} from "../utils/productMeta";
import { formatProduct } from "../services/api";

const ProductCard = ({
  item,
  addingToCart,
  addingToWishlist,
  handleAddToCart,
  handleToggleWishlist,
  handleEyeClick,
}) => {
  const cartQuantity = useSelector((state) =>
    selectCartItemQuantity(state, item.id)
  );
  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, item.id)
  );
  const isAddingToCart = addingToCart === item.id;
  const isAddingToWishlistState = addingToWishlist === item.id;

  return (
    <div className="shop-card shop-card-hover group flex h-full flex-col justify-between gap-3 p-4 cursor-pointer relative overflow-hidden">
      <div className="flex gap-3 text-lg absolute top-4 left-1/2 -translate-x-1/2 z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition duration-300 justify-center items-center">
        <button className="shop-icon-button transition" onClick={() => handleEyeClick(item)}>
          <FaEye />
        </button>

        <button
          className={`shop-icon-button transition ${isInWishlist ? "bg-red-500 text-white hover:bg-red-600" : ""}`}
          onClick={() => handleToggleWishlist(item, isInWishlist)}
          disabled={isAddingToWishlistState}
        >
          {isAddingToWishlistState ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : isInWishlist ? (
            <FaHeart />
          ) : (
            <TiHeartOutline />
          )}
        </button>

        <button
          className={`shop-icon-button transition ${isAddingToCart ? "bg-green-500 text-white" : ""}`}
          onClick={() => handleAddToCart(item)}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <MdOutlineAddShoppingCart />
          )}
        </button>
      </div>

      {cartQuantity > 0 && (
        <div className="absolute top-3 right-3 bg-[#5C2EC0] text-white text-xs px-2 py-1 rounded-full z-20">
          {cartQuantity}
        </div>
      )}

      <img
        src={item.img || item.image}
        className="w-full h-44 sm:h-48 object-cover rounded-lg mb-4 mt-10 bg-slate-100"
        alt={item.name}
      />

      <p className="text-xs font-semibold uppercase text-slate-500">
        {item.category}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex items-start gap-1">
          {[...Array(5)].map((_, i) => (
            <IoIosStar
              key={i}
              className={`text-lg ${i < Math.round(getProductRating(item)) ? "text-yellow-400" : "text-slate-300"}`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-slate-500">
          {formatRating(item)}
        </span>
      </div>

      <h2 className="text-base font-semibold text-center text-slate-900 line-clamp-2">
        {item.name}
      </h2>
      <p className="text-xs text-slate-500">{formatReviewCount(item)}</p>
      <p className="shop-price text-xl mt-1">{formatPrice(item.price)}</p>
    </div>
  );
};

function ElectronicsShowcase() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const [showcaseProducts, setShowcaseProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchShowcaseProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/api/products/home");
        const payload = await response.json();
        const sections = payload.data || payload;
        const formattedProducts = (sections.electronics_showcase || []).map(formatProduct);

        setShowcaseProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching electronics showcase products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseProducts();
  }, []);

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
    const existingItem = cartItems.find((item) => String(item.id) === String(product.id));
    toast.dismiss();

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

  const handleToggleWishlist = (product, isInWishlist) => {
    setAddingToWishlist(product.id);
    toast.dismiss();

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.warning("Removed from wishlist!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist!", {
        position: "top-right",
        autoClose: 1800,
        theme: "colored",
      });
    }

    setTimeout(() => setAddingToWishlist(null), 300);
  };

  const handleEyeClick = (product) => {
    dispatch(setSelectedProduct(product.id));
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="w-full responsive-section py-[60px] sm:py-[80px] flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#502EC3]" />
      </div>
    );
  }

  if (showcaseProducts.length === 0) {
    return null;
  }

  return (
    <div
      id="electronics-showcase"
      className="w-full responsive-section py-[60px] sm:py-[80px] flex flex-col justify-center items-start gap-4 bg-gray-100"
    >
      <h1
        data-aos="zoom-in"
        data-aos-delay="300"
        className="responsive-heading font-semibold text-slate-950"
      >
        Electronics Showcase
      </h1>

      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mt-10"
      >
        {showcaseProducts.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            addingToCart={addingToCart}
            addingToWishlist={addingToWishlist}
            handleAddToCart={handleAddToCart}
            handleToggleWishlist={handleToggleWishlist}
            handleEyeClick={handleEyeClick}
          />
        ))}
      </div>

      <button
        onClick={() => navigate("/products")}
        className="shop-button-primary rounded-lg px-7 py-3 text-[18px] font-semibold mt-6"
      >
        View More
      </button>
    </div>
  );
}

export default ElectronicsShowcase;

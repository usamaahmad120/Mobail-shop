import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formatPrice } from "../utils/currency";
import { formatRating, formatReviewCount, isProductInStock } from "../utils/productMeta";
import { formatProduct } from "../services/api";

// 🔥 Separate component to fix React Hooks violation
const ProductCard = ({ item, addingToCart, addingToWishlist, handleAddToCart, handleToggleWishlist, handleEyeClick }) => {
  const cartQuantity = useSelector((state) =>
    selectCartItemQuantity(state, item.id)
  );

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, item.id)
  );

  const isAddingToCart = addingToCart === item.id;
  const isAddingToWishlistState = addingToWishlist === item.id;

  return (
    <div className="px-3">
      <div className="shop-card shop-card-hover group flex h-full flex-col justify-between gap-3 p-4 cursor-pointer relative overflow-hidden">
        {/* Icons */}
        <div className="flex gap-3 text-lg absolute top-4 left-1/2 -translate-x-1/2 z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition duration-300 justify-center items-center">
          {/* 👁️ View Button */}
          <div
            className="shop-icon-button cursor-pointer transition"
            onClick={() => handleEyeClick(item)}
          >
            <FaEye />
          </div>

          {/* ❤️ Wishlist Button */}
          <div
            className={`shop-icon-button cursor-pointer transition ${
              isInWishlist
                ? "bg-red-500 text-white hover:bg-red-600"
                : ""
            }`}
            onClick={() => handleToggleWishlist(item, isInWishlist)}
          >
            {isAddingToWishlistState ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : isInWishlist ? (
              <FaHeart />
            ) : (
              <TiHeartOutline />
            )}
          </div>

          {/* 🛒 Cart Button */}
          <div
            className={`shop-icon-button cursor-pointer transition ${
              isAddingToCart
                ? "bg-green-500 text-white"
                : ""
            }`}
            onClick={() => handleAddToCart(item)}
          >
            {isAddingToCart ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <MdOutlineAddShoppingCart />
            )}
          </div>
        </div>

        {/* Cart Quantity Badge */}
        {cartQuantity > 0 && (
          <div className="absolute top-3 right-3 bg-[#5C2EC0] text-white text-xs px-2 py-1 rounded-full z-20">
            {cartQuantity}
          </div>
        )}

        {/* Wishlist Badge */}
        {isInWishlist && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20">
            ❤️
          </div>
        )}

        {/* Product Image */}
        <img
          src={item.img || item.image}
          className="w-full h-44 sm:h-48 object-cover rounded-lg mb-3 mt-10 bg-slate-100"
          alt={item.name}
        />

        <h1 className="text-slate-500 text-sm font-semibold uppercase">
          {item.category}
        </h1>

        <p className="text-base font-semibold text-slate-900 line-clamp-2 min-h-12">
          {item.name}
        </p>

        <p className="text-xs text-slate-500">
          {formatRating(item)} · {formatReviewCount(item)}
        </p>

        <h1 className="shop-price text-xl mt-1">
          {formatPrice(item.price)}
        </h1>
      </div>
    </div>
  );
};

function Latest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [latestProducts, setLatestProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 500,
      easing: "ease-in-out",
    });
  }, []);

  // API CALL FOR NEWEST PRODUCTS
  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/products/home")

        const payload = await response.json();
        const data = payload.data || payload;

        const formattedProducts = data.newest.map(formatProduct);

        setLatestProducts(formattedProducts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNewestProducts();
  }, []);

  // 🛒 Add to Cart with Toasts
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

    setTimeout(() => {
      setAddingToCart(null);
    }, 500);
  };

  // ❤️ Wishlist toggle with Toasts
  const handleToggleWishlist = (product, isInWishlist) => {
    setAddingToWishlist(product.id);

    toast.dismiss();

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

    setTimeout(() => {
      setAddingToWishlist(null);
    }, 300);
  };

  const handleEyeClick = (product) => {
    dispatch(setSelectedProduct(product.id));
    navigate("/cart");
    window.scrollTo(0, 0);
  };

  const settings = {
    dots: true,
    infinite: latestProducts.length > 5, // Only infinite if more than 5 products
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, infinite: latestProducts.length > 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, infinite: latestProducts.length > 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, infinite: latestProducts.length > 1 } },
    ],
  };

  // Don't show section if no products
  if (latestProducts.length === 0) {
    return null;
  }

  return (
    <div id="latest" className="w-full responsive-section py-[60px] sm:py-[80px] bg-gray-100">
      <h1
        data-aos="zoom-in"
        data-aos-delay="300"
        className="responsive-heading font-semibold text-slate-950 text-start"
      >
        Newest Products
      </h1>

      <div data-aos="fade-up" data-aos-delay="300" className="mt-10">
        {latestProducts.length > 5 ? (
          <Slider {...settings}>
            {latestProducts.map((item) => (
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
          </Slider>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {latestProducts.map((item) => (
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
        )}
      </div>
    </div>
  );
}

export default Latest;

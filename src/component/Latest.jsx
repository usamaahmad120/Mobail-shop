import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { latestProducts } from "../Latest";
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

import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Latest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
  }, []);

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    dispatch(addToCart(product));

    // Show loading state for better UX
    setTimeout(() => {
      setAddingToCart(null);
    }, 500);
  };

  const handleToggleWishlist = async (product, isInWishlist) => {
    setAddingToWishlist(product.id);

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }

    setTimeout(() => {
      setAddingToWishlist(null);
    }, 300);
  };

  const handleEyeClick = (product) => {
    dispatch(setSelectedProduct(product.id));
    navigate("/cart");
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div id="latest" className="w-full lg:px-20 px-5 py-[80px] bg-gray-100">
      {/* <h1
        data-aos="zoom-in"
        data-aos-delay="200"
        className="text-xl font-semibold text-[#502EC3] text-center"
      >
        Latest Arrivals
      </h1> */}
      <h1
        data-aos="zoom-in"
        data-aos-delay="300"
        className="text-[42px] leading-[50px] font-semibold text-black text-start"
      >
        Newest Products
      </h1>

      <div data-aos="fade-up" data-aos-delay="300" className="mt-10">
        <Slider {...settings}>
          {latestProducts.map((item, index) => {
            const cartQuantity = useSelector((state) =>
              selectCartItemQuantity(state, item.id)
            );
            const isInWishlist = useSelector((state) =>
              selectIsInWishlist(state, item.id)
            );
            const isAddingToCart = addingToCart === item.id;
            const isAddingToWishlistState = addingToWishlist === item.id;

            return (
              <div key={index} className="px-3">
                <div className="group flex flex-col justify-center items-center gap-2 bg-white p-4 rounded-lg cursor-pointer relative shadow hover:shadow-lg transition duration-300">
                  <div className="flex gap-4 text-xl text-[#502EC3] absolute top-4 z-10 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition duration-300 justify-center items-center">
                    <div
                      className="bg-[#502EC3] hover:bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full text-white cursor-pointer transition"
                      onClick={() => handleEyeClick(item)}
                    >
                      <FaEye />
                    </div>
                    <div
                      className={`w-10 h-10 flex justify-center items-center rounded-full cursor-pointer transition ${
                        isInWishlist
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-[#502EC3] text-white hover:bg-yellow-400"
                      }`}
                      onClick={() => handleToggleWishlist(item, isInWishlist)}
                      disabled={isAddingToWishlistState}
                    >
                      {isAddingToWishlistState ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : isInWishlist ? (
                        <FaHeart />
                      ) : (
                        <TiHeartOutline />
                      )}
                    </div>
                    <div
                      className={`w-10 h-10 flex justify-center items-center rounded-full text-white cursor-pointer transition ${
                        isAddingToCart
                          ? "bg-green-500"
                          : "bg-[#502EC3] hover:bg-yellow-400"
                      }`}
                      onClick={() => handleAddToCart(item)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <MdOutlineAddShoppingCart />
                      )}
                    </div>
                  </div>

                  {/* Cart quantity badge */}
                  {cartQuantity > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20">
                      {cartQuantity}
                    </div>
                  )}

                  {/* Wishlist badge */}
                  {isInWishlist && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-20">
                      ❤️
                    </div>
                  )}

                  <img
                    src={item.img}
                    className="w-full h-48 object-cover rounded-md mb-4 mt-10"
                    alt={item.name}
                  />
                  <h1 className="text-gray-400 text-lg font-semibold">
                    {item.category}
                  </h1>
                  <p className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </p>
                  <h1 className="text-xl font-bold text-[#502EC3] mt-2">
                    {item.price}
                  </h1>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}

export default Latest;

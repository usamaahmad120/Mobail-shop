import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from "../store/wishlistSlice";
import { addToCart, selectCartItems } from "../store/cartSlice";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { formatPrice } from "../utils/currency";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success("Removed from wishlist!", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => String(item.id) === String(product.id));

    dispatch(addToCart(product));
    toast.success(existingItem ? "Cart quantity increased!" : "Added to cart!", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const getCartQuantity = (productId) => {
    const item = cartItems.find((cartItem) => String(cartItem.id) === String(productId));
    return item ? item.quantity : 0;
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      dispatch(clearWishlist());
      toast.info("Wishlist cleared!", {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <ToastContainer />
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">My Wishlist</h1>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-[#5C2EC0] text-white px-6 py-3 rounded-lg hover:bg-[#4a25a3] transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <button
            onClick={handleClearAll}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <FaTrash /> Clear All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-6">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const cartQuantity = getCartQuantity(item.id);

              return (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:shadow-lg transition relative"
              >
                {cartQuantity > 0 && (
                  <span className="absolute top-3 right-3 bg-[#5C2EC0] text-white text-xs px-2 py-1 rounded-full">
                    {cartQuantity} in cart
                  </span>
                )}
                <img
                  src={item.image || item.img}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xl font-bold text-[#5C2EC0] mb-4">
                  {formatPrice(item.price)}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 bg-[#5C2EC0] text-white py-2 rounded-lg hover:bg-[#4a25a3] transition flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> {cartQuantity > 0 ? "Add More" : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/products")}
            className="text-[#5C2EC0] hover:underline"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;

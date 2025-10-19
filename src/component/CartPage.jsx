import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../store';
import {
  addToCart,
  selectCartItemQuantity,
  loadCartFromStorage,
  selectSelectedProductId
} from '../store/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
  loadWishlistFromStorage
} from '../store/wishlistSlice';
import { products } from '../export';
import { latestProducts } from '../Latest';
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';
import { TiHeartOutline } from "react-icons/ti";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const selectedProductId = useSelector(selectSelectedProductId);

  // Combine all products
  const allProducts = [...products, ...latestProducts];
  
  // Filter to show only the selected product if a product ID is set
  const productsToShow = selectedProductId
    ? allProducts.filter(product => product.id === selectedProductId)
    : allProducts;

  useEffect(() => {
    dispatch(loadCartFromStorage());
    dispatch(loadWishlistFromStorage());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    setAddingToCart(product.id);

    const cartItems = store.getState().cart.items;
    const isAlreadyInCart = cartItems.some(item => item.id === product.id);

    if (isAlreadyInCart) {
      toast.warning('⚠️ Product already in cart!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    } else {
      dispatch(addToCart(product));
      toast.success('🛒 Product added to cart!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    }

    setTimeout(() => setAddingToCart(null), 500);
  };

  const handleToggleWishlist = (product) => {
    setAddingToWishlist(product.id);
    const isInWishlist = selectIsInWishlist(store.getState(), product.id);

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.warning('💔 Removed from wishlist!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    } else {
      dispatch(addToWishlist(product));
      toast.success('❤️ Added to wishlist!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    }

    setTimeout(() => setAddingToWishlist(null), 300);
  };

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      <IoIosStar key={i} className="text-yellow-400 text-sm" />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedProductId ? "Product Details" : "All Products"}
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedProductId ? "View details and add to cart" : "Browse our complete collection and add to cart"}
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 border border-[#5C2EC0] text-[#5C2EC0] rounded-lg hover:bg-[#5C2EC0] hover:text-white transition duration-300"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {productsToShow.map((product) => {
            const cartQuantity = useSelector(state => selectCartItemQuantity(state, product.id));
            const isInWishlist = useSelector(state => selectIsInWishlist(state, product.id));
            const isAddingToCart = addingToCart === product.id;
            const isAddingToWishlistState = addingToWishlist === product.id;
            const price = parseFloat(product.price.replace(/[$Rs,]/g, ''));
            const originalPrice = price * 1.16;

            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                    <img
                      src={product.img || product.image}
                      alt={product.name}
                      className="w-full max-w-[200px] h-48 object-cover rounded-lg"
                    />
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">14% OFF</span>
                      {cartQuantity > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{cartQuantity} in cart</span>
                      )}
                    </div>
                    {isInWishlist && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        ❤️ Favorited
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{renderStars(5)}</div>
                      <span className="text-sm text-gray-500">(4.5)</span>
                      <span className="text-sm text-gray-500">• 127 reviews</span>
                    </div>

                    {/* Price & Savings */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
                      <span className="text-2xl sm:text-3xl font-bold text-[#5C2EC0]">{product.price}</span>
                      <span className="text-lg sm:text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                      <span className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-semibold">
                        Save ${(originalPrice - price).toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isAddingToCart}
                        className={`w-full sm:flex-1 sm:max-w-xs py-3 px-4 sm:px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                          isAddingToCart ? 'bg-green-500 text-white' : 'bg-[#5C2EC0] text-white hover:bg-[#4a25a3]'
                        }`}
                      >
                        {isAddingToCart ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Adding to Cart...
                          </>
                        ) : (
                          <>
                            <FaShoppingCart /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleToggleWishlist(product)}
                        disabled={isAddingToWishlistState}
                        className={`p-3 border rounded-lg transition duration-300 ${
                          isInWishlist ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' : 'border-gray-300 hover:border-[#5C2EC0] hover:text-[#5C2EC0]'
                        }`}
                      >
                        {isAddingToWishlistState ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        ) : (
                          isInWishlist ? <FaHeart /> : <TiHeartOutline />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

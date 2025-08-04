import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeFromCart, 
  increaseQty, 
  decreaseQty, 
  clearCart,
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalAmount,
  loadCartFromStorage
} from '../store/cartSlice';
import { FaTrash, FaShoppingCart, FaArrowLeft, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { MdAdd, MdRemove } from 'react-icons/md';
import { IoIosStar } from 'react-icons/io';

const ShoppingCartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const totalAmount = useSelector(selectCartTotalAmount);

  useEffect(() => {
    // Load cart from localStorage on component mount
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQty = (productId) => {
    dispatch(increaseQty(productId));
  };

  const handleDecreaseQty = (productId) => {
    dispatch(decreaseQty(productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const calculateItemTotal = (price, quantity) => {
    const numericPrice = parseFloat(price.replace(/[$Rs,]/g, ''));
    return (numericPrice * quantity).toFixed(2);
  };

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      <IoIosStar key={i} className="text-yellow-400 text-sm" />
    ));
  };

  const calculateSavings = () => {
    return (totalAmount * 0.14).toFixed(2); // 14% savings
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaShoppingCart className="text-6xl text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Shopping Cart is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.history.back()}
                className="bg-[#5C2EC0] text-white px-8 py-3 rounded-lg hover:bg-[#4a25a3] transition duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <FaArrowLeft />
                Continue Shopping
              </button>
              <button className="border border-[#5C2EC0] text-[#5C2EC0] px-8 py-3 rounded-lg hover:bg-[#5C2EC0] hover:text-white transition duration-300 font-semibold">
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-700 flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition duration-300"
            >
              <FaTrash />
              Clear Cart
            </button>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 border border-[#5C2EC0] text-[#5C2EC0] rounded-lg hover:bg-[#5C2EC0] hover:text-white transition duration-300"
            >
              <FaArrowLeft />
              Continue Shopping
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-300">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {renderStars(5)}
                          </div>
                          <span className="text-sm text-gray-500">(4.5)</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-[#5C2EC0]">{item.price}</span>
                          <span className="text-sm text-gray-400 line-through">
                            ${(parseFloat(item.price.replace(/[$Rs,]/g, '')) * 1.16).toFixed(2)}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            14% OFF
                          </span>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-4 text-sm mb-4">
                          <span className="text-green-600 flex items-center gap-1">
                            ✓ In Stock
                          </span>
                          <span className="text-gray-500">
                            {item.maxStock - item.quantity} left
                          </span>
                          <span className="text-blue-600">
                            🚚 Free shipping
                          </span>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col items-end gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleDecreaseQty(item.id)}
                            className="p-3 hover:bg-gray-100 transition duration-200 rounded-l-lg"
                            disabled={item.quantity <= 1}
                          >
                            <MdRemove className="text-gray-600" />
                          </button>
                          <span className="px-6 py-3 font-semibold min-w-[4rem] text-center border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQty(item.id)}
                            className="p-3 hover:bg-gray-100 transition duration-200 rounded-r-lg"
                            disabled={item.quantity >= item.maxStock}
                          >
                            <MdAdd className="text-gray-600" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-2xl font-bold text-gray-800">
                            ${calculateItemTotal(item.price, item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm"
                        >
                          <FaTrash />
                          Remove
                        </button>

                        {/* Max Stock Warning */}
                        {item.quantity >= item.maxStock && (
                          <p className="text-xs text-orange-500 text-right">
                            Maximum quantity reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span>Savings (14% off)</span>
                  <span className="font-semibold">-${calculateSavings()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (estimated)</span>
                  <span className="font-semibold">${(totalAmount * 0.08).toFixed(2)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#5C2EC0]">${(totalAmount * 1.08).toFixed(2)}</span>
                </div>
                
                <p className="text-sm text-green-600 text-center font-semibold">
                  You saved ${calculateSavings()} on this order!
                </p>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-[#5C2EC0] text-white py-4 rounded-lg hover:bg-[#4a25a3] transition duration-300 font-semibold text-lg">
                  Proceed to Checkout
                </button>
                
                <button className="w-full bg-yellow-400 text-gray-800 py-3 rounded-lg hover:bg-yellow-500 transition duration-300 font-semibold">
                  Pay with PayPal
                </button>

                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition duration-300 font-semibold">
                  Buy with Apple Pay
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-green-500" />
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaTruck className="text-blue-500" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaUndo className="text-purple-500" />
                  <span>30-day return policy</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-3">Have a promo code?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for you</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-center">
              Based on your cart items, we recommend these products to complete your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
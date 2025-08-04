import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart,
  selectCartItemQuantity,
} from '../store/cartSlice';
import { 
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../store/wishlistSlice';
import { FaTimes, FaHeart, FaShoppingCart, FaShare, FaExpand } from 'react-icons/fa';
import { TiHeartOutline } from "react-icons/ti";
import { IoIosStar } from 'react-icons/io';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const cartQuantity = useSelector(state => selectCartItemQuantity(state, product?.id));
  const isInWishlist = useSelector(state => selectIsInWishlist(state, product?.id));

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    dispatch(addToCart(product));
    
    setTimeout(() => {
      setAddingToCart(false);
    }, 500);
  };

  const handleToggleWishlist = async () => {
    setAddingToWishlist(true);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
    
    setTimeout(() => {
      setAddingToWishlist(false);
    }, 300);
  };

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      <IoIosStar key={i} className="text-yellow-400 text-lg" />
    ));
  };

  const price = parseFloat(product.price.replace(/[$Rs,]/g, ''));
  const originalPrice = price * 1.16; // Assuming 14% discount

  // Mock additional images (in real app, these would come from product data)
  const productImages = [
    product.img || product.image,
    product.img || product.image,
    product.img || product.image,
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">14% OFF</span>
                  <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">Best Seller</span>
                </div>

                {/* Wishlist Badge */}
                {isInWishlist && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                    ❤️ Favorited
                  </div>
                )}

                {/* Expand Icon */}
                <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                  <FaExpand className="text-gray-600" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index 
                        ? 'border-[#5C2EC0]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Category */}
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                {product.category}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {renderStars(5)}
                </div>
                <span className="text-gray-600">(4.5)</span>
                <span className="text-gray-500">• 127 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-[#5C2EC0]">{product.price}</span>
                <span className="text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-2 rounded-full font-semibold">
                  Save ${(originalPrice - price).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  Premium quality {product.category.toLowerCase()} with advanced features and exceptional performance. 
                  Designed for durability and style, this product offers excellent value for money with cutting-edge technology 
                  and user-friendly design. Perfect for both professional and personal use.
                </p>
                <ul className="text-gray-600 space-y-1">
                  <li>• High-quality materials and construction</li>
                  <li>• Advanced technology integration</li>
                  <li>• User-friendly design and interface</li>
                  <li>• Excellent performance and reliability</li>
                  <li>• Comprehensive warranty coverage</li>
                </ul>
              </div>

              {/* Stock and Shipping Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-green-600 font-semibold">✓ In Stock</div>
                  <div className="text-sm text-gray-500">
                    {(product.maxStock || 99) - (cartQuantity || 0)} items left
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-semibold">🚚 Free Shipping</div>
                  <div className="text-sm text-gray-500">2-3 business days</div>
                </div>
              </div>

              {/* Cart Quantity Display */}
              {cartQuantity > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-semibold">
                      {cartQuantity} item{cartQuantity !== 1 ? 's' : ''} in your cart
                    </span>
                    <span className="text-blue-600 text-sm">
                      Total: ${(price * cartQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className={`flex-1 py-4 px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-3 ${
                    addingToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-[#5C2EC0] text-white hover:bg-[#4a25a3]'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart />
                      Add to Cart
                    </>
                  )}
                </button>

                <button 
                  onClick={handleToggleWishlist}
                  disabled={addingToWishlist}
                  className={`p-4 border rounded-lg transition duration-300 ${
                    isInWishlist 
                      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'border-gray-300 hover:border-[#5C2EC0] hover:text-[#5C2EC0]'
                  }`}
                >
                  {addingToWishlist ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  ) : (
                    isInWishlist ? <FaHeart /> : <TiHeartOutline />
                  )}
                </button>

                <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition duration-300">
                  <FaShare />
                </button>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800">🔒 Secure</div>
                  <div className="text-gray-600">SSL Protected</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800">↩️ Returns</div>
                  <div className="text-gray-600">30-day policy</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800">🛡️ Warranty</div>
                  <div className="text-gray-600">1-year coverage</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
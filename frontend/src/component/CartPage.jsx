import React, { useEffect, useState, useCallback } from 'react';
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
import { FaHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { IoIosStar } from 'react-icons/io';
import { TiHeartOutline } from "react-icons/ti";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatPrice, parsePrice } from '../utils/currency';
import {
  formatRating,
  formatReviewCount,
  getProductRating,
  getRemainingStock,
  getStockStatus,
  isProductInStock,
} from '../utils/productMeta';

const renderStars = (rating = 0) => {
  return [...Array(5)].map((_, i) => (
    <IoIosStar
      key={i}
      className={`text-sm ${i < Math.round(rating) ? "text-yellow-400" : "text-slate-300"}`}
    />
  ));
};

const CartProductItem = ({ product, onAddToCart, onToggleWishlist, addingToCart, addingToWishlist }) => {
  const cartQuantity = useSelector(state => selectCartItemQuantity(state, product.id));
  const isInWishlist = useSelector(state => selectIsInWishlist(state, product.id));
  const isAddingToCart = addingToCart === product.id;
  const isAddingToWishlistState = addingToWishlist === product.id;
  const price = parsePrice(product.price);
  const originalPrice = price * 1.16;
  const rating = getProductRating(product);
  const remainingStock = getRemainingStock(product, cartQuantity);
  const inStock = isProductInStock(product, cartQuantity);

  return (
    <div className="shop-card shop-card-hover transition duration-300 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-shrink-0 mx-auto md:mx-0 relative">
          <img
            src={product.img || product.image}
            alt={product.name}
            className="w-full max-w-[200px] h-48 object-cover rounded-lg"
          />
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

        <div className="flex-1 flex flex-col justify-between">
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{renderStars(rating)}</div>
            <span className="text-sm text-gray-500">{formatRating(product)}</span>
            <span className="text-sm text-gray-500">• {formatReviewCount(product)}</span>
          </div>

          <p className={`mb-4 text-sm font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}>
            {getStockStatus(product, cartQuantity)} · {remainingStock} left
          </p>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
            <span className="shop-price text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
            <span className="text-lg sm:text-xl text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            <span className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-semibold">
              Save {formatPrice(originalPrice - price)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full">
            <button
              onClick={() => onAddToCart(product)}
              disabled={isAddingToCart || !inStock}
              className={`w-full sm:flex-1 sm:max-w-xs py-3 px-4 sm:px-6 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2 ${
                isAddingToCart ? 'bg-green-500 text-white' : 'shop-button-primary'
              }`}
            >
              {!inStock ? (
                <>
                  <FaShoppingCart /> Out of Stock
                </>
              ) : isAddingToCart ? (
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
              onClick={() => onToggleWishlist(product)}
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
};

const CartPage = () => {
  const dispatch = useDispatch();
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const selectedProductId = useSelector(selectSelectedProductId);

 const [allProducts, setAllProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products?per_page=48");
      const payload = await response.json();
      const data = payload.data || payload;

      const formattedProducts = data.map((product) => ({
        ...product,
        img: product.image,
        category: product.category?.name || "Unknown",
      }));

      setAllProducts(formattedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  fetchProducts();
}, []);
  
  const productsToShow = selectedProductId
  ? allProducts.filter(
      product => String(product.id) === String(selectedProductId)
    )
  : allProducts;

  useEffect(() => {
    dispatch(loadCartFromStorage());
    dispatch(loadWishlistFromStorage());
  }, [dispatch]);

  const handleAddToCart = useCallback((product) => {
    if (!isProductInStock(product)) {
      toast.warning('Product is out of stock!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
      return;
    }

    setAddingToCart(product.id);

    const cartItems = store.getState().cart.items;
    const existingItem = cartItems.find(item => String(item.id) === String(product.id));

    if (existingItem) {
      toast.warning('Product already in cart!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    } else {
      dispatch(addToCart(product));
      toast.success('Product added to cart!', { position: 'top-right', autoClose: 1800, theme: 'colored' });
    }

    setTimeout(() => setAddingToCart(null), 500);
  }, [dispatch]);

  const handleToggleWishlist = useCallback((product) => {
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
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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
            className="shop-button-secondary flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        <div className="space-y-6">
          {productsToShow.map((product) => (
            <CartProductItem 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              addingToCart={addingToCart}
              addingToWishlist={addingToWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;

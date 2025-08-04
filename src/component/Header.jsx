import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { selectCartTotalItems, selectCartItems, toggleCart, selectIsCartOpen, removeFromCart, increaseQty, decreaseQty, addToCart, selectCartItemQuantity } from "../store/cartSlice";
import { selectWishlistTotalItems, selectWishlistItems, addToWishlist, removeFromWishlist, selectIsInWishlist } from "../store/wishlistSlice";
import { products } from "../export";
import { latestProducts } from "../Latest";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  
  const cartTotalItems = useSelector(selectCartTotalItems);
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const wishlistTotalItems = useSelector(selectWishlistTotalItems);
  const wishlistItems = useSelector(selectWishlistItems);

  // Combine all products for cart dropdown
  const allProducts = [...products, ...latestProducts];

  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleWishlist = () => setShowWishlist(!showWishlist);
  const handleToggleCart = () => dispatch(toggleCart());

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncreaseQty = (productId) => {
    dispatch(increaseQty(productId));
  };

  const handleDecreaseQty = (productId) => {
    dispatch(decreaseQty(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[$Rs,]/g, ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

// Close search input, wishlist and cart on scroll
useEffect(() => {
  const handleScroll = () => {
    if (showSearch) {
      setShowSearch(false);
    }
    if (showWishlist) {
      setShowWishlist(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [showSearch, showWishlist]);

// Close cart and wishlist when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (isCartOpen && !event.target.closest('.cart-dropdown') && !event.target.closest('.cart-icon')) {
      dispatch(toggleCart());
    }
    if (showWishlist && !event.target.closest('.wishlist-dropdown') && !event.target.closest('.wishlist-icon')) {
      setShowWishlist(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [isCartOpen, showWishlist, dispatch]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f6f8] shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-bold italic text-[#5C2EC0] underline decoration-[#5C2EC0] hover:text-[#4a25a3] transition duration-300">
          Electra Shop
        </Link>

        {/* Hamburger for mobile */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
          <FaBars />
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">HOME</Link>
          <Link to="/products" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">PRODUCTS</Link>
          <a href="#about" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">ABOUT</a>
          <a href="#testimonials" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">TESTIMONIALS</a>
          <a href="#contact" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">CONTACT</a>
        </nav>

        {/* Icons */}
        <div className="flex gap-4 items-center text-xl text-black relative">
          {/* Search */}
          <div className="relative">
            <FaSearch className="cursor-pointer" onClick={toggleSearch} />
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                className="absolute top-8 right-0 w-40 px-2 py-1 rounded-md border border-gray-300 shadow bg-white text-sm focus:outline-none"
              />
            )}
          </div>

          <FaUser className="cursor-pointer" />
          
          {/* Wishlist/Favorites */}
          <div className="relative wishlist-icon">
            <FaHeart className="cursor-pointer" onClick={toggleWishlist} />
            {wishlistTotalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                {wishlistTotalItems}
              </span>
            )}
            
            {/* Wishlist Dropdown */}
            {showWishlist && wishlistItems.length > 0 && (
              <div className="absolute top-8 right-0 w-72 bg-white rounded-lg shadow-lg p-4 z-50 wishlist-dropdown">
                <h3 className="text-lg font-semibold mb-3">My Wishlist ({wishlistTotalItems})</h3>
                <div className="max-h-80 overflow-y-auto">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-[#5C2EC0]">{item.price}</p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="text-xs bg-[#5C2EC0] text-white px-2 py-1 rounded"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Empty Wishlist Message */}
            {showWishlist && wishlistItems.length === 0 && (
              <div className="absolute top-8 right-0 w-72 bg-white rounded-lg shadow-lg p-4 z-50 wishlist-dropdown">
                <p className="text-center py-4 text-gray-500">Your wishlist is empty</p>
              </div>
            )}
          </div>

          <div className="relative cart-icon">
            <FaShoppingCart
              className="cursor-pointer"
              onClick={() => {
                navigate('/shopping-cart');
                // Scroll to top after navigation
                window.scrollTo(0, 0);
              }}
            />
            {cartTotalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5C2EC0] text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                {cartTotalItems}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - show on small screens */}
      {menuOpen && (
        <div className="md:hidden bg-[#f5f6f8] shadow-md px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          <a href="#" className="py-1 font-semibold hover:bg-[#5C2EC0] rounded-md px-3">HOME</a>
          <a href="#" className="py-1 font-semibold hover:bg-[#5C2EC0] rounded-md px-3">ABOUT</a>
          <a href="#" className="py-1 font-semibold hover:bg-[#5C2EC0] rounded-md px-3">PRODUCTS</a>
          <a href="#" className="py-1 font-semibold hover:bg-[#5C2EC0] rounded-md px-3">TESTIMONIALS</a>
          <a href="#" className="py-1 font-semibold hover:bg-[#5C2EC0] rounded-md px-3">CONTACT</a>
        </div>
      )}
    </header>
  );
};

export default Header;

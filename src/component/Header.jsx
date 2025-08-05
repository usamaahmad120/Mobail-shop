import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaChevronDown } from "react-icons/fa";
import {
  selectCartTotalItems,
  selectCartItems,
  toggleCart,
  selectIsCartOpen,
  removeFromCart,
  increaseQty,
  decreaseQty,
  addToCart,
} from "../store/cartSlice";
import {
  selectWishlistTotalItems,
  selectWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "../store/wishlistSlice";
import { products } from "../export";
import { latestProducts } from "../Latest";
import CategoryDropdown from "./CategoryDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Roman Urdu category names
  const categories = [
    "Girls Fashion",
    "Jewellery & Watches",
    "Health & Beauty",
    "Baby",
    "Electronics",
  ];

  const cartTotalItems = useSelector(selectCartTotalItems);
  const cartItems = useSelector(selectCartItems);
  const isCartOpen = useSelector(selectIsCartOpen);
  const wishlistTotalItems = useSelector(selectWishlistTotalItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const allProducts = [...products, ...latestProducts];

  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleWishlist = () => setShowWishlist(!showWishlist);
  const handleToggleCart = () => dispatch(toggleCart());

  const handleRemoveFromCart = (productId) => dispatch(removeFromCart(productId));
  const handleIncreaseQty = (productId) => dispatch(increaseQty(productId));
  const handleDecreaseQty = (productId) => dispatch(decreaseQty(productId));
  const handleAddToCart = (product) => dispatch(addToCart(product));

  const handleToggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    if (isInWishlist) dispatch(removeFromWishlist(product.id));
    else dispatch(addToWishlist(product));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[$Rs,]/g, ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (showSearch) setShowSearch(false);
      if (showWishlist) setShowWishlist(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showSearch, showWishlist]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen && !event.target.closest('.cart-dropdown') && !event.target.closest('.cart-icon')) dispatch(toggleCart());
      if (showWishlist && !event.target.closest('.wishlist-dropdown') && !event.target.closest('.wishlist-icon')) setShowWishlist(false);
      if (activeDropdown && !event.target.closest('.group') && !event.target.closest('.group/category')) setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, showWishlist, activeDropdown, dispatch]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f6f8] shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-bold italic text-[#5C2EC0] underline decoration-[#5C2EC0] hover:text-[#4a25a3] transition duration-300">
          Electra Shop
        </Link>

        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}><FaBars /></div>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">HOME</Link>

          <div className="relative group">
            <div className="flex items-center gap-1 px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('categories')}
              onClick={() => setActiveDropdown(activeDropdown === 'categories' ? null : 'categories')}>
              CATEGORIES <FaChevronDown className="text-xs ml-1" />
            </div>

            {activeDropdown === 'categories' && (
              <div className="absolute top-full left-0 w-[200px] bg-white shadow-lg rounded-b-lg p-2 z-50" onMouseLeave={() => setActiveDropdown(null)}>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category}`}
                    className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/products" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">PRODUCTS</Link>
          <a href="#about" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">ABOUT</a>
          <a href="#testimonials" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">TESTIMONIALS</a>
          <a href="#contact" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300">CONTACT</a>
        </nav>

        <div className="flex gap-4 items-center text-xl text-black relative">
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

          <div className="relative wishlist-icon">
            <FaHeart className="cursor-pointer" onClick={toggleWishlist} />
            {wishlistTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">{wishlistTotalItems}</span>}
          </div>

          <div className="relative cart-icon">
            <FaShoppingCart
              className="cursor-pointer"
              onClick={() => {
                navigate('/shopping-cart');
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
    </header>
  );
};

export default Header;

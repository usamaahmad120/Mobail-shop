import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
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
  const [searchTerm, setSearchTerm] = useState('');
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-bold italic text-[#5C2EC0] underline decoration-[#5C2EC0] hover:text-[#4a25a3] transition duration-300">
          Electra Shop
        </Link>

        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}><FaBars /></div>

        {/* Desktop Navigation */}
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
        
        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="bg-white h-screen w-64 p-5 shadow-lg transform transition-transform duration-300 ease-in-out fixed top-0 right-0">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-[#5C2EC0]">Menu</span>
                <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700">
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link to="/" className="px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300" onClick={toggleMenu}>HOME</Link>
                
                <div className="relative">
                  <div
                    className="flex items-center justify-between px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300 cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === 'mobileCategories' ? null : 'mobileCategories')}
                  >
                    <span>CATEGORIES</span>
                    <FaChevronDown className="text-xs" />
                  </div>
                  
                  {activeDropdown === 'mobileCategories' && (
                    <div className="bg-gray-100 rounded-md mt-1 p-2">
                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          to={`/category/${category}`}
                          className="block px-4 py-2 hover:bg-gray-200 rounded-md"
                          onClick={toggleMenu}
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link to="/products" className="px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300" onClick={toggleMenu}>PRODUCTS</Link>
                <a href="#about" className="px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300" onClick={toggleMenu}>ABOUT</a>
                <a href="#testimonials" className="px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300" onClick={toggleMenu}>TESTIMONIALS</a>
                <a href="#contact" className="px-4 py-2 rounded-md font-semibold hover:bg-[#5C2EC0] hover:text-white transition duration-300" onClick={toggleMenu}>CONTACT</a>
              </nav>
            </div>
          </div>
        )}

        <div className="flex gap-4 items-center text-xl text-black relative">
          <div className="relative">
            <FaSearch className="cursor-pointer" onClick={toggleSearch} />
            {showSearch && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchTerm.trim()) {
                    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                    setShowSearch(false);
                    setSearchTerm('');
                  }
                }}
                className="absolute top-8 right-0 flex"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 px-2 py-1 rounded-l-md border border-gray-300 shadow bg-white text-sm focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#5C2EC0] text-white px-2 py-1 rounded-r-md hover:bg-[#4a25a3] transition duration-300"
                >
                  <FaSearch className="text-sm" />
                </button>
              </form>
            )}
          </div>

          <FaUser className="cursor-pointer" />

          <div className="relative wishlist-icon">
            <FaHeart className="cursor-pointer" onClick={toggleWishlist} />
            {wishlistTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">{wishlistTotalItems}</span>}
            
            {showWishlist && (
              <div className="wishlist-dropdown fixed md:absolute right-4 top-16 w-72 sm:w-80 bg-white shadow-lg rounded-md p-4 z-50 max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">My Wishlist ({wishlistTotalItems})</h3>
                
                {wishlistItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your wishlist is empty</p>
                ) : (
                  <>
                    <div className="max-h-60 overflow-y-auto">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.price}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="text-xs bg-[#5C2EC0] text-white px-2 py-1 rounded hover:bg-[#4a25a3]"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(item)}
                              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button
                        onClick={() => {
                          setShowWishlist(false);
                          navigate('/products');
                        }}
                        className="text-sm bg-gray-200 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-300"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
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

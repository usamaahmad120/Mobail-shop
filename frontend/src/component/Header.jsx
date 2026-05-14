import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import {
  loadCartFromStorage,
  selectCartTotalItems,
} from "../store/cartSlice";

import {
  loadWishlistFromStorage,
  selectWishlistTotalItems,
} from "../store/wishlistSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartTotalItems = useSelector(selectCartTotalItems);

  const wishlistTotalItems = useSelector(selectWishlistTotalItems);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Close menus
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".user-box")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleUserClick = () => {
    if (token && user) {
      setShowUserMenu(!showUserMenu);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(loadCartFromStorage());
    dispatch(loadWishlistFromStorage());
    setShowUserMenu(false);
    navigate("/login");
  };

  const goProfile = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const goOrders = () => {
    setShowUserMenu(false);
    navigate("/my-orders");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold text-[#5C2EC0]"
        >
          Electra Shop
        </Link>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-2xl cursor-pointer">
          <FaBars onClick={() => setMenuOpen(true)} />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-5 text-sm font-semibold">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-[#5C2EC0] hover:text-white"
          >
            HOME
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-[#5C2EC0] hover:text-white"
          >
            PRODUCTS
          </Link>

          <Link
            to="/about"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-[#5C2EC0] hover:text-white"
          >
            ABOUT
          </Link>

          <Link
            to="/contact"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-[#5C2EC0] hover:text-white"
          >
            CONTACT
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3 text-xl relative text-slate-700">
          {/* Search */}
          <div className="relative">
            <FaSearch
              className="cursor-pointer hover:text-[#5C2EC0] transition"
              onClick={() => setShowSearch(!showSearch)}
            />

            {showSearch && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (searchTerm.trim()) {
                    navigate(
                      `/products?search=${encodeURIComponent(searchTerm)}`
                    );
                    setShowSearch(false);
                    setSearchTerm("");
                  }
                }}
                className="absolute top-8 right-0 flex"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  className="border px-3 py-2 text-sm rounded-l-lg outline-none focus:border-[#5C2EC0]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className="bg-[#5C2EC0] text-white px-3 rounded-r-lg">
                  <FaSearch className="text-sm" />
                </button>
              </form>
            )}
          </div>

          {/* User */}
          <div className="relative user-box">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleUserClick}
            >
              <FaUser className="hover:text-[#5C2EC0] transition" />

              {user && (
                <span className="text-sm font-semibold hidden sm:block">
                  {user.name}
                </span>
              )}
            </div>

            {showUserMenu && user && (
              <div className="absolute right-0 top-10 w-52 bg-white shadow-xl rounded-lg p-3 border border-slate-200">
                <div className="pb-2 border-b font-semibold text-sm">
                  {user.name}
                </div>

                <button
                  onClick={goProfile}
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm mt-2"
                >
                  My Profile
                </button>

                <button
                  onClick={goOrders}
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-sm"
                >
                  My Orders
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-100 text-red-500 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart className="hover:text-[#5C2EC0] transition" />

            {wishlistTotalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1 rounded-full">
                {wishlistTotalItems}
              </span>
            )}
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/shopping-cart")}
          >
            <FaShoppingCart className="hover:text-[#5C2EC0] transition" />

            {cartTotalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-1 rounded-full">
                {cartTotalItems}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="w-64 bg-white h-screen absolute right-0 top-0 p-5 shadow-xl border-l border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#5C2EC0]">Menu</h2>

              <FaTimes
                className="cursor-pointer text-xl"
                onClick={() => setMenuOpen(false)}
              />
            </div>

            <div className="flex flex-col gap-4 text-sm font-semibold">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                HOME
              </Link>

              <Link to="/products" onClick={() => setMenuOpen(false)}>
                PRODUCTS
              </Link>

              <Link to="/about" onClick={() => setMenuOpen(false)}>
                ABOUT
              </Link>

              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                CONTACT
              </Link>

              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                PROFILE
              </Link>

              <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                MY ORDERS
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-red-500"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;


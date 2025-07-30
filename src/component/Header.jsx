import React, { useState,useEffect } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars } from "react-icons/fa";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSearch = () => setShowSearch(!showSearch);
  const toggleMenu = () => setMenuOpen(!menuOpen);

// Close search input on scroll
useEffect(() => {
  const handleScroll = () => {
    if (showSearch) {
      setShowSearch(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [showSearch]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f5f6f8] shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-bold italic text-[#5C2EC0] underline decoration-[#5C2EC0]">
          Electra Shop
        </h1>

        {/* Hamburger for mobile */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
          <FaBars />
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0]">HOME</a>
          <a href="#" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0]">ABOUT</a>
          <a href="#" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0]">PRODUCTS</a>
          <a href="#" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0]">TESTIMONIALS</a>
          <a href="#" className="px-4 py-1 rounded-md font-semibold hover:bg-[#5C2EC0]">CONTACT</a>
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
          <FaHeart className="cursor-pointer" />

          <div className="relative">
            <FaShoppingCart className="cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-[#5C2EC0] text-white text-xs px-1.5 py-0.5 rounded-full">
              0
            </span>
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

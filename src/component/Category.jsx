import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { products } from "../export.js";
import { latestProducts } from "../Latest.js";

function Category() {
  // Combine all products
  const allProducts = useMemo(() => [...products, ...latestProducts], []);
  
  // Extract unique categories and get a representative product for each
  const categories = useMemo(() => {
    // Get unique categories
    const uniqueCategories = [...new Set(allProducts.map(product => product.category))];
    
    // Limit to 5 main categories for display
    const mainCategories = uniqueCategories.slice(0, 5);
    
    // Get a representative product for each category
    return mainCategories.map(category => {
      // Find the first product in this category
      const representativeProduct = allProducts.find(product => product.category === category);
      return {
        name: category,
        product: representativeProduct
      };
    });
  }, [allProducts]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div
      id="category"
      className="w-full bg-gray-100 lg:px-20 px-5 pt-[130px] pb-[80px] flex lg:flex-row flex-col items-center justify-between gap-20"
    >
      {/* Left Heading Section */}
      <div
        data-aos="fade-right"
        data-aos-delay="50"
        className="lg:w-[15%] w-full flex flex-col justify-center lg:items-start items-center gap-[20px]"
      >
      <h1 className="text-xl font-semibold text-center text-[#502EC3]">
          Favorite items
        </h1>
        <h1 className="text-[42px] font-semibold text-center text-black leading-[50px] lg:text-start">
          Popular Categories
        </h1>
        <Link to="/products" className="bg-[#502EC3] text-white font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 mt-[60px] inline-block">
          VIEW ALL
        </Link>
      </div>

      {/* Right Side Categories */}
      <div className="lg:w-[85%] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 justify-center items-center">
        
        {categories.map((category, index) => (
          <div
            key={category.name}
            data-aos="zoom-in"
            data-aos-delay={50 * (index + 1)}
            className="flex flex-col justify-center items-center gap-4"
          >
            <Link
              to="/products"
              state={{ category: category.name }}
              className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300"
            >
              <img
                src={category.product.img}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </Link>
            <Link
              to="/products"
              state={{ category: category.name }}
              className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer"
            >
              {getCategoryDisplayName(category.name)}
            </Link>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.name}</span>
          </div>
        ))}

      </div>
    </div>
  );
}

// Helper function to get a display name for the category
function getCategoryDisplayName(category) {
  const displayNames = {
    "Electronics": "Electronic Gadgets",
    "Jewellery & Watches": "Watches & Jewelry",
    "Girls Fashion": "Women's Fashion",
    "Health & Beauty": "Beauty Products",
    "Fashion": "Fashion Accessories",
    "Baby": "Baby Products",
    "Gadgets": "Smart Gadgets",
    "Shoes": "Footwear",
    "Cosmetics": "Makeup & Cosmetics",
    "Bags": "Bags & Backpacks",
    "Beauty": "Beauty Essentials",
    "Shirts": "Men's Shirts"
  };
  
  return displayNames[category] || category;
}

export default Category;

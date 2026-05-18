import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Category() {
  const [allProducts, setAllProducts] = useState([]);

  // ✅ Fetch products from backend API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((payload) => {
        const data = payload.data || payload;
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Extract unique categories and representative product
  const categories = useMemo(() => {
    if (!allProducts.length) return [];

    const uniqueCategories = [
      ...new Set(allProducts.map((product) => product.category?.name)),
    ];

    const mainCategories = uniqueCategories.slice(0, 5);

    return mainCategories.map((category) => {
      const representativeProduct = allProducts.find(
        (product) => product.category?.name === category
      );

      return {
        name: category,
        product: representativeProduct,
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
      className="w-full bg-gray-100 responsive-section pt-[90px] sm:pt-[110px] lg:pt-[130px] pb-[60px] sm:pb-[80px] flex lg:flex-row flex-col items-center justify-between gap-10 lg:gap-20"
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
        <Link
          to="/products"
          className="bg-[#502EC3] text-white font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 mt-6 lg:mt-[60px] inline-block"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Right Side Categories */}
      <div className="lg:w-[85%] w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 justify-center items-start">
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
              className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300"
            >
    <img
  src={
    category.product?.image
      ? category.product.image
      : "https://via.placeholder.com/150"
  }
  alt={category.name}
  className="w-full h-full object-cover"
/>
            </Link>

            <Link
              to="/products"
              state={{ category: category.name }}
              className="text-sm sm:text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer"
            >
              {getCategoryDisplayName(category.name)}
            </Link>

            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function (UNCHANGED)
function getCategoryDisplayName(category) {
  const displayNames = {
    Electronics: "Electronic Gadgets",
    Laptops: "Laptops",
    "Gaming Laptops": "Gaming Laptops",
    Smartphones: "Smartphones",
    Tablets: "Tablets",
    Gadgets: "Smart Gadgets",
  };

  return displayNames[category] || category;
}

export default Category;

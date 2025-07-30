import React, { useEffect } from "react";
import cat1 from "../assets/cat1.jpg";
import cat2 from "../assets/cat2.jpg";
import cat3 from "../assets/cat3.jpg";
import cat4 from "../assets/cat4.jpg";
import cat5 from "../assets/cat5.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

function Category() {
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
        <button className="bg-[#502EC3] text-white font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 mt-[60px]">
          VIEW ALL
        </button>
      </div>

      {/* Right Side Categories */}
      <div className="lg:w-[85%] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 justify-center items-center">
        
        
        <div
          data-aos="zoom-in"
          data-aos-delay="50"
          className="flex flex-col justify-center items-center gap-4"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300">
            <img src={cat1} alt="Category 1" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer">
            Portable Speakers
          </h2>
        </div>

   
        <div
          data-aos="zoom-in"
          data-aos-delay="100"
          className="flex flex-col justify-center items-center gap-4"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300">
            <img src={cat2} alt="Category 2" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer">
            Air Conditioners
          </h2>
        </div>

       
        <div
          data-aos="zoom-in"
          data-aos-delay="150"
          className="flex flex-col justify-center items-center gap-4"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300">
            <img src={cat3} alt="Category 3" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer">
            EV Charging Cable
          </h2>
        </div>

       
        <div
          data-aos="zoom-in"
          data-aos-delay="200"
          className="flex flex-col justify-center items-center gap-4"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300">
            <img src={cat4} alt="Category 4" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer">
            DVD Player Slot
          </h2>
        </div>

       
        <div
          data-aos="zoom-in"
          data-aos-delay="250"
          className="flex flex-col justify-center items-center gap-4"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden hover:scale-105 transition duration-300">
            <img src={cat5} alt="Category 5" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-lg font-semibold text-center py-2 hover:text-[#502EC3] cursor-pointer">
            360 Camera
          </h2>
        </div>

      </div>
    </div>
  );
}

export default Category;

import React, { useEffect } from "react";
import { products } from "../export";
import { FaHeart, FaEye } from "react-icons/fa";
import { TiHeartOutline } from "react-icons/ti";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoIosStar } from "react-icons/io";
import AOS from "aos";
import "aos/dist/aos.css";

function Product() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  return (
    <div
      id="product"
      className="w-full lg:px-20 px-5 py-[80px] flex flex-col justify-center items-center gap-4 bg-gray-100"
    >
      <h1
        data-aos="zoom-in"
        data-aos-delay="200"
        className="text-xl font-semibold text-[#502EC3]"
      >
        Browse Collection
      </h1>
      <h1
        data-aos="zoom-in"
        data-aos-delay="300"
        className="text-[42px] leading-[50px] font-semibold text-black"
      >
        Trending Products
      </h1>

      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-10"
      >
        {products.map((item, index) => (
          <div
            key={index}
            className="group flex flex-col justify-center items-center gap-2 bg-white p-4 rounded-lg cursor-pointer relative shadow hover:shadow-lg transition duration-300"
          >
            
            <div className="flex gap-4 text-xl text-[#502EC3] absolute top-4  z-10 opacity-0 group-hover:opacity-100 transition duration-300 justify-center items-center">
              <div className="bg-[#502EC3] hover:bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full text-white cursor-pointer transition">
                <FaEye />
              </div>
              <div className="bg-[#502EC3] hover:bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full text-white cursor-pointer transition">
                <TiHeartOutline />
              </div>
              <div className="bg-[#502EC3] hover:bg-yellow-400 w-10 h-10 flex justify-center items-center rounded-full text-white cursor-pointer transition">
                <MdOutlineAddShoppingCart />
              </div>
            </div>

            
            <img
              src={item.img}
              className="w-full h-48 object-cover rounded-md mb-4 mt-10"
              alt={item.name}
            />

            
            <h1 className="text-gray-400 text-lg font-semibold">{item.category}</h1>
            <h1 className="text-xl font-semibold text-center">{item.name}</h1>
            <h1 className="text-xl font-bold text-[#502EC3] mt-2">{item.price}</h1>

           
            <div className="w-full mt-2">
              <hr />
              <div className="flex justify-between items-center mt-2 gap-6">
                <div className="flex items-start gap-1">
                  <IoIosStar className="text-[#502EC3] text-lg" />
                  <IoIosStar className="text-[#502EC3] text-lg" />
                  <IoIosStar className="text-[#502EC3] text-lg" />
                  <IoIosStar className="text-[#502EC3] text-lg" />
                  <IoIosStar className="text-[#502EC3] text-lg" />
                </div>
                <button className="bg-green-500 text-white rounded-lg px-3 py-3 text-[14px] font-semibold">
                  Sale 14%
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

     
      <button className="bg-[#502EC3] text-white rounded-lg px-6 py-2 text-[20px] font-semibold mt-6 hover:bg-yellow-500">
        View More
      </button>
    </div>
  );
}

export default Product;

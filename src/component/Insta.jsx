import React, { useEffect } from 'react';
import insta1 from '../assets/insta-1.jpg';
import insta2 from '../assets/insta-2.jpg';
import insta3 from '../assets/insta-3.jpg';
import insta4 from '../assets/insta-4.jpg';
import insta5 from '../assets/insta-5.jpg';
import insta6 from '../assets/insta-6.jpg';
import AOS from "aos";
import "aos/dist/aos.css";

function Insta() {
   useEffect(() => {
      AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
      AOS.refresh();
    }, []);

  return (
     <div className="w-full lg:px-20 px-5 py-[80px] flex flex-col justify-center items-center gap-4 bg-white"
    >
      <h1
        data-aos="zoom-in"
        data-aos-delay="200"
        className="text-xl font-semibold text-[#502EC3]"
      >
        Our instagram shop
      </h1>
      <h1
        data-aos="zoom-in"
        data-aos-delay="300"
        className="text-[42px] leading-[50px] font-semibold text-black"
      >
        Follow on instagram
      </h1>
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mt-10">
        <img src={insta1} alt="Instagram 1" className="w-full h-auto rounded-lg" />
        <img src={insta2} alt="Instagram 2" className="w-full h-auto rounded-lg" />
        <img src={insta3} alt="Instagram 3" className="w-full h-auto rounded-lg" />
        <img src={insta4} alt="Instagram 4" className="w-full h-auto rounded-lg" />
        <img src={insta5} alt="Instagram 5" className="w-full h-auto rounded-lg" />
        <img src={insta6} alt="Instagram 6" className="w-full h-auto rounded-lg" />
       </div>
       <button className='bg-[#502EC3] text-white py-3 px-12 rounded hover:bg-yellow-500 hover:text-black font-semibold mt-10'>SHOP NOW</button>
      </div>
  )
}

export default Insta
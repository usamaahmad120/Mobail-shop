import React, { useEffect } from 'react'
import deals from "../assets/deal-bg.jpg" 
import AOS from "aos";
import "aos/dist/aos.css";

function Baner() {
   useEffect(() => {
      AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
      AOS.refresh();
    }, []);

  return (
    <div className='w-full responsive-section py-[60px] sm:py-[80px] gap-4 '>
      <div data-aos ="zoom-in" data-aos-delay="200" className='flex justify-center items-center min-h-[240px] sm:min-h-[300px] px-4' style={{ backgroundImage: `url(${deals})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px' }}>
        <div className='flex flex-col justify-center items-center mt-4'>
        <h1 className='text-xl font-bold text-yellow-500'>Every Day Shopping</h1>
        <p className=' text-center mt-2 responsive-heading text-white font-bold'>Deal of the Day</p>
        <button className='bg-yellow-500 text-black py-3 px-5 rounded hover:bg-white hover:text-black font-semibold mt-10'>SHOP NOW</button>
      </div>
           
      </div>
   

    </div>
  )
}

export default Baner

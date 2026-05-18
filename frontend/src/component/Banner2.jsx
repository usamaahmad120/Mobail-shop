import React, { useEffect } from 'react'
import bannner3 from '../assets/bannner3.jpg'
import AOS from "aos";
import "aos/dist/aos.css";

function Banner2() {
  useEffect(() => {
        AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
        AOS.refresh();
      }, []);

  return (
<div className="w-full responsive-section py-[60px] sm:py-[80px]">
  <div
    data-aos="zoom-in"
    data-aos-delay="200"
    className="w-full min-h-[220px] sm:min-h-[350px] lg:min-h-[400px] rounded-[10px] p-2 flex justify-center items-center bg-white overflow-hidden"
  >
    <img
      src={bannner3}
      alt="Banner"
      className="w-full h-full object-contain lg:object-cover"
    />
  </div>
</div>








  )
}

export default Banner2

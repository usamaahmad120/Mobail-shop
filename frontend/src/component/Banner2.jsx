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
<div className="w-full px-5 lg:px-5 py-[80px]">
  <div
    data-aos="zoom-in"
    data-aos-delay="200"
    className="w-full h-[350px] lg:h-[400px] rounded-[10px] p-2 flex justify-center items-center bg-white overflow-hidden"
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
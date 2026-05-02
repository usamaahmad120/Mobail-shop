import React, { useEffect } from 'react'
import shipping from '../assets/shipping.png'
import payment from '../assets/payment.png'
import refund from '../assets/return.png'
import gift from '../assets/gift.png'
import AOS from "aos";
import "aos/dist/aos.css";


function Services() {
   useEffect(() => {
      AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
      AOS.refresh();
    }, []);
  return (
    <>
  <div className="w-full px-6 py-10 bg-gray-100 rounded-lg flex justify-center">
  {/* Section Container with white background and inner padding */}
  <div className="w-full max-w-[1200px]  bg-white shadow-lg px-6  rounded-lg mb-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">

      {/* Card 1 */}
      <div
        data-aos="zoom-in"
        data-aos-delay="100"
        className="flex items-center gap-4 p-4 w-full sm:w-[300px] h-[130px]"
      >
        <img src={shipping} alt="Shipping" className="w-14 h-14" />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold">Free Shipping</h1>
          <p className="text-gray-600 text-sm">On orders over $50</p>
        </div>
      </div>

      {/* Card 2 */}
      <div
        data-aos="zoom-in"
        data-aos-delay="200"
        className="flex items-center gap-4 p-4 w-full sm:w-[300px] h-[130px]"
      >
        <img src={payment} alt="Payment" className="w-12 h-12" />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold">Secure Payment</h1>
          <p className="text-gray-600 text-sm">100% secure payment</p>
        </div>
      </div>

      {/* Card 3 */}
      <div
        data-aos="zoom-in"
        data-aos-delay="300"
        className="flex items-center gap-4 p-4 w-full sm:w-[300px] h-[130px]"
      >
        <img src={refund} alt="Refund" className="w-12 h-12" />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold">Easy Refunds</h1>
          <p className="text-gray-600 text-sm">30-day money-back guarantee</p>
        </div>
      </div>

      {/* Card 4 */}
      <div
        data-aos="zoom-in"
        data-aos-delay="400"
        className="flex items-center gap-4 p-4 w-full sm:w-[300px] h-[130px]"
      >
        <img src={gift} alt="Support" className="w-12 h-12" />
        <div className="flex flex-col justify-center">
          <h1 className="text-lg font-semibold">24/7 Support</h1>
          <p className="text-gray-600 text-sm">We're here to help you</p>
        </div>
      </div>

    </div>
  </div>
</div>



    </>
  )
}

export default Services
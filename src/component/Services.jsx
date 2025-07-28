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
    <div className="w-full lg:px-20 px-5 py-[20px] grid grid-cols-1 lg:grid-cols-4 justify-center items-center gap-10">
      <div data-aos="zoom-in" data-aos-delay="100" className="flex flex-col justify-center items-center gap-4 p-10 rounded-lg" >
        <img src={shipping} alt="Shipping" className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">Free Shipping</h1>
        <p className="text-gray-600">On orders over $50</p>
      </div>
      <div data-aos="zoom-in" data-aos-delay="200" className="flex flex-col justify-center items-center gap-4 p-10 rounded-lg">
        <img src={payment} alt="Payment" className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">Secure Payment</h1>
        <p className="text-gray-600">100% secure payment</p>
      </div>
      <div data-aos="zoom-in" data-aos-delay="300" className="flex flex-col justify-center items-center gap-4 p-10 rounded-lg">
        <img src={refund} alt="Refund" className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">Easy Refunds</h1>
        <p className="text-gray-600">30-day money-back guarantee</p>
      </div>
      <div data-aos="zoom-in" data-aos-delay="400" className="flex flex-col justify-center items-center gap-4 p-10 rounded-lg">
        <img src={gift} alt="Support" className="w-16 h-16" />
        <h1 className="text-2xl font-semibold">24/7 Support</h1>
        <p className="text-gray-600">We're here to help you</p>
      </div>
    </div>
    </>
  )
}

export default Services
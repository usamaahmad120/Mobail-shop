import React from "react";
import { FaBolt, FaHeadset, FaShieldAlt, FaTruck } from "react-icons/fa";

const About = () => {
  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16">
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="shop-eyebrow mb-3">About Electra Shop</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
              Smart shopping for phones, gadgets, and everyday tech.
            </h1>
            <p className="text-gray-600 text-lg leading-8">
              Electra Shop brings reliable laptops, gaming laptops, smartphones, tablets, and essential electronics into one focused store. We focus on clean product browsing, clear prices, fast ordering, and helpful service after checkout.
            </p>
          </div>

          <div className="shop-card p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-5 bg-slate-50">
                <FaBolt className="text-[#5C2EC0] text-3xl mb-4" />
                <h2 className="font-bold text-gray-900">Fresh Stock</h2>
                <p className="text-sm text-gray-500 mt-2">Updated products for modern shoppers.</p>
              </div>
              <div className="border rounded-lg p-5 bg-slate-50">
                <FaShieldAlt className="text-[#5C2EC0] text-3xl mb-4" />
                <h2 className="font-bold text-gray-900">Secure Orders</h2>
                <p className="text-sm text-gray-500 mt-2">Checkout flow built with care.</p>
              </div>
              <div className="border rounded-lg p-5 bg-slate-50">
                <FaTruck className="text-[#5C2EC0] text-3xl mb-4" />
                <h2 className="font-bold text-gray-900">Fast Delivery</h2>
                <p className="text-sm text-gray-500 mt-2">Quick dispatch across Pakistan.</p>
              </div>
              <div className="border rounded-lg p-5 bg-slate-50">
                <FaHeadset className="text-[#5C2EC0] text-3xl mb-4" />
                <h2 className="font-bold text-gray-900">Support</h2>
                <p className="text-sm text-gray-500 mt-2">Friendly help before and after buying.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="shop-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600">Make online shopping easier, clearer, and more dependable for customers who want good products without extra confusion.</p>
          </div>
          <div className="shop-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Sell</h2>
            <p className="text-gray-600">Laptops, gaming laptops, smartphones, tablets, audio gear, storage, and practical electronics selected for everyday use.</p>
          </div>
          <div className="shop-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
            <p className="text-gray-600">Simple navigation, PKR pricing, wishlist and cart tools, and a checkout experience made for local customers.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;

import React from "react";
import client1 from "../assets/client1.png";
import client2 from "../assets/client2.png";
import client3 from "../assets/client3.png";
import client4 from "../assets/client4.png";
import client5 from "../assets/client5.png";
import client6 from "../assets/client6.png";
import google from "../assets/google.jpg";
import apple from "../assets/apple.jpg";
import pay1 from "../assets/pay-1.jpg";
import pay2 from "../assets/pay-2.jpg";
import pay3 from "../assets/pay-3.jpg";
import pay4 from "../assets/pay-4.jpg";
import { FaArrowUp } from "react-icons/fa";

const brandLogos = [
  [client1, "Samsung"],
  [client2, "Acer"],
  [client3, "Lenovo"],
  [client4, "Sony"],
  [client5, "Asus"],
  [client6, "Logitech"],
];

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="bg-[#5C2EC0] py-8 px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-center justify-items-center gap-6 sm:gap-8">
        {brandLogos.map(([src, alt]) => (
          <img
            key={alt}
            src={src}
            alt={alt}
            className="h-6 brightness-75 hover:brightness-100 transition duration-100"
          />
        ))}
      </div>

      <div className="responsive-section py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 text-gray-500 bg-gray-100">
        <div className="lg:col-span-2">
          <h2 className="text-[#5C2EC0] font-bold text-2xl italic mb-4">
            Electra Shop
          </h2>
          <p className="text-base sm:text-lg mb-4">
            Focused electronics shopping for laptops, gaming laptops,
            smartphones, tablets, and essential tech accessories.
          </p>
          <p className="font-semibold mb-2 text-xl sm:text-2xl text-black">
            Download Our App
          </p>
          <div className="flex flex-wrap gap-3">
            <img src={google} alt="Google Play" className="h-10" />
            <img src={apple} alt="App Store" className="h-10" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg text-black mb-3">Useful Links</h3>
          <ul className="space-y-3 text-base sm:text-lg font-semibold">
            <li><a href="/" className="hover:text-black transition">Home</a></li>
            <li><a href="/about" className="hover:text-black transition">About</a></li>
            <li><a href="/products" className="hover:text-black transition">Products</a></li>
            <li><a href="/contact" className="hover:text-black transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg text-black mb-3">Information</h3>
          <ul className="space-y-3 text-base sm:text-lg font-semibold">
            <li><a href="/contact" className="hover:text-black transition">Return Policy</a></li>
            <li><a href="/contact" className="hover:text-black transition">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:text-black transition">Refund Policy</a></li>
            <li><a href="/contact" className="hover:text-black transition">Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg text-black mb-3">Top Category</h3>
          <ul className="space-y-3 text-base sm:text-lg font-semibold">
            <li><a href="/products" className="hover:text-black transition">Laptops</a></li>
            <li><a href="/products" className="hover:text-black transition">Gaming Laptops</a></li>
            <li><a href="/products" className="hover:text-black transition">Smartphones</a></li>
            <li><a href="/products" className="hover:text-black transition">Tablets</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg text-black mb-3">Contact Info</h3>
          <ul className="space-y-3 text-base sm:text-lg font-semibold">
            <li>
              <a href="tel:+1234567890" className="hover:text-black transition">
                Phone: +1 234 567 890
              </a>
            </li>
            <li>
              <a href="mailto:info@domain.com" className="hover:text-black transition break-words">
                Email: info@domain.com
              </a>
            </li>
            <li>
              401 SaveMart, 3rd floor, Saidpur Road, Rawalpindi
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full responsive-section border-t border-gray-300 bg-[#f5f6f8] py-6 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_1fr_auto] items-center gap-6">
        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
          <img src={pay1} alt="Visa" className="h-8" />
          <img src={pay2} alt="MasterCard" className="h-8" />
          <img src={pay3} alt="PayPal" className="h-8" />
          <img src={pay4} alt="Discover" className="h-8" />
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-xl mb-4">Subscribe Newsletter</h3>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-4 py-2 rounded-t-md sm:rounded-l-md sm:rounded-tr-none outline-none text-sm w-full sm:w-64"
            />
            <button className="bg-[#5C2EC0] text-white px-4 py-2 rounded-b-md sm:rounded-r-md sm:rounded-bl-none font-semibold text-sm">
              SUBMIT
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 text-center lg:text-right">
          © 2026 Electra Shop
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#5C2EC0] text-white p-3 rounded-full shadow-md hover:bg-[#4b22a3] transition duration-300 justify-self-center lg:justify-self-end"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;

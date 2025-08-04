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

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      {/* Logo Row */}
      <div className="bg-[#5C2EC0] py-10 px-4 flex flex-wrap justify-center gap-30">
        <img
          src={client1}
          alt="Samsung"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
        <img
          src={client2}
          alt="Acer"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
        <img
          src={client3}
          alt="Lenovo"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
        <img
          src={client4}
          alt="Sony"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
        <img
          src={client5}
          alt="Asus"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
        <img
          src={client6}
          alt="Logitech"
          className="h-6 brightness-75 hover:brightness-100 transition duration-100"
        />
      </div>

      {/* Footer Content */}
      <div className="px-8 lg:px-20 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 text-gray-500 bg-gray-100">
        {/* Brand Description */}
        <div className="lg:col-span-2">
          <h2 className="text-[#5C2EC0] font-bold text-2xl italic mb-4">
            Mobail Shop
          </h2>
          <p className="text-lg mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel aperiam
            facilis atque ullam pariatur. Nemo eligendi officiis exercitationem
            officia reprehenderit.
          </p>
          <p className="font-semibold mb-2 text-lg text-[25px] text-black">
            Download Our App
          </p>
          <div className="flex gap-3">
            <img src={google} alt="Google Play" className="h-10" />
            <img src={apple} alt="App Store" className="h-10" />
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-bold text-lg text-black mb-3">Useful Links</h3>
          <ul className="space-y-3 text-lg font-semibold">
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Blogs
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-bold text-lg  text-black mb-3">Information</h3>
          <ul className="space-y-3 text-lg font-semibold">
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Return Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Refund Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Agreement
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                We Our Brand
              </a>
            </li>
          </ul>
        </div>

        {/* Top Category */}
        <div>
          <h3 className="font-bold text-lg text-black mb-3">Top Category</h3>
          <ul className="space-y-3 text-lg font-semibold">
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Wireless headphone
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Bluetooth speakers
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Portable devices
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Monio live camera
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-black transition cursor-pointer"
              >
                Movie projector T6
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold text-lg  text-black mb-3">Contact Info</h3>
          <ul className="space-y-3 text-lg font-semibold">
            <li>
              <a
                href="tel:+1234567890"
                className="hover:text-black transition cursor-pointer"
              >
                Phone: +1 234 567 890
              </a>
            </li>
            <li>
              <a
                href="mailto:info@domain.com"
                className="hover:text-black transition cursor-pointer"
              >
                Email: info@domain.com
              </a>
            </li>
            <li className="hover:text-black transition cursor-pointer">
              401 SaveMart, 3th floor,
              <br />
              Said pur, road, Rawalpindi
            </li>
          </ul>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="flex justify-end px-8 pb-6">
        <button className="bg-[#5C2EC0] p-3 rounded-full shadow-md hover:bg-[#4b26a3] transition">
          <FaArrowUp className="text-white" />
        </button>
      </div>
      <div className="w-full lg:px-20 px-5 py-[20px] grid grid-cols-1 lg:grid-cols-4 justify-center items-center gap-10 border-t border-gray-300 bg-[#f5f6f8] py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-10 relative">
        {/* Left - Payment Icons */}
        <div className="flex gap-4">
          <img src={pay1} alt="Visa" className="h-8" />
          <img src={pay2} alt="MasterCard" className="h-8" />
          <img src={pay3} alt="PayPal" className="h-8" />
          <img src={pay4} alt="Discover" className="h-8" />
        </div>

        {/* Center - Newsletter */}
        <div className="text-center">
          <h3 className="font-semibold text-xl mb-4">Subscribe Newsletter</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-4 py-2 rounded-l-md outline-none text-sm w-64"
            />
            <button className="bg-[#5C2EC0] text-white px-4 py-2 rounded-r-md font-semibold text-sm">
              SUBMIT
            </button>
          </div>
        </div>

        {/* Right - Copyright */}
        <div className="text-sm text-gray-600 text-center md:text-right">
          © 2024 Power by Debug Entity
        </div>

        {/* Scroll-to-top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#5C2EC0] text-white p-3 rounded-full shadow-md hover:bg-[#4b22a3] transition duration-300 absolute right-4 bottom-4 md:static md:ml-auto"
        >
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;

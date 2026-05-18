import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import headset from "../assets/headset.jpg";
import earbuds from "../assets/earbuds.jpg";
import dslr from "../assets/dslr.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

function Hero() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
    AOS.refresh();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    { image: headset, title: ["Wireless", "Headset"] },
    { image: earbuds, title: ["Premium", "Earbuds"] },
    { image: dslr, title: ["DSLR", "Camera"] },
  ];

  return (
    <div id="hero" className="w-full pt-[80px]">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="w-full min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] bg-cover bg-center flex items-center justify-start px-4 sm:px-8 lg:px-10 py-14"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="max-w-[42rem]" data-aos="fade-right">
                <h4 className="inline-block text-yellow-400 text-sm sm:text-lg lg:text-xl font-semibold border border-yellow-400 px-3 sm:px-4 py-2 rounded-md mb-2">
                  Get up to discount 80% off
                </h4>

                <h1 data-aos = "zoom-in" data-aos-delay ="100" className ="mb-6 sm:mb-8 mt-7 sm:mt-9">

                  <span className="text-[44px] sm:text-[72px] lg:text-[120px] uppercase font-bold leading-[48px] sm:leading-[78px] lg:leading-[120px] text-white break-words">
                     {slide.title[0]}
                  </span>
                  <br />
                 
                  <span className="text-[44px] sm:text-[72px] lg:text-[120px] uppercase font-bold leading-[48px] sm:leading-[78px] lg:leading-[120px] text-white break-words">
                     {slide.title[1]}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-white mb-6">
                  <span className="text-yellow-400 font-bold">
                    100% Trusted
                  </span>{" "}
                  Electronic Gadgets
                </p>

                <button className="bg-yellow-400 text-black font-semibold px-7 sm:px-9 py-3 rounded-md hover:bg-yellow-300 transition duration-300 mt-4 sm:mt-6">
                  Online Collection
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;

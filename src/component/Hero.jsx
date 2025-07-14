import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import headset from '../assets/headset.jpg';
import earbud from '../assets/earbud.jpg';
import dslr from '../assets/dslr.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Hero() {
  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: 'ease-in-out' });
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
    { image: headset, title: 'Headset' },
    { image: earbud, title: 'Earbuds' },
    { image: dslr, title: 'DSLR Camera' },
  ];

  return (
    <div id="hero" className="w-full">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <div
              className="w-full h-[600px] bg-cover bg-center flex items-center justify-start px-10"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <h1 className="text-white text-4xl font-bold">{slide.title}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;

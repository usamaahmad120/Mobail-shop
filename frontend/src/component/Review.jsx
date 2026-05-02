import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import user1 from "../assets/test-1.jpg";
import user2 from "../assets/test-2.jpg";
import user3 from "../assets/test-3.jpg";
import user4 from "../assets/test-4.jpg";
import user5 from "../assets/test-5.jpg";
import user6 from "../assets/test-1.jpg";

import { IoIosStar } from "react-icons/io";
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    image: user1,
    name: "Ali Raza",
    role: "UI/UX Designer",
    quote: "Amazing service and quality!",
    paragraph:
      "Great experience from start to finish. Highly recommended for anyone looking for quality design.",
  },
  {
    image: user2,
    name: "Hina Sheikh",
    role: "Frontend Developer",
    quote: "Super smooth experience!",
    paragraph:
      "The interface is intuitive and easy to use. It saved me hours of development time.",
  },
  {
    image: user3,
    name: "Zain Shah",
    role: "Backend Engineer",
    quote: "Highly stable solution!",
    paragraph:
      "Everything works exactly how you'd expect. Solid performance even under pressure.",
  },
  {
    image: user4,
    name: "Sana Khan",
    role: "Project Manager",
    quote: "Delivered beyond expectations!",
    paragraph:
      "The support team was quick and professional. Project goals were met ahead of schedule.",
  },
  {
    image: user5,
    name: "Ahmed Bilal",
    role: "QA Analyst",
    quote: "A must-have for testers!",
    paragraph:
      "Bug-free and reliable — that’s rare to find. Testing became much easier and faster.",
  },
  {
    image: user6,
    name: "Sarah Malik",
    role: "Marketing Lead",
    quote: "Truly impactful!",
    paragraph:
      "Helped increase our reach with solid ROI. Definitely worth the investment for results.",
  },
];


const Review = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div  className="w-full py-20 px-4 lg:px-20 bg-gray-100">
      <div className="text-center mb-12">
        <h2 data-aos="zoom-in" data-aos-delay="100" className="text-xl font-semibold text-[#502EC3]">1300+ Customer reviews</h2>
        <h1 data-aos="zoom-in" data-aos-delay="200"className="text-xl font-semibold text-gray-800 mt-4 text-[42px]">Our customer love</h1>
      </div>

      <Slider {...settings}>
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            <ReviewCard data={reviews[0]} />
            <ReviewCard data={reviews[1]} />
          </div>
        </div>
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            <ReviewCard data={reviews[2]} />
            <ReviewCard data={reviews[3]} />
          </div>
        </div>
        <div>
          <div className="flex flex-col lg:flex-row gap-6">
            <ReviewCard data={reviews[4]} />
            <ReviewCard data={reviews[5]} />
          </div>
        </div>
      </Slider>
    </div>
  );
};

const ReviewCard = ({ data }) => {
  return (
    <div className="flex-1 bg-gray-100 p-6 rounded-2xl text-center">
      <img
        src={data.image}
        alt={data.name}
        className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
      />

      <div className="flex justify-center text-[#502EC3] mb-3">
        {[...Array(5)].map((_, i) => (
          <IoIosStar key={i} size={20} />
        ))}
      </div>

      <p className="text-gray-700 text-base leading-relaxed mb-4 px-2 text-semibold text-xl">
        {data.paragraph}
      </p>

      <div className="flex items-center justify-center text-[#502EC3] gap-6 mb-3">
        <FaQuoteLeft className="text-4xl font-bold" />
        <div>
          <h3 className="text-xl font-semibold text-black">{data.name}</h3>
          <p className="text-sm text-gray-500 font-semibold">{data.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Review;

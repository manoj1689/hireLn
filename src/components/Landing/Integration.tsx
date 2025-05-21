"use client"
import React, { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../carousel.css"
import { CustomLeftArrow, CustomRightArrow } from '../CustomArrow';
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function Integration() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    { text: "Seamless ATS Integration", color: "bg-sky-500" },
    { text: "Real-time Collaboration Tools", color: "bg-red-400" },
    { text: "Easy API Connectivity", color: "bg-green-500" },
    { text: "Secure Data Handling", color: "bg-yellow-400" },
    { text: "Custom Analytics", color: "bg-purple-400" },
  ];

  return (
    <div className='container relative mx-auto pt-12 pb-8 px-4 ' >
            {/* Left Column */}
            <div className="absolute right-10 top-10 flex flex-col gap-4">
                <img src="/images/integration/image1.png" alt="Image 1" className="w-28" />

            </div>
            <div className="absolute left-10 bottom-10 flex flex-col gap-4">
                <img src="/images/integration/image2.png" alt="Image 1" className="w-28" />

            </div>

       {/* Header */}
       <div className='flex justify-center items-center mb-4'>
        <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-emerald-500 '>
          Ai HireLn
        </span>
      </div>

      {/* Title */}
      <section>
        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
          seamless <span className='font-bold'>Integration</span> 
        </div>
      </section>

      {/* Subtitle */}
      <section>
        <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto  text-neutral-600'>
        Comprehensive tools to transform your recruitment process
        </div>
      </section>
      <Carousel
        partialVisible={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        containerClass="py-28 relative "
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        dotListClass="flex justify-center mt-4 "
        itemClass="px-4 "
        beforeChange={(nextSlide) => setCurrentSlide(nextSlide)}
      >
        {cards.map((card, index) => {
          const isCenter = index === (currentSlide + 1) % cards.length; // Adjust based on visible items
          return (

            <div
            key={index}
            className={`transform transition-transform duration-500 ${
              isCenter
                ? "w-full lg:scale-146 relative  "
                : "lg:w-2/3 mx-auto   "
            }`}
          >
              <div className={`${card.color} shadow-xl rounded-xl h-60 flex items-center justify-center text-center text-xl font-semibold text-gray-800`}>
                {card.text}
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default Integration;


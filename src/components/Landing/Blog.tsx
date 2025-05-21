"use client"
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

function Blog() {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1536 },
            items: 3,
        },
        desktop: {
            breakpoint: { max: 1536, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
        },
    };

    const cards = [
        {
            image: "/images/blog/blog1.png",
            title: "Efficient Screening",
            description: "Quickly identify top talent with AI-powered resume analysis and matching",
            date: "Mar 09, 2025",
        },
        {
            image: "/images/blog/blog2.png",
            title: "Comprehensive Interview",
            description: "Complete assessment tools and candidate management in one platform",
            date: "Mar 09, 2025",
        },
        {
            image: "/images/blog/blog3.png",
            title: "In-Depth Analytics",
            description: "Detailed insights and predictive analytics for informed decisions",
            date: "Apr 13, 2025",
        },
    ];

    return (
        <div className='container mx-auto pt-12 pb-8 px-4'>
            {/* Header */}
            <div className='flex justify-center items-center mb-4'>
                <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-orange-400 '>
                    Our Blogs
                </span>
            </div>

            {/* Title */}
            <section>
                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
                    Explore AI-Powered <span className='font-bold'>Hiring Insights</span>
                </div>
            </section>

            {/* Subtitle */}
            <section>
                <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto text-neutral-600'>
                    Discover how AI is transforming recruitment
                </div>
            </section>

            {/* Carousel */}
            <section className='my-10'>
                <Carousel 
              
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
                        arrows={false}
                        removeArrowOnDeviceType={["tablet", "mobile","desktop"]}
                        containerClass="py-28 relative "
                      
                        dotListClass="flex justify-center mt-4 "
                        itemClass="px-4 "
                >
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white h-full rounded-xl shadow-lg p-6">
                            <img src={card.image} alt={card.title} className="rounded-md mb-4" />
                            <h3 className="text-lg lg:text-xl font-medium">{card.title}</h3>
                            <p className="text-neutral-600 my-4 lg:w-4/5">{card.description}</p>
                            <div className="flex items-center gap-2 text-md">
                                <span className="bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white px-3 py-1 rounded-full">Featured</span>
                                <span className="font-medium tracking-wider">{card.date}</span>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </section>
        </div>
    );
}

export default Blog;

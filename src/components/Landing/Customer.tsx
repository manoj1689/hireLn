import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { CustomLeftArrow, CustomRightArrow } from '../CustomArrow';
function Customer() {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1536 },
            items: 2,
        },
        desktop: {
            breakpoint: { max: 1536, min: 1024 },
            items: 2,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
        },
    };

    const cards = [
        {
            image: "/images/Customer/Customer1.png",
            name: "Jennifer Blakely",
            position: "CEO, TechStart Inc.",
            description:
                "HireIn's AI platform has revolutionized our hiring process. We've reduced our time-to-hire by 70% while finding better-qualified candidates. The predictive analytics have been incredibly accurate.",
            rating: 4,
        },
        {
            image: "/images/Customer/Customer2.png",
            name: "Rahul Mehta",
            position: "HR Head, InnovateX",
            description:
                "We've streamlined our entire hiring funnel with HireIn. The insights it provides are spot-on, helping us make better decisions faster.",
            rating: 3,
        },
        {
            image: "/images/Customer/Customer1.png",
            name: "Elena Gomez",
            position: "Talent Manager, BrightEdge",
            description:
                "The AI-backed interviews and candidate analytics give us an unbeatable edge. Highly recommended for growing companies!",
            rating: 5,
        },
    ];

    return (
        <div className='flex bg-sky-50'>
<div className='container relative mx-auto pt-12 pb-8 px-4 ' >
        {/* Left Column */}
        <div className="absolute right-2 bottom-10 flex flex-col gap-4">
            <img src="/images/Customer/image1.png" alt="Image 1" className="w-28" />

        </div>
        <div className="absolute left-10 top-10 flex flex-col gap-4">
            <img src="/images/Customer/image2.png" alt="Image 1" className="w-28" />

        </div>

            {/* Header */}
            <div className='flex justify-center items-center mb-4'>
                <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-blue-400'>
                    Happy Customers
                </span>
            </div>

            {/* Title */}
            <section>
                <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
                    Businesses that trust our <span className='font-bold'>hiring solution</span>
                </div>
            </section>

            {/* Subtitle */}
            <section>
                <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto text-neutral-600'>
                    See how companies are transforming their hiring with AI
                </div>
            </section>

            {/* Carousel */}
            <section className='my-10'>
                <Carousel
                    swipeable
                    draggable
                    showDots
                    responsive={responsive}
                    ssr
                    infinite
                    autoPlay
                    autoPlaySpeed={4000}
                    keyBoardControl
                    customTransition="all .5"
                    transitionDuration={500}
                    arrows
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                      customLeftArrow={<CustomLeftArrow />}
                            customRightArrow={<CustomRightArrow />}
                    containerClass="py-16 relative"
                    dotListClass="flex justify-center mt-4"
                    itemClass="px-4 "
                >
                    {cards.map((card, index) => (
                        <div key={index} className="flex flex-col  bg-white w-11/12 mx-auto rounded-xl justify-between shadow-lg p-6 h-full">
                            {/* Top: Avatar & Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={card.image}
                                    alt={card.name}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                                <div >
                                    <h3 className="text-lg lg:text-xl font-semibold">{card.name}</h3>
                                    <p className="text-sm lg:text-md text-neutral-600">{card.position}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-neutral-500 text-lg mb-4 px-4 leading-relaxed">
                                {card.description}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-1 px-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < card.rating ? 'text-[#00A6A6]' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.964c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.783.57-1.838-.197-1.539-1.118l1.287-3.964a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.964z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </section>
        </div>
        </div>
        
    );
}

export default Customer;

import React from 'react'
import { FaCheck } from "react-icons/fa6";

function Feature() {
  return (
<div
  className="container mx-auto pt-12 pb-8 px-4 bg-contain bg-center bg-no-repeat relative z-10"

>
         {/* Left Image */}
         <div className="absolute right-0 top-0 flex flex-col gap-4">
                <img src="/images/features/right.png" alt="Image 1" className="w-64" />

            </div>
 {/* Right Image */}
            <div className="absolute left-10 bottom-0 flex flex-col gap-4">
                <img src="/images/features/right.png" alt="Image 1" className="w-64" />

            </div>
            <div className="absolute right-10 bottom-0 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
            <div className="absolute left-30 top-40 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
            <div className="absolute left-86 top-0 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
            <div className="absolute left-96 top-80 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
            <div className="absolute right-96 top-96 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
            <div className="absolute max-lg:hidden right-86 top-0 flex flex-col gap-4">
                <img src="/images/features/single.png" alt="Image 1" className="w-16" />

            </div>
      {/* Header */}
      <div className='flex justify-center items-center mb-4'>
        <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-emerald-500 '>
          Features
        </span>
      </div>

      {/* Title */}
      <section>
        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
           <span className='font-bold'>AI-Powered</span>  Hiring Solutions
        </div>
      </section>

      {/* Subtitle */}
      <section>
        <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto  text-neutral-600'>
          Advanced AI tools to revolutionize your recruitment
        </div>
      </section>

      {/* Features Section */}
      <section className=' z-10 '>
        <div className="flex max-lg:flex-col justify-between gap-8 my-8">
          {/* Section 1: AI Resume Analysis */}
          <div className="w-full lg:w-1/3 p-8 shadow-2xl rounded-2xl bg-white transform transition-transform duration-300 ease-out hover:scale-105 hover:text-white hover:bg-gradient-to-b from-[#F295BE] to-[#63A7D4]">
            <div className="flex justify-center items-center">
              <img src="/images/features/ai.png" alt="AI" className="w-20" />
            </div>
            <span className="text-xl font-semibold block mb-2 text-center mt-4">AI Resume Analysis</span>
            <span className="text-lg font-light  block mb-2 text-center mt-4">
              Advanced ML algorithms scan and evaluate resumes with 95% accuracy
            </span>
            <span className="flex flex-col items-center mt-4 space-y-3">
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Skill matching</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Experience validation</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Culture fit assessment</p>
            </span>
          </div>

          {/* Section 2: Virtual Interviews */}
          <div className="w-full lg:w-1/3  p-8 shadow-2xl rounded-2xl bg-white transform transition-transform duration-300 ease-out hover:scale-110 hover:text-white hover:bg-gradient-to-b from-[#F295BE] to-[#63A7D4]">
            <div className="flex justify-center items-center">
              <img src="/images/features/virtual.png" alt="Virtual Interviews" className="w-20" />
            </div>
            <span className="text-xl font-semibold block mb-2 text-center mt-4">Virtual Interviews</span>
            <span className="text-lg font-light  block mb-2 text-center mt-4">
              Automated video interviews with real-time analysis
            </span>
            <span className="flex flex-col items-center mt-4 space-y-3">
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Speech analysis</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Behavioral assessment</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Personality insights</p>
            </span>
          </div>

          {/* Section 3: Smart Analytics */}
          <div className="w-full lg:w-1/3 p-8 shadow-2xl rounded-2xl  bg-white transform transition-transform duration-300 ease-out hover:scale-105 hover:text-white hover:bg-gradient-to-b from-[#F295BE] to-[#63A7D4]">
            <div className="flex justify-center items-center">
              <img src="/images/features/smart.png" alt="Smart Analytics" className="w-20" />
            </div>
            <span className="text-xl font-semibold block mb-2 text-center mt-4">Smart Analytics</span>
            <span className="text-lg font-light block mb-2 text-center mt-4">
              Comprehensive hiring insights and predictions
            </span>
            <span className="flex flex-col items-center mt-4 space-y-3">
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Performance metrics</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />Success prediction</p>
              <p className="flex items-center gap-2"><FaCheck className="text-green-600" />ROI tracking</p>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Feature;

import React from 'react'
import { FaFaceSmile } from "react-icons/fa6";
import { PiSmileySadFill } from "react-icons/pi";

function Solution() {
  return (
    <div className='container relative mx-auto pt-12 pb-8 px-4 ' >
    {/* Left Column */}
    <div className="absolute left-10 top-10 flex flex-col gap-4">
        <img src="/images/solution/image1.png" alt="Image 1" className="w-96" />

    </div>
    <div className="absolute right-0 top-0 flex max-lg:hidden flex-col gap-4">
        <img src="/images/solution/image2.png" alt="Image 1" className="w-40" />

    </div>
      {/* Header */}
      <div className='flex justify-center items-center mb-4'>
        <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-emerald-500'>
          Hire Solution
        </span>
      </div>

      {/* Title */}
      <section>
        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4] text-center bg-clip-text text-transparent leading-tight pb-2'>
          <span className='font-semibold'>Traditional Hiring Methods</span> Can’t Keep Up
        </div>
      </section>

      {/* Subtitle */}
      <section>
        <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto text-neutral-600 mb-10'>
          See how our AI-powered solution outperforms traditional hiring processes
        </div>
      </section>

      {/* Main Content */}
      <div className='flex flex-col lg:flex-row items-center justify-between gap-8 relative'>
        {/* Left Image */}
        <div className='w-full lg:w-1/3 max-lg:hidden flex justify-center'>
          <img
            src="/images/traditional/girl.png"
            alt="Happy candidate"
            className="w-full max-w-xs"
          />
        </div>

        {/* Traditional Card */}
        <div className='w-full lg:w-1/3 bg-gray-100 shadow-xl rounded-xl p-6 text-center'>
          <h3 className='text-2xl font-semibold mb-4'>Traditional</h3>
          <ul className='text-left space-y-3 text-gray-700'>
            <li className='flex gap-4 bg-gray-200 p-2 rounded-full'><span><PiSmileySadFill size={24} color='orange' /></span>  Gut-driven hiring</li>
            <li className='flex gap-4 bg-gray-200 p-2 rounded-full'><span><PiSmileySadFill size={24} color='orange' /></span>  Inconsistent candidate evaluation</li>
            <li className='flex gap-4 bg-gray-200 p-2 rounded-full'><span><PiSmileySadFill size={24} color='orange' /></span>  Limited talent pool visibility</li>
            <li className='flex gap-4 bg-gray-200 p-2 rounded-full'><span><PiSmileySadFill size={24} color='orange' /></span>  Outdated skill assessments</li>
            <li className='flex gap-4 bg-gray-200 p-2 rounded-full'><span><PiSmileySadFill size={24} color='orange' /></span>  Reactive recruitment process</li>
          </ul>
        </div>

        {/* HireIn Card */}
        <div className='w-full lg:w-1/3 bg-[#0F172A] text-white rounded-xl p-6 shadow-2xl flex flex-col justify-between'>
          <img src="/images/logo/company-logo.png" alt="logo" className='w-28 mx-auto my-4'  />
          <ul className='text-left space-y-3'>
            <li className='flex gap-4 bg-[#1b2f5c] p-2 rounded-full'><span><FaFaceSmile size={20} color='cyan' /></span> Data-driven talent strategies</li>
            <li className='flex gap-4 bg-[#1b2f5c] p-2 rounded-full'><span><FaFaceSmile size={20} color='cyan' /></span>  Centralized demand-supply intelligence</li>
            <li className='flex gap-4 bg-[#1b2f5c] p-2 rounded-full'><span><FaFaceSmile size={20} color='cyan' /></span>  Talent availability analysis</li>
            <li className='flex gap-4 bg-[#1b2f5c] p-2 rounded-full'><span><FaFaceSmile size={20} color='cyan' /></span>  Dynamic skill demand forecasting</li>
            <li className='flex gap-4 bg-[#1b2f5c] p-2 rounded-full'><span><FaFaceSmile size={20} color='cyan' /></span> Predictive workforce modeling</li>
          </ul>
          <button className='mt-6 bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white py-2 px-4 rounded-full hover:scale-105 transition-all duration-300'>
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}

export default Solution;

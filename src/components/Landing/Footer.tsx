import React from 'react'
import { IoSearchOutline } from "react-icons/io5";
function Footer() {
  return (
    <div className= "container mx-auto px-4  py-10">
  {/* Top Section */}
  <div className="flex flex-col md:flex-row justify-between items-center pb-4">
    <div className="md:w-1/2 w-full  ">

        <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-tr from-[#63A7D4] via-[#F295BE] to-[#63A7D4]  bg-clip-text text-transparent leading-tight pb-2'>
        Subscribe to our newsletter!
        </div>
 
    
      <p className=" text-lg text-gray-700">
        For exclusive updates, insights, and the latest listings delivered straight to your inbox.
      </p>
    </div>
    <div className="md:w-1/2 w-full mt-6 md:mt-0 flex justify-center md:justify-end">
      <div className="relative w-full max-w-md">
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full border border-gray-200 rounded-full py-3 px-6 pr-12 shadow-md"
        />
        <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white p-2 rounded-full">
        <IoSearchOutline size={20}/>
        </button>
      </div>
    </div>
  </div>


  {/* Middle Section */}
  <div className="flex flex-col md:flex-row justify-between items-start mt-10 border-b-2 border-gray-300 pb-10">
    {/* Left 1/3 */}
    <div className="md:w-1/3 w-full mb-8 md:mb-0 flex flex-col items-center md:items-start">
      <div className="text-4xl font-bold mb-4 text-gradient-to-r from-orange-400 to-purple-600">
        <img src="/images/logo/company-logo.png" alt="company-logo" className='w-32 md:w-40 lg:w-60' />
      </div>
      <div className="flex gap-4 ">
        <a href="#"><i className="fab fa-facebook text-teal-600"></i></a>
        <a href="#"><i className="fab fa-instagram text-pink-500"></i></a>
        <a href="#"><i className="fab fa-youtube text-red-600"></i></a>
        <a href="#"><i className="fab fa-linkedin text-blue-700"></i></a>
      </div>
    </div>

    {/* Right 2/3 */}
    <div className="md:w-2/3 w-full flex max-lg:flex-col gap-6 text-lg text-gray-700 ">
    <div className='flex w-full lg:w-2/3'>
    <div className='w-1/2'>
        <h4 className="font-bold mb-2">Company</h4>
        <ul className='space-y-2'>
          <li><a href="#">About us</a></li>
          <li><a href="#">Partner program</a></li>
          <li><a href="#">Contact us</a></li>
        </ul>
      </div>
      <div className='w-1/2'>
        <h4 className="font-bold mb-2">Intelligent Tools</h4>
        <ul className='space-y-2'>
          <li><a href="#">Resume Analyzer</a></li>
          <li><a href="#">Interview Bot</a></li>
          <li><a href="#">JD Generator</a></li>
        </ul>
      </div>
    </div>
    
      <div className='w-full lg:w-1/3'>
        <h4 className="font-bold mb-2">Contact</h4>
        <ul className='space-y-2'>
          <li className="flex items-center gap-2">
            📧 <a href="mailto:support@hireln.com">support@hireln.com</a>
          </li>
          <li>Printed at ❤️ our facility in South India.</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Bottom Section */}
  <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">

    <div className="flex w-full justify-center text-center md:text-right  md:mt-0">
      © 2025 HireLn.AI, Inc. All rights reserved.
    </div>
  </div>
</div>

  )
}

export default Footer
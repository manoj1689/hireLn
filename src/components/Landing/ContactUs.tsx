import { FaUser, FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { IoChatbubblesOutline } from "react-icons/io5";

export default function ContactSection() {
  return (
    <div className='flex bg-yellow-50'>
 <div className='container mx-auto pt-12 pb-8 px-4 '>

{/* Header */}
<div className='flex justify-center items-center mb-4'>
  <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-pink-300 '>
    ContactUS
  </span>
</div>

{/* Title */}
<section>
  <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-r from-[#2a5e81] via-[#F295BE] to-[#197abb] text-center bg-clip-text text-transparent leading-tight pb-2'>
    <span className='font-bold'>Get in Touch</span> Anytime
  </div>
</section>

{/* Subtitle */}
<section>
  <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto text-neutral-600 mb-12'>
   Ready to evaluate your hiring process ? Our team is here to support your journey
  </div>
</section>

{/* Contact Section */}
<div className='flex max-lg:flex-col gap-6'>
  {/* Left: Contact Form */}
  <div className='flex flex-col w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6 md:p-8'>
    <div className='flex items-center gap-3 mb-4'>
      <div className='text-3xl p-4 rounded-full bg-purple-100 text-purple-400'><IoChatbubblesOutline /></div>
      <div>
        <h3 className='text-lg font-light'>Send us a Message</h3>
        <p className='text-md text-gray-500'>We'll get back to you within 24 hours</p>
      </div>
    </div>

    <form className='space-y-4 '>
      <label htmlFor="" className=''>Name</label>
      {/* Name */}
      <div className='relative mt-2'>
        <FaUser className='absolute top-3 left-3 text-gray-400' />
        <input
          type='text'
          placeholder='Enter your name'
          className='pl-10 w-full rounded-lg py-2 px-3 outline-none bg-gray-100 focus:bg-white'
        />
      </div>
      <label htmlFor="">Email</label>
      {/* Email */}
      <div className='relative mt-2'>
        <FaEnvelope className='absolute top-3 left-3 text-gray-400' />
        <input
          type='email'
          placeholder='Enter your email'
          className='pl-10 w-full rounded-lg py-2 px-3 outline-none bg-gray-100 focus:bg-white'
        />
      </div>
      <label htmlFor="">Message</label>
      {/* Message */}
      <div className='mt-2'>
        <textarea
          rows={4}
          placeholder='How can we help you?'
          className='w-full rounded-lg py-2 px-3 outline-none bg-gray-100 focus:bg-white  resize-none'
        />
      </div>

      <button
        type='submit'
        className='w-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-medium py-4 rounded-lg flex justify-center items-center gap-2'
      >
        Let’s Talk <FaPaperPlane />
      </button>
    </form>
  </div>

  {/* Right: Contact Info */}
  <div className='flex w-full lg:w-1/2 flex-col gap-4 justify-between'>
      <div>
         <img src="/images/contact/OfficeSpace.png" alt="Office space" className='w-full' />
      </div>
      <div className='flex w-full max-sm:flex-col gap-4'>
      <div className='bg-white rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-1/2'>
      <div className='text-3xl text-purple-400'><FaPhone /></div>
      <div>
        <h4 className='font-semibold text-sm'>Phone</h4>
        <p className='text-gray-600 text-sm'>+1 (555) 123-4567</p>
      </div>
    </div>
    <div className='bg-white rounded-xl shadow-md p-6 flex items-center gap-4 w-full sm:w-1/2'>
      <div className='text-3xl text-purple-400'><FaEnvelope /></div>
      <div>
        <h4 className='font-semibold text-sm'>Email</h4>
        <p className='text-gray-600 text-sm'>support@hireIn.ai</p>
      </div>
    </div>
      </div>
 
  </div>
</div>
</div>
    </div>
   
  );
}

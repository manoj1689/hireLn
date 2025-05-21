"use client"
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    question: "How do I schedule an AI-powered interview?",
    answer:
      "You can schedule AI interviews directly through the platform’s dashboard. The platform replaces guesswork with data-driven insights, improving hiring efficiency, reducing costs, and helping organizations stay competitive in the talent market.",
  },
  {
    question: "What are the potential risks of hiring without data-driven insights?",
    answer:
      "Hiring without data-driven insights can lead to biased decisions, higher turnover, and mismatches between candidates and job roles. It also reduces your ability to scale hiring efficiently.",
  },
  {
    question: "What key talent decisions can organizations make with the platform?",
    answer:
      "Organizations can make decisions around candidate selection, pipeline optimization, performance prediction, and diversity metrics, all backed by intelligent analytics.",
  },
  {
    question: "What are the main use cases for hiring leaders?",
    answer:
      "Use cases include screening large applicant pools, assessing soft skills, ranking top candidates, and gaining predictive performance insights.",
  },
  {
    question: "How can business leaders benefit from these use cases?",
    answer:
      "Business leaders can reduce time-to-hire, enhance team quality, and make more confident hiring decisions by leveraging real-time insights and predictive analytics.",
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index:any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='container mx-auto pt-12 pb-8 px-4'>
    {/* Header */}
    <div className='flex justify-center items-center mb-4'>
      <span className='text-md md:text-lg font-light px-8 py-1 rounded-full text-white bg-pink-300 '>
        FAQS
      </span>
    </div>

    {/* Title */}
    <section>
      <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light bg-gradient-to-tr from-[#63A7D4] to-[#F295BE]  text-center bg-clip-text text-transparent leading-tight pb-2'>
         <span className='font-bold'>AI-Hiring</span>  FAQS
      </div>
    </section>

    {/* Subtitle */}
    <section>
      <div className='text-sm sm:text-md md:text-lg lg:text-xl text-center md:w-3/4 mx-auto  text-neutral-600'>
        Advanced AI tools to revolutionize your recruitment
      </div>
    </section>

      <div className="space-y-4 my-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b-2 border-gray-200 rounded-lg">
            <button
              className="w-full flex justify-between items-center text-left px-5 py-4 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <div className=" w-5/6 font-medium text-xl text-gray-800">{faq.question}</div>
              <div className=' flex w-1/6 justify-end'>
              <div className="  text-[#00A6A6] bg-gray-100 rounded-full p-4">
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </div>
              </div>
             
            </button>
            {openIndex === index && (
              <div className="w-5/6 px-5 pb-4 text-lg text-neutral-600 transition-all duration-300">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;

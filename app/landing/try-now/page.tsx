"use client";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiSmile,
  FiZap,
} from "react-icons/fi";
import Footer from "../Footer";
import { Mic2Icon } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CandidateToJob from "./Candidate-to-Job";
import { logout } from "@/lib/slices/auth-slice";
import { useDispatch } from "react-redux";

const FreeTrialInterview = () => {
  const dispatch = useDispatch()
  const router = useRouter();
   
  const interviewDetails = [
    {
      title: "Personalized AI Questions",
      description:
        "Receive 3 carefully crafted interview questions tailored to your role and experience level, helping you practice effectively.",
      icon: <FiUserCheck className="text-blue-600" size={40} />,
    },
    {
      title: "Instant Performance Feedback",
      description:
        "Get detailed feedback immediately after each response, highlighting strengths and areas for improvement to boost your confidence.",
      icon: <FiCheckCircle className="text-green-500" size={40} />,
    },
    {
      title: "Quick & Time-efficient",
      description:
        "Complete the AI interview in under 5 minutes, making it easy to practice anytime without disrupting your schedule.",
      icon: <FiClock className="text-yellow-500" size={40} />,
    },
    {
      title: "Simulate Real Interviews",
      description:
        "Experience a realistic interview environment with our AI interviewer, helping you get comfortable with live interview scenarios.",
      icon: <FiZap className="text-purple-500" size={40} />,
    },
    {
      title: "Boost Your Confidence",
      description:
        "Practice in a stress-free environment, refine your answers, and gain the confidence needed to excel in real interviews.",
      icon: <FiSmile className="text-pink-500" size={40} />,
    },
  ];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 1 },
    desktop: { breakpoint: { max: 1280, min: 1024 }, items: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };
  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }
  return (
    <div className="min-h-screen container mx-auto flex flex-col items-center px-4 py-4">
      {/* Header */}
      <header className="w-full container mx-auto flex justify-between items-center p-4">
        <div className="lg:w-1/4 px-4">
          <img
            src="../images/logo/company-logo.png"
            alt="Company Logo"
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:scale-105 transition-all" onClick={handleLogout}>
            <FaSignOutAlt size={25} className="text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main>
        {/* Header */}
        <div></div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-sky-400 text-transparent bg-clip-text">
            Try a Free AI Interview
          </h2>
          <p className="text-lg lg:text-2xl max-w-5xl mx-auto text-gray-500 mb-6">
            Practice your interview skills with our AI-powered platform. Get
            instant feedback and improve your performance without any signup
            required.
          </p>
        </div>

        {/* Main Section */}
        <div className="w-full container bg-white shadow-md rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left: Carousel Preview */}
          <div className="bg-sky-100  flex flex-col justify-between  p-6  rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Interview Preview</h3>
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              arrows={false}
              keyBoardControl
              containerClass="carousel-container"
              itemClass="px-2"
            >
              {interviewDetails.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 p-12 my-4 bg-white rounded-xl shadow-lg"
                >
                  <div className="flex flex-col items-center gap-3">
                    {item.icon}
                    <div>
                      <h4 className="text-lg md:text-2xl font-bold text-gray-700">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base lg:text-lg mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>

          </div>
          {/* Right: Candidate-Job process */}
          <div>
            <CandidateToJob />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FreeTrialInterview;



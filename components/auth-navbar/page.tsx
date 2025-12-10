"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

function Navbar() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div
        className={`flex fixed w-full py-4 transition-all duration-300 z-50 ${
          scrolled
            ? "bg-gradient-to-r from-[#63A7D4] to-[#F295BE] shadow-md"
            : "bg-white  shadow-md"
        }`}
      >
        <div className="flex container mx-auto justify-between items-center px-4">
          {/* Left: Logo + Back to Home */}
          <div className="flex items-center gap-6">
            <img
              src="/images/logo/company-logo.png"
              alt="Company Logo"
              className="w-28"
            />
        
          </div>

          {/* Right: Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-6 ${scrolled
            ? "text-white"
            : "text-gray-500 "}`}>
            <button className="text-sm font-medium hover:underline">
              Support
            </button>
            <button className=" text-sm font-medium hover:underline">
              FAQ
            </button>
            <button className=" text-sm font-medium hover:underline">
              Contact Us
            </button>
            <button
              onClick={() => router.push("/auth/signup")}
              className="bg-white text-cyan-500 text-sm font-medium px-4 py-1 rounded-full shadow hover:bg-gray-100 transition"
            >
              Try Free
            </button>
          </div>

          {/* Toggle Button for Sidebar */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-3xl px-2 lg:hidden"
          >
            {isSidebarOpen ? (
              <FiX className="text-white" />
            ) : (
              <FiMenu className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <div
        className={`fixed top-20 right-0 w-72 h-full z-50 bg-white rounded-l-xl shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col items-center mt-6 gap-6">
          <button
            onClick={() => {
              router.push("/auth/signup");
              setIsSidebarOpen(false);
            }}
            className="text-lg rounded-full px-8 py-2 text-white bg-gradient-to-r from-[#63A7D4] to-[#F295BE] font-semibold"
          >
            Try Free
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-700 text-lg font-medium"
          >
            Support
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-700 text-lg font-medium"
          >
            FAQ
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-700 text-lg font-medium"
          >
            Contact Us
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;

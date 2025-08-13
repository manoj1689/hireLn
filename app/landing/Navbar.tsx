"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons from react-icons




function Navbar() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar
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
        className={`flex fixed w-full z-50  py-4 transition-all duration-300  ${scrolled ? " bg-gradient-to-b from-[#63A7D4] to-[#F295BE]  shadow-md" : "bg-transparent"
          }`}
      >

        <div className="flex container mx-auto justify-between items-center  ">
          {/* Logo Section */}
          <div className="lg:w-1/4 px-4">
            <img src="./images/logo/company-logo.png" alt="Company Logo" className="w-32" />
          </div>

          {/* Navigation Links (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:w-3/4 justify-end items-center lg:gap-4 xl:gap-6">
            <div className="flex flex-col items-center">
              <a href="#Home" onClick={() => setActiveSection("Home")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Home" ? "font-medium" : ""
                    }`}
                >
                  Home
                </button>
              </a>
              {activeSection === "Home" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>

            <div className="flex flex-col items-center">
              <a href="#HowItWorks" onClick={() => setActiveSection("How It Works")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "How It Works" ? "font-medium" : ""
                    }`}
                >
                  How It Works
                </button>
              </a>
              {activeSection === "How It Works" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>
            <div className="flex flex-col items-center">
              <a href="#Solutions" onClick={() => setActiveSection("Solutions")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Solutions" ? "font-medium" : ""
                    }`}
                >
                  Solutions
                </button>
              </a>
              {activeSection === "Solutions" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>


            {/* <div className="flex flex-col items-center">
              <a href="#Pricing" onClick={() => setActiveSection("Pricing")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Pricing" ? "font-medium" : ""
                    }`}
                >
                  Pricing
                </button>
              </a>
              {activeSection === "Pricing" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div> */}

            {/* <div className="flex flex-col items-center">
              <a href="#CaseStudies" onClick={() => setActiveSection("Case Studies")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Case Studies" ? "font-medium" : ""
                    }`}
                >
                  Case Studies
                </button>
              </a>
              {activeSection === "Case Studies" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div> */}

            <div className="flex flex-col items-center">
              <a href="#Blog" onClick={() => setActiveSection("Blog")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Blog" ? "font-medium" : ""
                    }`}
                >
                  Blog
                </button>
              </a>
              {activeSection === "Blog" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>


            <div className="flex flex-col items-center">
              <a href="#FAQ" onClick={() => setActiveSection("FAQ")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "FAQ" ? "font-medium" : ""
                    }`}
                >
                  FAQ
                </button>
              </a>
              {activeSection === "FAQ" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>

            <div className="flex flex-col items-center">
              <a href="#ContactUs" onClick={() => setActiveSection("Contact Us")}>
                <button
                  className={`text-white text-lg transition-all duration-300 ${activeSection === "Contact Us" ? "font-medium" : ""
                    }`}
                >
                  Contact Us
                </button>
              </a>
              {activeSection === "Contact Us" && (
                <hr className="border-2 border-white rounded-lg w-full" />
              )}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  setActiveSection("Signin");
                  router.push("/auth/login");
                }}
                className={`bg-white text-[#15B8A6] text-lg rounded-full shadow-lg px-4 py-1 hover:bg-gray-200 hover:scale-105 transition-all duration-300 ${activeSection === "Signin" ? "font-medium" : ""
                  }`}
              >
                Sign In
              </button>
            </div>
          </div>


          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-3xl px-4 show lg:hidden"
          >
            {isSidebarOpen ? (
              <FiX className="text-white" />
            ) : (
              <FiMenu className="text-white" />
            )}
          </button>

        </div>
      </div >

      {/* Sidebar */}
      <div
        className={`fixed top-20 right-0 w-72 h-full bg-gray-100 rounded-l-xl shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
      >


        {/* Sidebar Navigation Links */}
        {/* Sidebar */}
        <div
          className={`fixed top-20 right-0 w-72 h-full bg-gray-100 rounded-l-xl shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-50`}
        >
          <div className="flex flex-col items-center mt-4 gap-6">
            <a href="#Signup">
              <button
                onClick={() => {
                  setActiveSection("Signup");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg rounded-full px-8 py-2 text-white bg-gradient-to-r from-[#63A7D4] to-[#F295BE] font-medium transition-all duration-300 ${activeSection === "Signup" ? "font-bold" : "font-semibold"
                  }`}
              >
                Signup/Login
              </button>
            </a>

            <a href="#Home">
              <button
                onClick={() => {
                  setActiveSection("Home");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "Home" ? "font-bold text-pink-300" : "text-gray-700"
                  }`}
              >
                Home
              </button>
            </a>

            <a href="#HowItWorks">
              <button
                onClick={() => {
                  setActiveSection("How It Works");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "How It Works" ? "font-bold text-pink-300" : "text-gray-700"
                  }`}
              >
                How It Works
              </button>
            </a>

            <a href="#Solutions">
              <button
                onClick={() => {
                  setActiveSection("Solutions");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "Solutions" ? "font-bold text-pink-300" : "text-gray-700"
                  }`}
              >
                Solutions
              </button>
            </a>

            <a href="#Blog">
              <button
                onClick={() => {
                  setActiveSection("Blog");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "Blog" ? "font-bold text-pink-300" : "text-gray-700"
                  }`}
              >
                Blog
              </button>
            </a>

            <a href="#FAQ">
              <button
                onClick={() => {
                  setActiveSection("FAQ");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "FAQ"
                    ? "font-bold text-pink-300 border-b-2 border-pink-300"
                    : "text-gray-700"
                  }`}
              >
                FAQ
              </button>
            </a>

            <a href="#ContactUs">
              <button
                onClick={() => {
                  setActiveSection("Contact Us");
                  setIsSidebarOpen(false);
                }}
                className={`text-lg font-medium transition-all duration-300 ${activeSection === "Contact Us" ? "font-bold text-pink-300" : "text-gray-700"
                  }`}
              >
                Contact Us
              </button>
            </a>
          </div>
        </div>

      </div >

    </>
  );
}

export default Navbar;

"use client"
import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons from react-icons
import Login from "../Landing/Login"
function Navbar() {
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
        className={`flex fixed w-full  py-4 transition-all duration-300 z-50 ${scrolled ? " bg-gradient-to-b from-[#63A7D4] to-[#F295BE]  shadow-md" : "bg-transparent"
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
              <button
                onClick={() => setActiveSection("Home")}
                className={`text-white text-lg   transition-all duration-300 ${activeSection === "Home" ? "font-medium" : ""
                  }`}
              >
                Home
              </button>
              {activeSection === "Home" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveSection("How It Works")}
                className={`text-white text-lg  transition-all duration-300 ${activeSection === "How It Works" ? "font-medium" : ""
                  }`}
              >
                How It Works
              </button>
              {activeSection === "How It Works" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveSection("Pricing")}
                className={`text-white text-lg   transition-all duration-300 ${activeSection === "Pricing" ? "font-medium" : ""
                  }`}
              >
                Pricing
              </button>
              {activeSection === "Pricing" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveSection("Case Studies")}
                className={`text-white text-lg  transition-all duration-300 ${activeSection === "Case Studies" ? "font-medium" : ""
                  }`}
              >
                Case Studies
              </button>
              {activeSection === "Case Studies" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveSection("FAQ")}
                className={`text-white text-lg transition-all duration-300 ${activeSection === "FAQ" ? "font-medium" : ""
                  }`}
              >
                FAQ
              </button>
              {activeSection === "FAQ" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => setActiveSection("Contact Us")}
                className={`text-white text-lg   transition-all duration-300 ${activeSection === "Contact Us" ? "font-medium" : ""
                  }`}
              >
                Contact Us
              </button>
              {activeSection === "Contact Us" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>
            <div>

            </div>
            <div className="flex flex-col items-center">
              {/* <button
                onClick={() => setActiveSection("Signup")}
                className={`text-white text-lg  transition-all duration-300 ${
                  activeSection === "Signup" ? "font-medium" : ""
                }`}
              >
                Signup
              </button> */}
              <div>
                <Login />
              </div>
              {activeSection === "Signup" && <hr className="border-2 border-white rounded-lg w-full" />}
            </div>

          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-3xl px-4 show min-lg:hidden"
          >
            {isSidebarOpen ? (
              <FiX className="text-white" />
            ) : (
              <FiMenu className="text-white" />
            )}
          </button>

        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-20 right-0 w-72 h-full z-100 bg-gray-100 rounded-l-xl shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
      >


        {/* Sidebar Navigation Links */}
        <div className="flex flex-col items-center mt-4  gap-6">
          <button
            onClick={() => {
              setActiveSection("Signup");
              setIsSidebarOpen(false);
            }}
            className={`text-lg rounded-full px-8 py-2 text-white bg-gradient-to-r from-[#63A7D4] to-[#F295BE]  font-medium transition-all duration-300 ${activeSection === "Signup"
              ? "font-bold "
              : "font-semibold"
              }`}
          >
            Signup/Login
          </button>


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

          <button
            onClick={() => {
              setActiveSection("Pricing");
              setIsSidebarOpen(false);
            }}
            className={`text-lg font-medium transition-all duration-300 ${activeSection === "Pricing" ? "font-bold text-pink-300" : "text-gray-700"
              }`}
          >
            Pricing
          </button>

          <button
            onClick={() => {
              setActiveSection("Case Studies");
              setIsSidebarOpen(false);
            }}
            className={`text-lg font-medium transition-all duration-300 ${activeSection === "Case Studies" ? "font-bold text-pink-300" : "text-gray-700"
              }`}
          >
            Case Studies
          </button>

          <button
            onClick={() => {
              setActiveSection("FAQ");
              setIsSidebarOpen(false);
            }}
            className={`text-lg font-medium transition-all duration-300 ${activeSection === "FAQ" ? "font-bold text-pink-300 border-b-2 border-pink-300" : "text-gray-700"
              }`}
          >
            FAQ
          </button>

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
        </div>
      </div>

    </>
  );
}

export default Navbar;

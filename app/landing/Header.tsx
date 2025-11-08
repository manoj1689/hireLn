"use client";
import FirebaseTryNowButton from "@/components/firebase/FirebaseTryNowButton";
import GuestTryNowButton from "@/components/firebase/GuestTryNowButton";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  return (
    <>
      {/* Header Section */}
      <div
        id="Home"
        className="flex w-full bg-gradient-to-r from-[#63A7D4] to-[#F295BE]"
      >
        <div className="flex max-lg:flex-col container w-full h-auto mx-auto pt-24 lg:pt-32 px-4">
          {/* Left Section */}
          <div
            className="flex flex-col w-full lg:w-1/2 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/header/headerleftimage.png')",
            }}
          >
            <section>
              <section>
                <span className="px-4 py-2 bg-[#FF993F] text-xs sm:text-md lg:text-lg rounded-full">
                  Welcome to <span className="font-semibold">HireLane</span> –
                  Your AI Hiring Assistant
                </span>
              </section>

              <section className="my-4 space-x-4">
                <span className="text-3xl lg:text-4xl xl:text-5xl font-medium text-white leading-snug">
                  Transform Your Hiring with
                </span>{" "}
                <span className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-snug">
                  AI-Powered Intelligence
                </span>
              </section>

              <section className="flex w-5/6">
                <span className="space-x-2">
                  <span className="text-md sm:text-lg font-bold text-white ">
                    Revolutionize Hiring with AI
                  </span>
                  <span className="text-md sm:text-lg font-light text-white ">
                    Automate screening, conduct smart interviews, and make
                    data-driven hiring decisions—efficient, fast, and
                    effortless.
                  </span>
                </span>
              </section>
            </section>

            {/* Buttons */}
            <section className="flex w-full mx-auto flex-col justify-start mt-8">
              <section className="flex gap-5">
                <div>
               <GuestTryNowButton/> 
                </div>
                <button
                  onClick={onOpenModal}
                  className="flex gap-2 px-4 py-2 border border-white rounded-md text-md md:text-lg text-white justify-center items-center hover:bg-gray-100 hover:text-[#15B8A6] transition-all"
                >
                  <FaRegPlayCircle /> <span>Watch Demo</span>
                </button>
              </section>

              {/* Stats */}
              <section className="flex w-full xl:w-2/3 mt-8 bg-gray-100 py-4 my-8 rounded-2xl">
                <div className="w-1/3 flex flex-col justify-center items-center">
                  <div className="text-lg md:text-2xl lg:text-3xl font-light text-[#15B8A6]">
                    85%
                  </div>
                  <div className="text-md md:text-lg font-light">
                    Faster Hiring
                  </div>
                </div>
                <div className="w-1/3 flex flex-col justify-center items-center border-l-2 border-gray-300">
                  <div className="text-lg md:text-2xl lg:text-3xl font-light text-[#15B8A6]">
                    95%
                  </div>
                  <div className="text-md md:text-lg text-center font-light">
                    Accuracy Rate
                  </div>
                </div>
                <div className="w-1/3 flex flex-col justify-center items-center border-l-2 border-gray-300">
                  <div className="text-lg md:text-2xl lg:text-3xl font-light text-[#15B8A6]">
                    60%
                  </div>
                  <div className="text-md md:text-lg text-center font-light">
                    Cost Reduction
                  </div>
                </div>
              </section>
            </section>
          </div>

          {/* Right Section Image */}
          <div className="flex w-full h-full items-end max-lg:hidden lg:w-1/2">
            <div>
              <img src="/images/header/headerrightimage.png" alt="girl" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Video Modal using react-responsive-modal */}
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        closeOnOverlayClick
        showCloseIcon
        classNames={{
          modal:
            "container rounded-2xl overflow-hidden p-0 bg-transparent shadow-lg",
        }}
        styles={{
          modal: {
            padding: "0px", // ✅ Removes internal modal padding
            background: "transparent", // Optional: keep transparent background
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)", // Optional custom shadow
            borderRadius: "16px", // Optional rounded corners
          },
        }}
      >
        <div className="bg-white rounded-2xl  overflow-hidden shadow-xl">
          <iframe
            className="w-full h-[60vh] rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="HireLane Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </>
  );
}

export default Header;

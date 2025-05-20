// components/CustomArrows.tsx
import React from 'react';
import { HiChevronLeft,HiChevronRight } from "react-icons/hi2";
interface ArrowProps {
  onClick?: () => void;
}

export const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-500"
      aria-label="Previous"
    >
      {/* Left Arrow Icon */}
      <HiChevronLeft  size={40}/>
     
    </button>
  );
};

export const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-500"
      aria-label="Next"
    >
      {/* Right Arrow Icon */}
      <HiChevronRight size={40}/>
    </button>
  );
};

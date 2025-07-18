// SubmitButton.jsx
import React from 'react';

const SubmitButton = ({ onClick, isDisabled, buttonText = 'Submit' }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
     
      className={`px-4 py-2 font-thin  rounded-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isDisabled
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {buttonText}
    </button>
  );
};

export default SubmitButton;

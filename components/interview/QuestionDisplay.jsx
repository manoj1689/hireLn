// QuestionDisplay.jsx
import React from 'react';

const QuestionDisplay = ({ questionText }) => {
  if (!questionText) {
    return (
      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-400 rounded-lg bg-gray-50 text-gray-700">
        Loading question...
      </div>
    );
  }

  return (
    <>
    <div className='space-y-2'>
       <div >
     {questionText}
    </div>

    </div>
   
    </>
 
  );
};

export default QuestionDisplay;

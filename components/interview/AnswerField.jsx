// AnswerField.jsx
import React from 'react';

const AnswerField = ({ value, onChange, placeholder, charLimit, disabled }) => {
  const remainingChars = charLimit - value.length;

  return (
    <div className="space-y-2">
      <textarea
        className="w-full h-[300px]  p-2 border rounded-lg resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-lightblue-500 focus:border-transparent"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={charLimit}
        onCopy={(e) => e.preventDefault()} // Prevent copying
        onPaste={(e) => e.preventDefault()} // Prevent pasting
        rows={4}
        disabled={disabled}
      />
      <div
        className={`text-sm font-medium ${
          remainingChars < 10 ? 'text-red-500' : 'text-gray-600'
        }`}
      >
        {remainingChars} characters remaining
      </div>
    </div>
  );
};

export default AnswerField;

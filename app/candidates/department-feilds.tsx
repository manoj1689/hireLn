"use client";

import React from "react";
import { Check, Cross } from "lucide-react"; // optional: replace with any check icon or emoji
import { CloseButton } from "react-toastify";

const departmentEducationFields: Record<string, string[]> = {
  engineering: [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Software Engineering",
    "Information Technology",
  ],
  product: [
    "Product Management",
    "Business Administration",
    "Computer Science",
    "Marketing",
  ],
  design: [
    "Graphic Design",
    "UX/UI Design",
    "Industrial Design",
    "Visual Communication",
    "Interaction Design",
  ],
  marketing: [
    "Marketing",
    "Advertising",
    "Public Relations",
    "Digital Media",
    "Communications",
  ],
  sales: ["Business Administration", "Marketing", "Commerce", "Economics"],
  hr: [
    "Human Resource Management",
    "Business Administration",
    "Organizational Psychology",
    "Industrial Relations",
  ],
  finance: [
    "Finance",
    "Accounting",
    "Economics",
    "Business Administration",
    "Banking",
  ],
  operations: [
    "Operations Management",
    "Supply Chain Management",
    "Industrial Engineering",
    "Logistics",
    "Business Administration",
  ],
};

interface DepartmentFieldsProps {
  department: string;
  value: string;
  onChange: (value: string) => void;
}

const DepartmentFields: React.FC<DepartmentFieldsProps> = ({
  department,
  value,
  onChange,
}) => {
  if (!department) {
    return (
      <div className="flex flex-col w-full h-full justify-center items-center  text-gray-500 font-semibold text-xl py-2">
       <span></span><Cross/> <span>Choose an education department </span>
      </div>
    );
  }

  const fields = departmentEducationFields[department.toLowerCase()] || [];

  return (
    <div className=" flex flex-col justify-center bg-sky-50 p-4 shadow-lg ">
      <label className="block mb-2 text-lg font-medium">Education Field (Optional)</label>
      <ul className="space-y-2 list-none">
        {fields.map((field, idx) => {
          const selected = field === value;
          return (
            <li
              key={idx}
              className={`flex items-center justify-between px-4 py-2 rounded cursor-pointer transition ${
                selected
                  ? "bg-blue-100 text-blue-800 font-semibold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => onChange(field)}
            >
              <span>{field}</span>
              {selected && <Check className="w-4 h-4 text-blue-600" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DepartmentFields;

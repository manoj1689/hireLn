"use client";

import React, { useState, useEffect } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { submitBasicInfo } from "@/lib/slices/job/jobBasicInfo-slice";
import { JobStep1Request } from "@/interface/jobsteps";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Select from "react-select";

const departmentOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
];

const employmentOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "INTERN", label: "Internship" },
];

const salaryPeriodOptions = [
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "hourly", label: "Hourly" },
];

interface BasicInfoStepProps {
  onSuccess: () => void;
}

function BasicInfoStep({ onSuccess }: BasicInfoStepProps) {
  const dispatch: AppDispatch = useDispatch();

  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  const [formData, setFormData] = useState<JobStep1Request>({
    jobTitle: "",
    department: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: 0,
    salaryMax: 0,
    salaryPeriod: "yearly",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const location = [country, region].filter(Boolean).join(", ");
    setFormData((prev) => ({ ...prev, location }));
  }, [country, region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (formData.salaryMin == null || isNaN(formData.salaryMin) || formData.salaryMin < 0)
      newErrors.salaryMin = "Min salary must be non-negative";
    if (formData.salaryMax == null || isNaN(formData.salaryMax) || formData.salaryMax <= formData.salaryMin)
      newErrors.salaryMax = "Max salary must be greater than Min";
    if (!formData.salaryPeriod) newErrors.salaryPeriod = "Salary period is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    await dispatch(submitBasicInfo(formData));
    onSuccess();
  };

  const resetForm = () => {
    setCountry('');
    setRegion('');
    setFormData({
      jobTitle: "",
      department: "",
      location: "",
      employmentType: "FULL_TIME",
      salaryMin: 0,
      salaryMax: 0,
      salaryPeriod: "yearly",
    });
    setErrors({});
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Job Title */}
        <div className="space-y-2 lg:w-1/2">
          <Label htmlFor="jobTitle" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Title
          </Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Frontend Developer"
            value={formData.jobTitle}
            onChange={handleChange}
          />
          {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
        </div>

        {/* Department */}
        <div className="space-y-2 lg:w-1/2">
          <Label htmlFor="department" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Department
          </Label>
          <Select
            options={departmentOptions}
            value={departmentOptions.find((opt) => opt.value === formData.department)}
            onChange={(selected) => setFormData((prev) => ({ ...prev, department: selected?.value || "" }))}
            placeholder="Select department"
          />
          {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </Label>
        <div className="flex flex-col md:flex-row gap-4">
          <CountryDropdown
            value={country}
            onChange={(val) => {
              setCountry(val);
              if (!val) setRegion('');
            }}
            className="w-full md:w-1/2 border border-input bg-background px-3 py-2 text-sm rounded"
          />
          <RegionDropdown
            country={country}
            value={region}
            onChange={(val) => setRegion(val)}
            className="w-full md:w-1/2 border border-input bg-background px-3 py-2 text-sm rounded"
          />
        </div>
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>
       {/* Salary Range */}
        <div className="space-y-2 ">
          <Label className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Salary Range
          </Label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              placeholder="Min"
              type="number"
              value={formData.salaryMin || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, salaryMin: Number(e.target.value) }))}
            />
            <span className="text-sm">-</span>
            <Input
              placeholder="Max"
              type="number"
              value={formData.salaryMax || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, salaryMax: Number(e.target.value) }))}
            />
            <Select
              options={salaryPeriodOptions}
              value={salaryPeriodOptions.find((opt) => opt.value === formData.salaryPeriod)}
              onChange={(selected) =>
                setFormData((prev) => ({
                  ...prev,
                  salaryPeriod: (selected?.value as JobStep1Request["salaryPeriod"]) ?? "yearly",
                }))
              }
              className="min-w-[140px]"
            />
          </div>
          {(errors.salaryMin || errors.salaryMax || errors.salaryPeriod) && (
            <div className="text-red-500 text-sm space-y-1">
              {errors.salaryMin && <p>{errors.salaryMin}</p>}
              {errors.salaryMax && <p>{errors.salaryMax}</p>}
              {errors.salaryPeriod && <p>{errors.salaryPeriod}</p>}
            </div>
          )}
        </div>
      {/* Employment & Salary */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Employment Type */}
        <div className="space-y-2 lg:w-1/2">
          <Label htmlFor="employmentType" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Employment Type
          </Label>
          <Select
            options={employmentOptions}
            value={employmentOptions.find((opt) => opt.value === formData.employmentType)}
            onChange={(selected) =>
              selected?.value &&
              setFormData((prev) => ({ ...prev, employmentType: selected.value as JobStep1Request["employmentType"] }))
            }
            placeholder="Select employment type"
          />
          {errors.employmentType && <p className="text-red-500 text-sm">{errors.employmentType}</p>}
        </div>

       
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4 lg:pt-8">
        <Button type="button" variant="secondary" onClick={resetForm}>
          Reset
        </Button>
        <Button type="submit" variant="default">
          Continue
        </Button>
      </div>
    </form>
  );
}

export default BasicInfoStep;

'use client';
import React, { useState } from 'react';
import Select from 'react-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDispatch } from 'react-redux';
import { submitBasicInfo, resetBasicInfo } from '@/lib/slices/job/jobBasicInfo-slice';
import { AppDispatch } from '@/lib/store';
import { JobStep1Request } from '@/interface/jobsteps';

const departmentOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

const employmentOptions = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'INTERN', label: 'Internship' },
];

const salaryPeriodOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'hourly', label: 'Hourly' },
];

interface BasicInfoStepProps {
  onSuccess: () => void;
}

function BasicInfoStep({ onSuccess }: BasicInfoStepProps) {
  const dispatch: AppDispatch = useDispatch();
  
  // Define the initial state for form data
  const initialFormData: JobStep1Request = {
    jobTitle: '',
    department: '',
    location: '',
    employmentType: 'FULL_TIME', // Provide default values or handle nulls conditionally
    salaryMin: 0,
    salaryMax: 0,
    salaryPeriod: 'yearly',
  };

  const [formData, setFormData] = useState<JobStep1Request>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.salaryMin) newErrors.salaryMin = 'Min salary is required';
    else if (isNaN(Number(formData.salaryMin)) || Number(formData.salaryMin) < 0)
      newErrors.salaryMin = 'Min salary must be a non-negative number';
    if (!formData.salaryMax) newErrors.salaryMax = 'Max salary is required';
    else if (isNaN(Number(formData.salaryMax)) || Number(formData.salaryMax) <= Number(formData.salaryMin))
      newErrors.salaryMax = 'Max salary must be greater than min';
    if (!formData.salaryPeriod) newErrors.salaryPeriod = 'Salary period is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload: JobStep1Request = {
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
      };
      console.log("payload of first step", payload);
      await dispatch(submitBasicInfo(payload));
      onSuccess(); // ✅ Move to next step
    }
  };

  // Reset function to clear form data and errors
  const resetForm = () => {
    setFormData(initialFormData); // Reset form data
    setErrors({}); // Clear errors
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input id="jobTitle" placeholder="e.g. Senior Frontend Developer" value={formData.jobTitle} onChange={handleChange} />
        {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          id="department"
          options={departmentOptions}
          value={departmentOptions.find(opt => opt.value === formData.department)}
          onChange={(selected) => setFormData({ ...formData, department: selected?.value || '' })}
          placeholder="Select department"
        />
        {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="e.g. San Francisco, CA" value={formData.location} onChange={handleChange} />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employmentType">Employment Type</Label>
        <Select
          id="employmentType"
          options={employmentOptions}
          value={employmentOptions.find(opt => opt.value === formData.employmentType)}
          onChange={(selected) => {
            if (selected?.value) {
              setFormData({ ...formData, employmentType: selected.value as JobStep1Request['employmentType'] });
            }
          }}
          placeholder="Select employment type"
        />
        {errors.employmentType && <p className="text-red-500 text-sm">{errors.employmentType}</p>}
      </div>

      <div className="space-y-2">
        <Label>Salary Range</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">$</span>
            <Input
              placeholder="Min"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
            />
          </div>
          <span className="text-sm">-</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">$</span>
            <Input
              placeholder="Max"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
            />
          </div>
          <Select
            className="w-[140px]"
            options={salaryPeriodOptions}
            value={salaryPeriodOptions.find(opt => opt.value === formData.salaryPeriod)}
            onChange={(selected) =>
              setFormData({
                ...formData,
                salaryPeriod: (selected?.value as 'yearly' | 'monthly' | 'weekly' | 'hourly') ?? 'yearly',
              })
            }
            placeholder="Period"
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
      
      <div className="flex w-full justify-between">
        <button type="button" onClick={resetForm} className="bg-green-600 text-white py-2 px-4 rounded">
          Reset
        </button>
        <button type="submit" className="bg-cyan-600 text-white py-2 px-4 rounded">
          Continue
        </button>
      </div>
    </form>
  );
}

export default BasicInfoStep;


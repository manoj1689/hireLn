"use client";

import React, { useState, useEffect } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { submitBasicInfo } from "@/lib/slices/job/jobBasicInfo-slice";
import { JobStep1Request } from "@/interface/jobsteps";

import {
  fetchSkillSuggestions,
  fetchSkillSuggestionsByDept,
  updateSkillSuggestion,
  deleteSkillSuggestion,
} from "@/lib/slices/skill_suggestion/skill-suggestion-slice";

import { Briefcase, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import ReactSelect from "react-select";

// ------------------------------
//    SALARY PERIOD OPTIONS
// ------------------------------
const salaryPeriodOptions = [
  { value: "yearly", label: "Yearly" },
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "daily", label: "Daily" },
];

// ------------------------------
//    EMPLOYMENT TYPE OPTIONS
// ------------------------------
const employmentOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "TEMPORARY", label: "Temporary" },
];

interface BasicInfoStepProps {
  onSuccess: () => void;
}

function BasicInfoStep({ onSuccess }: BasicInfoStepProps) {
  const dispatch: AppDispatch = useDispatch();

  const {
    departments,
    suggestions,
    loading: skillLoading,
  } = useSelector((state: RootState) => state.skillSuggestions);

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");

  const [department, setDepartment] = useState<{
    value: string;
    label: string;
    skillSuggestionId: string;
  } | null>(null);

  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState<JobStep1Request>({
    jobTitle: "",
    department: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: 0,
    salaryMax: 0,
    salaryPeriod: "yearly",
    requiredSkills: [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ----------------------------
  //   FETCH DEPARTMENTS
  // ----------------------------
  useEffect(() => {
    dispatch(fetchSkillSuggestions());
  }, [dispatch]);

  const departmentOptions =
    departments?.map((dept) => ({
      value: dept.name,
      label: dept.name,
      skillSuggestionId: dept.id,
    })) || [];

  // ----------------------------
  //   HANDLE DEPARTMENT CHANGE
  // ----------------------------
  const handleDepartmentChange = async (selected: any) => {
    setDepartment(selected);
    setTechnicalSkills([]);
    setSkillInput("");

    setFormData((p) => ({ ...p, department: selected?.value || "" }));

    if (selected?.skillSuggestionId) {
      await dispatch(fetchSkillSuggestionsByDept(selected.skillSuggestionId));
    }
  };

  // ----------------------------
  //   SKILL SUGGESTIONS
  // ----------------------------
  const suggestionList = Array.isArray(suggestions)
    ? suggestions
    : suggestions?.suggestions || [];

  const skillOptions = suggestionList.map((skill: string) => ({
    value: skill,
    label: skill,
  }));

  const handleSkillSelect = (selected: any) => {
    const newSkills = selected ? selected.map((s: any) => s.value) : [];
    setTechnicalSkills(newSkills);
    setFormData((p) => ({ ...p, requiredSkills: newSkills }));
  };

  // ----------------------------
  //   ADD NEW SKILL
  // ----------------------------
  const handleAddNewSuggestion = async () => {
    if (!department?.skillSuggestionId || !skillInput.trim()) return;

    const trimmed = skillInput.trim();

    if (
      suggestionList.some(
        (s: string) => s.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      toast.info("Skill already exists.");
      return;
    }

    try {
      setUpdating(true);

      const updated = [...suggestionList, trimmed];

      await dispatch(
        updateSkillSuggestion({
          id: department.skillSuggestionId,
          data: { suggestions: updated },
        })
      ).unwrap();

      toast.success("Skill added");

      setTechnicalSkills((prev) => [...prev, trimmed]);

      setFormData((p) => ({
        ...p,
        requiredSkills: [...p.requiredSkills, trimmed],
      }));

      setSkillInput("");

      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } finally {
      setUpdating(false);
    }
  };

  // ----------------------------
  //   DELETE SKILL
  // ----------------------------
  const handleDeleteSkill = async (skill: string) => {
    if (!department?.skillSuggestionId) return;

    try {
      setUpdating(true);

      await dispatch(
        deleteSkillSuggestion({
          id: department.skillSuggestionId,
          skill,
        })
      ).unwrap();

      toast.success("Skill deleted");

      setTechnicalSkills((prev) => prev.filter((s) => s !== skill));

      setFormData((p) => ({
        ...p,
        requiredSkills: p.requiredSkills.filter((s) => s !== skill),
      }));

      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } finally {
      setUpdating(false);
    }
  };

  // Custom Option UI
  const CustomOption = (props: any) => {
    const skill = props.data.value;
    return (
      <components.Option {...props}>
        <div className="flex justify-between items-center">
          <span>{skill}</span>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSkill(skill);
            }}
          >
            ✕
          </button>
        </div>
      </components.Option>
    );
  };

  // ----------------------------
  //   AUTO UPDATE LOCATION FIELD
  // ----------------------------
  useEffect(() => {
    const location = [country, region].filter(Boolean).join(", ");
    setFormData((prev) => ({ ...prev, location }));
  }, [country, region]);

  // ----------------------------
  //   FORM VALIDATION
  // ----------------------------
  const validate = () => {
    const err: any = {};

    if (!formData.jobTitle) err.jobTitle = "Job title required";
    if (!formData.department) err.department = "Department required";
    if (!formData.location) err.location = "Location required";
    if (technicalSkills.length === 0)
      err.skills = "Add at least one required skill";

    // salary validation
    if (!formData.salaryMin) err.salaryMin = "Enter min salary";
    if (!formData.salaryMax) err.salaryMax = "Enter max salary";
    if (formData.salaryMax < formData.salaryMin)
      err.salaryMax = "Max should be greater than Min";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ----------------------------
  //   SUBMIT FORM
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await dispatch(submitBasicInfo(formData));
    onSuccess();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Job Title */}
      <div className="space-y-2">
        <Label>Job Title</Label>
        <Input
          id="jobTitle"
          value={formData.jobTitle}
          onChange={(e) =>
            setFormData({ ...formData, jobTitle: e.target.value })
          }
          placeholder="e.g. Frontend Developer"
        />
        {errors.jobTitle && (
          <p className="text-red-500 text-sm">{errors.jobTitle}</p>
        )}
      </div>

      {/* Department */}
      <div>
        <Label>Department</Label>
        <ReactSelect
          placeholder={skillLoading ? "Loading..." : "Select Department"}
          options={departmentOptions}
          value={department}
          onChange={handleDepartmentChange}
        />
        {errors.department && (
          <p className="text-red-500 text-sm">{errors.department}</p>
        )}
      </div>

      {/* Skills */}
      {department && (
        <div className="space-y-3 mt-4">
          <Label>Technical Skills</Label>
          <ReactSelect
            isMulti
            options={skillOptions}
            components={{ Option: CustomOption }}
            value={technicalSkills.map((s) => ({ value: s, label: s }))}
            onChange={handleSkillSelect}
            onInputChange={(input, action) => {
              if (action.action === "input-change") setSkillInput(input);
            }}
            placeholder="Select or type to add new skill"
            noOptionsMessage={() => null}
          />

          {errors.skills && (
            <p className="text-red-500 text-sm">{errors.skills}</p>
          )}

          {/* Add new skill */}
          {skillInput &&
            !suggestionList.some(
              (s: string) => s.toLowerCase() === skillInput.toLowerCase()
            ) && (
              <div className="flex mt-2">
                <Input
                  className="w-auto h-8 max-w-32 rounded-l-full"
                  placeholder="New skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      await handleAddNewSuggestion();
                    }
                  }}
                />
                <Button
                  className="rounded-l-none h-8 rounded-r-full"
                  type="button"
                  onClick={handleAddNewSuggestion}
                  disabled={updating || !skillInput.trim() || !department}
                >
                  {updating ? "Saving..." : "Update Skill"}
                </Button>
              </div>
            )}
        </div>
      )}

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="flex gap-4">
          <CountryDropdown
            value={country}
            onChange={(val) => setCountry(val)}
            className="border px-3 py-2 rounded w-1/2"
          />
          <RegionDropdown
            country={country}
            value={region}
            onChange={(val) => setRegion(val)}
            className="border px-3 py-2 rounded w-1/2"
          />
        </div>
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
      </div>

      {/* Salary Range */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Salary Range
        </Label>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Min"
            type="number"
            value={formData.salaryMin || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salaryMin: Number(e.target.value),
              }))
            }
          />

          <span className="text-sm">-</span>

          <Input
            placeholder="Max"
            type="number"
            value={formData.salaryMax || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                salaryMax: Number(e.target.value),
              }))
            }
          />

          <Select
            options={salaryPeriodOptions}
            value={salaryPeriodOptions.find(
              (opt) => opt.value === formData.salaryPeriod
            )}
            onChange={(selected) =>
              setFormData((prev:any) => ({
                ...prev,
                salaryPeriod: selected?.value || "yearly",
              }))
            }
            className="min-w-[140px]"
          />
        </div>

        {(errors.salaryMin || errors.salaryMax) && (
          <div className="text-red-500 text-sm space-y-1">
            {errors.salaryMin && <p>{errors.salaryMin}</p>}
            {errors.salaryMax && <p>{errors.salaryMax}</p>}
          </div>
        )}
      </div>

      {/* Employment Type */}
      <div className="space-y-2 lg:w-1/2">
        <Label className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> Employment Type
        </Label>
        <Select
          options={employmentOptions}
          value={employmentOptions.find(
            (opt) => opt.value === formData.employmentType
          )}
          onChange={(selected) =>
            setFormData((prev) => ({
              ...prev,
              employmentType:
                (selected?.value as JobStep1Request["employmentType"]) ||
                "FULL_TIME",
            }))
          }
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}

export default BasicInfoStep;

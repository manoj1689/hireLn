"use client";

import { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { createJob } from "@/lib/slices/job/create-guest-job-slice";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import AddGuestCandidatePage from "@/app/landing/try-now/guest-candidate";
import {
  fetchSkillSuggestions,
  fetchSkillSuggestionsByDept,
  updateSkillSuggestion,
  deleteSkillSuggestion,
} from "@/lib/slices/skill_suggestion/skill-suggestion-slice";
import { Input } from "@/components/ui/input";
import ReactSelect from "react-select";
import { Label } from "@/components/ui/label";

enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  TEMPORARY = "TEMPORARY",
  INTERNSHIP = "INTERNSHIP",
}
enum SalaryPeriod {
  yearly = "yearly",
  monthly = "monthly",
  weekly = "weekly",
  hourly = "hourly",
}

export default function JobStepper() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [job, setJob] = useState({
    title: "",
    department: "",
    skills: [] as string[],
    description: "",
    education: "",
    languages: [] as { language: string; level: string }[],
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    salaryMin: 100000,
    salaryMax: 200000,
    salaryPeriod: SalaryPeriod.yearly,
  });

  const { singleCandidate } = useSelector(
    (state: RootState) => state.candidate
  );
  const { loading: jobLoading } = useSelector(
    (state: RootState) => state.createJob
  );
  const {
    departments,
    suggestions,
    loading: skillLoading,
  } = useSelector((state: RootState) => state.skillSuggestions);

  const [department, setDepartment] = useState<{
    value: string;
    label: string;
    skillSuggestionId: string;
  } | null>(null);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch all departments
  useEffect(() => {
    dispatch(fetchSkillSuggestions());
  }, [dispatch]);

  // ✅ Department dropdown options
  const departmentOptions =
    departments?.map((dept) => ({
      value: dept.name,
      label: dept.name,
      skillSuggestionId: dept.id,
    })) || [];

  // ✅ Handle department change
  const handleDepartmentChange = async (selected: any) => {
    setDepartment(selected);
    setTechnicalSkills([]);
    setSkillInput("");
    setJob({ ...job, department: selected?.value || "" });
    if (selected?.skillSuggestionId) {
      await dispatch(fetchSkillSuggestionsByDept(selected.skillSuggestionId));
    }
  };

  // ✅ Get skill suggestions for department
  const suggestionList = Array.isArray(suggestions)
    ? suggestions
    : suggestions?.suggestions || [];

  const skillOptions = suggestionList.map((skill: string) => ({
    value: skill,
    label: skill,
  }));

  // ✅ Handle skill selection
  const handleSkillSelect = (selected: any) => {
    const newSkills = selected ? selected.map((s: any) => s.value) : [];
    setTechnicalSkills(newSkills);
    setJob({ ...job, skills: newSkills });
  };

  // ✅ Add new skill to backend
  const handleAddNewSuggestion = async () => {
    if (!department?.skillSuggestionId || !skillInput.trim()) return;
    const trimmedSkill = skillInput.trim();

    if (
      suggestionList.some(
        (s: string) => s.toLowerCase() === trimmedSkill.toLowerCase()
      )
    ) {
      toast.info("Skill already exists in suggestions.");
      return;
    }

    try {
      setUpdating(true);
      const updatedSuggestions = [...suggestionList, trimmedSkill];
      await dispatch(
        updateSkillSuggestion({
          id: department.skillSuggestionId,
          data: { suggestions: updatedSuggestions },
        })
      ).unwrap();

      toast.success("New skill added successfully ✅");
      setTechnicalSkills((prev) => [...prev, trimmedSkill]);
      setJob({ ...job, skills: [...technicalSkills, trimmedSkill] });
      setSkillInput("");
      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } catch (err) {
      console.error("Failed to add new skill suggestion:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete skill suggestion
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

      toast.success("Skill deleted successfully ❌");
      setTechnicalSkills((prev) => prev.filter((s) => s !== skill));
      setJob({
        ...job,
        skills: technicalSkills.filter((s) => s !== skill),
      });
      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } catch (err) {
      console.error("Failed to delete skill suggestion:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Custom dropdown option with delete button
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

  // ✅ Validate job form
  const validateJobForm = () => {
    if (!job.title.trim()) return toast.error("Job title is required"), false;
    if (!job.department) return toast.error("Please select department"), false;
    if (!job.education.trim())
      return toast.error("Education is required"), false;
    if (!job.description.trim())
      return toast.error("Job description is required"), false;
    if (job.skills.length === 0)
      return toast.error("Add at least one skill"), false;
    return true;
  };

  // ✅ Submit job
  const submitJob = async () => {
    if (!validateJobForm()) return;

    const payload = {
      ...job,
      candidateId: singleCandidate?.id || null,
    };

    try {
      const data = await dispatch(createJob(payload)).unwrap();
      toast.success("Job Created Successfully ✅");
      if (data?.id && singleCandidate?.id) {
        router.push(
          `/landing/try-now/guest-info?candidate_id=${singleCandidate?.id}&job_id=${data.id}&isGuest=true`
        );
      }
    } catch {
      toast.error("Job creation failed ❌");
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-xl border">
      <ToastContainer />

      {/* Stepper */}
      <div className="relative flex items-center justify-between mb-8 px-8">
        <div className="absolute top-5 inset-x-10 h-1 bg-teal-200"></div>
        {[1, 2].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold shadow-md transition-all 
              ${step >= s ? "bg-teal-500 scale-110" : "bg-gray-300"}`}
            >
              {s}
            </div>
            <span className="mt-2 text-xs text-gray-600 font-semibold">
              {s === 1 ? "Add Candidate" : "Add Job"}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <AddGuestCandidatePage
          onSuccess={() => {
            toast.success("Candidate added successfully ✅");
            setStep(2);
          }}
        />
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Add Job Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="col-span-2">
              <Label>Job Title</Label>
              <Input
                placeholder="Enter job title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
              />
            </div>

            {/* Qualification */}
            <div>
              <Label>Qualification</Label>
              <Input
                placeholder="Enter education"
                value={job.education}
                onChange={(e) => setJob({ ...job, education: e.target.value })}
              />
            </div>

            {/* Department */}
            <div>
              <Label>Department</Label>
              <ReactSelect
                placeholder={skillLoading ? "Loading..." : "Select Department"}
                options={departmentOptions}
                value={department}
                onChange={handleDepartmentChange}
                isDisabled={skillLoading}
              />
            </div>
          </div>

          {/* Technical Skills */}
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

          {/* Job Description */}
          <div className="col-span-2 mt-6">
            <Label>Job Description</Label>
            <textarea
              className="border p-2 w-full bg-gray-50 rounded-md h-24 outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter job description"
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              disabled={jobLoading}
              onClick={submitJob}
            >
              {jobLoading && <Loader2 className="animate-spin mr-2" />} Submit
              Job
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

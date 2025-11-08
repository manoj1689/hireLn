"use client";

import { useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { createJob } from "@/lib/slices/job/create-guest-job-slice";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import AddGuestCandidatePage from "@/app/landing/try-now/guest-candidate";

enum EmploymentType { FULL_TIME = "FULL_TIME", PART_TIME = "PART_TIME", CONTRACT = "CONTRACT", TEMPORARY = "TEMPORARY", INTERNSHIP = "INTERNSHIP", }
enum SalaryPeriod { yearly = "yearly", monthly = "monthly", weekly = "weekly", hourly = "hourly", }
const departmentOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Product", label: "Product" },
  { value: "HR", label: "Human Resources" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
];

export default function JobStepper() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [job, setJob] = useState({
    title: "",
    department: "",
    languages: [] as { language: string; level: string }[],
    skills: [] as string[],
    description: "",
    education: "",
    location: "Remote",
    employmentType: EmploymentType.FULL_TIME,
    salaryMin:  100000,
    salaryMax:  200000,
    salaryPeriod: SalaryPeriod.yearly, 
    
  });

  const [languageInput, setLanguageInput] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Fluent");
  const [skillInput, setSkillInput] = useState("");

  const { singleCandidate } = useSelector(
    (state: RootState) => state.candidate
  );
  const { loading: jobLoading } = useSelector(
    (state: RootState) => state.createJob
  );

  const validateJobForm = () => {
    if (!job.title.trim()) return toast.error("Job title is required"), false;
    if (!job.department) return toast.error("Please select department"), false;
    if (!job.education.trim())
      return toast.error("Education is required"), false;
    if (!job.description.trim())
      return toast.error("Job description is required"), false;
    if (job.skills.length === 0)
      return toast.error("Add at least one skill"), false;
    if (job.languages.length === 0)
      return toast.error("Add at least one language"), false;
    return true;
  };

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                className="border p-2 w-full bg-gray-50 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter job title"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <Select
                options={departmentOptions}
                placeholder="Select Department"
                onChange={(opt) =>
                  setJob({ ...job, department: opt?.value || "" })
                }
                className="text-sm"
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <input
                type="text"
                className="border p-2 w-full outline-none bg-gray-50 rounded-md focus:ring-2 focus:ring-teal-500"
                placeholder="Enter education"
                value={job.education}
                onChange={(e) => setJob({ ...job, education: e.target.value })}
              />
            </div>

            {/* Skills */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                className="border p-2 w-full bg-gray-50 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Press Enter to add skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && skillInput.trim()) {
                    setJob({
                      ...job,
                      skills: [...job.skills, skillInput.trim()],
                    });
                    setSkillInput("");
                  }
                }}
              />

              <div className="flex gap-2 flex-wrap mt-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-amber-100 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-amber-200"
                    onClick={() =>
                      setJob({
                        ...job,
                        skills: job.skills.filter((s) => s !== skill),
                      })
                    }
                  >
                    {skill} ✕
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <div className="flex gap-2">
                <input
                  className="border p-2 w-full bg-gray-50 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter language"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                />

                <select
                  className="border p-2 rounded-md bg-gray-50"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>Fluent</option>
                  <option>Intermediate</option>
                  <option>Beginner</option>
                </select>

                <Button
                  onClick={() => {
                    if (!languageInput.trim()) return;
                    setJob({
                      ...job,
                      languages: [
                        ...job.languages,
                        {
                          language: languageInput.trim(),
                          level: selectedLevel,
                        },
                      ],
                    });
                    setLanguageInput("");
                  }}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Add
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap mt-2">
                {job.languages.map((lang) => (
                  <span
                    key={lang.language}
                    className="bg-teal-100 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-teal-200"
                    onClick={() =>
                      setJob({
                        ...job,
                        languages: job.languages.filter(
                          (l) => l.language !== lang.language
                        ),
                      })
                    }
                  >
                    {lang.language} ({lang.level}) ✕
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                className="border p-2 w-full bg-gray-50 rounded-md h-24 outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter job description"
                value={job.description}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
              />
            </div>

            <div className="col-span-2 flex justify-between mt-4">
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
          </div>
        </>
      )}
    </div>
  );
}

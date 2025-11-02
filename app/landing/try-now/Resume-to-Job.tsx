"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { uploadAndCreateCandidate } from "@/lib/slices/aitools/parse-resume-slice";
import { createJob } from "@/lib/slices/job/create-guest-job-slice";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

// ✅ Enums
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

// ✅ Select options
const departmentOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Product", label: "Product" },
  { value: "HR", label: "Human Resources" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
];

const employmentOptions = Object.values(EmploymentType).map((item) => ({
  value: item,
  label: item.replace("_", " "),
}));

const salaryPeriodOptions = Object.values(SalaryPeriod).map((item) => ({
  value: item,
  label: item.charAt(0).toUpperCase() + item.slice(1),
}));

export default function JobStepper() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [resume, setResume] = useState<File | null>(null);
  const [toastShown, setToastShown] = useState(false);

  // ✅ Local Job Form State
  const [job, setJob] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: EmploymentType.FULL_TIME,
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: SalaryPeriod.yearly,
    languages: [] as { language: string; level: string }[],
    skills: [] as string[],
    description: "",
    education: "",
  });

  const [languageInput, setLanguageInput] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Fluent");
  const [skillInput, setSkillInput] = useState("");

  // ✅ Resume Slice State
  const {
    createdCandidate,
    message: resumeMessage,
    loading: resumeLoading,
    error: resumeError,
    status: resumeStatus,
  } = useSelector((state: RootState) => state.resumeParser);

  // ✅ Job Slice State
  const {
    job: createdJob,
    loading: jobLoading,
    error: jobError,
  } = useSelector((state: RootState) => state.createJob);

  /* ✅ Upload Resume */
  const handleResumeSubmit = async () => {
    if (!resume) return toast.error("Please upload a resume");

    const formData = new FormData();
    formData.append("file", resume);

    try {
      await dispatch(uploadAndCreateCandidate(formData)).unwrap();
    } catch {
      toast.error("Resume upload failed ❌");
    }
  };

  /* ✅ Delay success toast after resume parse */
  useEffect(() => {
    if (createdCandidate && !toastShown) {
      const timeout = setTimeout(() => {
        toast.success(resumeMessage || "Resume parsed successfully ✅");
        setToastShown(true);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [createdCandidate, resumeMessage, toastShown]);

  useEffect(() => {
    if (resumeError) toast.error(resumeError);
  }, [resumeError]);

  /* ✅ Submit Job */
  const submitJob = async () => {
    const payload = {
      ...job,
      salaryMin: Number(job.salaryMin),
      salaryMax: Number(job.salaryMax),
      candidateId: createdCandidate?.candidate_id || null,
    };

    try {
      const data = await dispatch(createJob(payload)).unwrap();
      toast.success("Job Created Successfully ✅");

      if (data?.id && createdCandidate?.candidate_id) {
        router.push(
          `/landing/try-now/guest-info?candidate_id=${createdCandidate.candidate_id}&job_id=${data.id}&isGuest=true`
        );
      }
    } catch {
      toast.error("Job creation failed ❌");
    }
  };

  return (
    <div className="flex flex-col max-w-2xl h-full mx-auto p-6 bg-white shadow-xl justify-around rounded-xl border">
      <ToastContainer />

      {/* ✅ Stepper */}
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
              {s === 1 ? "Upload Resume" : "Job Details"}
            </span>
          </div>
        ))}
      </div>

      {/* ✅ Step 1 — Upload Resume */}
      {step === 1 && (
        <div className="space-y-4">
          {!resume ? (
            <label className="cursor-pointer w-full p-10 border-2 border-dashed border-teal-400 rounded-xl bg-teal-50/50 hover:bg-teal-100 transition flex flex-col items-center gap-3 text-center">
              <Upload className="w-10 h-10 text-teal-600" />
              <span className="font-semibold text-sm text-teal-700">Click to upload resume</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
            </label>
          ) : (
            <div className="bg-green-50 border border-green-300 p-5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-orange-400 w-10 h-10" />
                <p className="font-medium text-gray-800">{resume.name}</p>
              </div>
              <button onClick={() => setResume(null)} className="text-red-500 hover:text-red-600">
                <X />
              </button>
            </div>
          )}

          {!createdCandidate && (
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600"
              disabled={!resume || resumeLoading}
              onClick={handleResumeSubmit}
            >
              {resumeLoading && <Loader2 className="animate-spin mr-2" />} Upload & Parse Resume
            </Button>
          )}

          {createdCandidate && (
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg mt-4">
              <p className="text-sm"><b>Name:</b> {createdCandidate.candidate_name}</p>
              <p className="text-sm"><b>Email:</b> {createdCandidate.email}</p>
              <p className="text-sm"><b>Resume:</b> {createdCandidate.resume_name}</p>
              <Button className="mt-3 w-full bg-teal-600 hover:bg-teal-700" onClick={() => setStep(2)}>
                Next & Continue
              </Button>
            </div>
          )}

          {resumeStatus === false && resumeMessage?.includes("exists") && (
            <Button className="mt-3 w-full bg-orange-500 hover:bg-orange-600" onClick={() => setStep(2)}>
              Candidate Exists — Continue
            </Button>
          )}
        </div>
      )}

      {/* ✅ Step 2 — Job Form */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 w-full bg-gray-50 rounded-md col-span-2"
            placeholder="Job Title"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })} />

          <Select options={departmentOptions} placeholder="Select Department"
            onChange={(opt) => setJob({ ...job, department: opt?.value || "" })} />

          <Select options={employmentOptions} defaultValue={employmentOptions[0]}
            onChange={(opt) => setJob({ ...job, employmentType: opt?.value as EmploymentType })} />

          {/* Skills */}
          <div className="col-span-2">
            <input className="border p-2 w-full bg-gray-50 rounded-md"
              placeholder="Press Enter to add skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  setJob({ ...job, skills: [...job.skills, skillInput.trim()] });
                  setSkillInput("");
                }
              }} />

            <div className="flex gap-2 flex-wrap mt-2">
              {job.skills.map((skill) => (
                <span key={skill} className="bg-amber-100 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-amber-200"
                  onClick={() => setJob({ ...job, skills: job.skills.filter((s) => s !== skill) })}>
                  {skill} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="col-span-2">
            <div className="flex gap-2">
              <input className="border p-2 w-full bg-gray-50 rounded-md"
                placeholder="Enter language"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)} />

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
                    languages: [...job.languages, { language: languageInput.trim(), level: selectedLevel }],
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
                <span key={lang.language} className="bg-teal-100 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-teal-200"
                  onClick={() =>
                    setJob({
                      ...job,
                      languages: job.languages.filter((l) => l.language !== lang.language),
                    })
                  }
                >
                  {lang.language} ({lang.level}) ✕
                </span>
              ))}
            </div>
          </div>

          <input type="number" className="border p-2 bg-gray-50 rounded-md"
            placeholder="Min Salary"
            value={job.salaryMin}
            onChange={(e) => setJob({ ...job, salaryMin: e.target.value })} />

          <input type="number" className="border p-2 bg-gray-50 rounded-md"
            placeholder="Max Salary"
            value={job.salaryMax}
            onChange={(e) => setJob({ ...job, salaryMax: e.target.value })} />

          <input className="border p-2 bg-gray-50 rounded-md"
            placeholder="Location"
            value={job.location}
            onChange={(e) => setJob({ ...job, location: e.target.value })} />

          <Select options={salaryPeriodOptions} defaultValue={salaryPeriodOptions[0]}
            onChange={(opt) => setJob({ ...job, salaryPeriod: opt?.value as SalaryPeriod })} />

          <input
            className="border p-2 bg-gray-50 rounded-md col-span-2"
            placeholder="Education"
            value={job.education}
            onChange={(e) => setJob({ ...job, education: e.target.value })}
          />

          <textarea
            className="border p-2 bg-gray-50 rounded-md col-span-2 h-24"
            placeholder="Job Description"
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
          />

          <div className="col-span-2 flex justify-between mt-4">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button className="bg-teal-600 hover:bg-teal-700" disabled={jobLoading} onClick={submitJob}>
              {jobLoading && <Loader2 className="animate-spin mr-2" />} Submit Job
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

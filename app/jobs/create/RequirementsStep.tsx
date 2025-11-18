"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { submitJobRequirementsStep } from "@/lib/slices/job/jobRequirements-slice";

import {
  GraduationCap,
  Globe,
  User,
  Wand2,
  RotateCcw,
  ArrowRight,
  X,
} from "lucide-react";

// Default dropdown values
const languageOptions = [
  { label: "English", value: "English" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Chinese", value: "Chinese" },
  { label: "Japanese", value: "Japanese" },
];

const levelOptions = [
  { label: "Basic", value: "Basic" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Fluent", value: "Fluent" },
];

const educationOptions = [
  { label: "High School", value: "High School" },
  { label: "Associate's Degree", value: "Associate's Degree" },
  { label: "Bachelor's Degree", value: "Bachelor's Degree" },
  { label: "Master's Degree", value: "Master's Degree" },
  { label: "PhD", value: "PhD" },
  { label: "No specific requirement", value: "None" },
];

interface RequirementsStepProps {
  onSuccess: () => void;
  sessionId?: string;
}

export default function RequirementsStep({ onSuccess }: RequirementsStepProps) {
  const dispatch = useDispatch<AppDispatch>();

  // ---------- Certifications ----------
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");

  // ---------- Job Requirements ----------
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [jobRequirementInput, setJobRequirementInput] = useState("");

  // ---------- Languages ----------
  const [languages, setLanguages] = useState<{ name: string; proficiency: string }[]>([
    { name: "English", proficiency: "Basic" },
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);

  // Soft skills
  const softSkills = [
    "Problem-solving",
    "Team collaboration",
    "Time management",
    "Communication",
    "Adaptability",
  ];
  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);

  // Education
  const [education, setEducation] = useState(educationOptions[2]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const JobStep2 = useSelector((state: RootState) => state.jobDetails);

  // ---------------------------
  // Auto-add job requirement after 2s
  // ---------------------------
  useEffect(() => {
    if (!jobRequirementInput.trim()) return;

    const timer = setTimeout(() => {
      setJobRequirements((prev) => [...prev, jobRequirementInput.trim()]);
      setJobRequirementInput("");
      setErrors((prev) => ({ ...prev, jobRequirements: "" }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [jobRequirementInput]);

  // ---------------------------
  // Auto-add certification after 2s
  // ---------------------------
  useEffect(() => {
    if (!certInput.trim()) return;

    const timer = setTimeout(() => {
      setCertifications((prev) => [...prev, certInput.trim()]);
      setCertInput("");
      setErrors((prev) => ({ ...prev, certifications: "" }));
    }, 2000);

    return () => clearTimeout(timer);
  }, [certInput]);

  // ---------------------------
  // Auto-add language after 2s
  // ---------------------------
  useEffect(() => {
    if (!selectedLanguage || !selectedLevel) return;

    const timer = setTimeout(() => {
      const exists = languages.some(
        (l) => l.name === selectedLanguage.value && l.proficiency === selectedLevel.value
      );
      if (!exists) {
        setLanguages((prev) => [
          ...prev,
          { name: selectedLanguage.value, proficiency: selectedLevel.value },
        ]);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [selectedLanguage, selectedLevel]);

  // Soft Skills checkbox
  const handleSoftSkillChange = (skill: string) => {
    setSelectedSoftSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!education) newErrors.education = "Select education level";
    if (certifications.length === 0)
      newErrors.certifications = "Add at least one certification";
    if (languages.length === 0) newErrors.languages = "Add at least one language";
    if (selectedSoftSkills.length === 0)
      newErrors.softSkills = "Select at least one soft skill";
    if (jobRequirements.length === 0)
      newErrors.jobRequirements = "Add at least one job requirement";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      educationLevel: education?.value || "",
      certifications,
      languages,
      softSkills: selectedSoftSkills,
      requirements: jobRequirements,
    };

    try {
      await dispatch(
        submitJobRequirementsStep({
          sessionId: JobStep2.response?.sessionId,
          details: payload,
        })
      ).unwrap();

      onSuccess();
    } catch (err) {
      console.error("Error submitting requirements", err);
      alert("Failed to save requirements");
    }
  };

  // Reset form
  const resetForm = () => {
    setCertifications([]);
    setCertInput("");
    setEducation(educationOptions[2]);
    setLanguages([{ name: "English", proficiency: "Basic" }]); // default
    setSelectedLanguage(languageOptions[0]);
    setSelectedLevel(levelOptions[0]);
    setSelectedSoftSkills([]);
    setJobRequirements([]);
    setJobRequirementInput("");
    setErrors({});
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* EDUCATION */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <GraduationCap className="h-4 w-4" />
          Education Level
        </Label>
        <Select
          options={educationOptions}
          value={education}
          onChange={(option: any) => {
            setEducation(option);
            setErrors((prev) => ({ ...prev, education: "" }));
          }}
        />
        {errors.education && (
          <p className="text-red-500 text-sm">{errors.education}</p>
        )}
      </div>

      {/* CERTIFICATIONS */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Certifications</label>
        <Input
          placeholder="Type certification... (auto-saves after 2s)"
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
        />
        {errors.certifications && (
          <p className="text-red-500 text-sm">{errors.certifications}</p>
        )}
        {certifications.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {certifications.map((item, index) => (
              <span
                key={index}
                className="flex items-center bg-blue-400 text-white px-3 py-1 rounded-full text-xs"
              >
                {item}
                 <X
                className="w-4 h-4 cursor-pointer"
                onClick={() =>
                  setCertifications(certifications.filter((_, i) => i !== index))
                }
              />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* LANGUAGES */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          Languages (auto-add after 2 sec)
        </Label>
        <div className="flex items-center gap-4">
          <Select
            value={selectedLanguage}
            options={languageOptions}
            onChange={(v: any) => setSelectedLanguage(v)}
          />
          <Select
            value={selectedLevel}
            options={levelOptions}
            onChange={(v: any) => setSelectedLevel(v)}
          />
        </div>
        {errors.languages && (
          <p className="text-red-500 text-sm">{errors.languages}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((lang, idx) => (
            <span
              key={idx}
              className="bg-violet-400 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2"
            >
              {lang.name} ({lang.proficiency})
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() =>
                  setLanguages(languages.filter((_, i) => i !== idx))
                }
              />
            </span>
          ))}
        </div>
      </div>

      {/* JOB REQUIREMENTS */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <Wand2 className="h-4 w-4" />
          Job Requirements
        </Label>
        <Input
          placeholder="Type requirement... auto-adds in 2 sec"
          value={jobRequirementInput}
          onChange={(e) => setJobRequirementInput(e.target.value)}
        />
        {errors.jobRequirements && (
          <p className="text-red-500 text-sm">{errors.jobRequirements}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {jobRequirements.map((req, idx) => (
            <span
              key={idx}
              className="bg-violet-400 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2"
            >
              {req}
              <X
                className="w-4 h-4 cursor-pointer"
                onClick={() =>
                  setJobRequirements(jobRequirements.filter((_, i) => i !== idx))
                }
              />
            </span>
          ))}
        </div>
      </div>

      {/* SOFT SKILLS */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1">
          <User className="h-4 w-4" />
          Soft Skills
        </Label>
        <div className="flex flex-wrap gap-4">
          {softSkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={skill}
                checked={selectedSoftSkills.includes(skill)}
                onChange={() => handleSoftSkillChange(skill)}
                className="w-5 h-5 accent-teal-600 rounded-md"
              />
              <label htmlFor={skill} className="text-sm">
                {skill}
              </label>
            </div>
          ))}
        </div>
        {errors.softSkills && (
          <p className="text-red-500 text-sm">{errors.softSkills}</p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={resetForm}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>

        <Button type="submit">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

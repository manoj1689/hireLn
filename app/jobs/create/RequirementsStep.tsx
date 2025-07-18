"use client";

import { useState } from "react";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { submitJobRequirementsStep } from "@/lib/slices/job/jobRequirements-slice";

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
  sessionId: string;
}

export default function RequirementsStep({ onSuccess, sessionId }: RequirementsStepProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [education, setEducation] = useState<{ label: string; value: string } | null>(educationOptions[2]);
  const [languages, setLanguages] = useState<{ name: string; proficiency: string }[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedLevel, setSelectedLevel] = useState(levelOptions[0]);

  const [selectedSoftSkills, setSelectedSoftSkills] = useState<string[]>([]);

  const softSkills = [
    "Problem-solving",
    "Team collaboration",
    "Time management",
    "Communication",
    "Adaptability",
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const JobStep2 = useSelector((state: RootState) => state.jobDetails);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (requiredSkills.length === 0) newErrors.requiredSkills = "Add at least one skill";
    if (!education) newErrors.education = "Select education level";
    if (certifications.length === 0) newErrors.certifications = "Add at least one certification";
    if (languages.length === 0) newErrors.languages = "Add at least one language";
    if (selectedSoftSkills.length === 0) newErrors.softSkills = "Select at least one soft skill";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
      e.preventDefault();
      setErrors((prev) => ({ ...prev, requiredSkills: "" }));
    }
  };

  const handleAddCertification = () => {
    if (certInput.trim()) {
      setCertifications([...certifications, certInput.trim()]);
      setCertInput("");
      setErrors((prev) => ({ ...prev, certifications: "" }));
    }
  };

  const handleAddLanguage = () => {
    if (selectedLanguage && selectedLevel) {
      setLanguages([
        ...languages,
        { name: selectedLanguage.value, proficiency: selectedLevel.value },
      ]);
      setErrors((prev) => ({ ...prev, languages: "" }));
    }
  };

  const handleSoftSkillChange = (skill: string) => {
    setSelectedSoftSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      requiredSkills,
      educationLevel: education?.value || "",
      certifications,
      languages,
      softSkills: selectedSoftSkills,
    };

    console.log("requirement payload", payload);
    try {
      const res = await dispatch(
        submitJobRequirementsStep({ sessionId: JobStep2.response?.sessionId, details: payload })
      ).unwrap();

      console.log("Review Job after submit requirement Data:", res);
      onSuccess();
    } catch (err) {
      console.error("Error submitting requirements", err);
      alert("Failed to save requirements");
    }
  };

  // Reset the form and errors
  const resetForm = () => {
    setRequiredSkills([]);
    setSkillInput("");
    setCertifications([]);
    setCertInput("");
    setEducation(educationOptions[2]);
    setLanguages([]);
    setSelectedLanguage(languageOptions[0]);
    setSelectedLevel(levelOptions[0]);
    setSelectedSoftSkills([]);
    setErrors({});
  };

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* Required Skills */}
      <div className="space-y-2">
        <Label htmlFor="requiredSkills">Required Skills</Label>
        <Input
          id="requiredSkills"
          placeholder="Type a skill and press Enter"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillKeyDown}
        />
        {errors.requiredSkills && <p className="text-red-500 text-sm">{errors.requiredSkills}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {requiredSkills.map((skill, index) => (
            <span key={index} className="bg-muted text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Education Level */}
      <div className="space-y-2">
        <Label>Education Level</Label>
        <Select
          options={educationOptions}
          value={education}
          onChange={(option) => {
            setEducation(option);
            setErrors((prev) => ({ ...prev, education: "" }));
          }}
          className="text-sm"
        />
        {errors.education && <p className="text-red-500 text-sm">{errors.education}</p>}
      </div>

      {/* Certifications */}
      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          placeholder="Add certification"
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
        />
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddCertification}>
          + Add
        </Button>
        {errors.certifications && <p className="text-red-500 text-sm">{errors.certifications}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {certifications.map((cert, idx) => (
            <span key={idx} className="bg-muted text-sm px-3 py-1 rounded-full">
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-2">
        <Label>Languages</Label>
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select
              options={languageOptions}
              value={selectedLanguage}
              onChange={(val) => setSelectedLanguage(val!)}
            />
          </div>
          <div className="w-[150px]">
            <Select
              options={levelOptions}
              value={selectedLevel}
              onChange={(val) => setSelectedLevel(val!)}
            />
          </div>
          <Button type="button" variant="outline" size="icon" onClick={handleAddLanguage}>
            +
          </Button>
        </div>
        {errors.languages && <p className="text-red-500 text-sm">{errors.languages}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((lang, idx) => (
            <span key={idx} className="bg-muted text-sm px-3 py-1 rounded-full">
              {lang.name} ({lang.proficiency})
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
      <div className="space-y-2">
        <Label>Soft Skills</Label>
        <div className="flex flex-wrap gap-4">
          {softSkills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={skill}
                checked={selectedSoftSkills.includes(skill)}
                onChange={() => handleSoftSkillChange(skill)}
              />
              <label htmlFor={skill} className="text-sm">{skill}</label>
            </div>
          ))}
        </div>
        {errors.softSkills && <p className="text-red-500 text-sm">{errors.softSkills}</p>}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSoftSkills.map((skill, index) => (
            <span key={index} className="bg-muted text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Reset and Continue Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={resetForm} className="bg-green-600 text-white py-2 px-4 rounded">
          Reset
        </Button>
        <Button type="submit" className="bg-cyan-600 text-white py-2 px-4 rounded">
          Continue
        </Button>
      </div>
    </form>
  );
}

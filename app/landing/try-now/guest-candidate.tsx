"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactSelect from "react-select";
import { Button } from "@/components/ui/button";
import { addCandidate } from "@/lib/slices/candidate/candidate-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { CandidateRequest } from "@/interface/candidate";

export default function AddGuestCandidatePage({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Experience dropdown options
  const experienceOptions = [
    { value: "Fresher", label: "Fresher" },
    { value: "0-2 years", label: "0-2 years" },
    { value: "2-5 years", label: "2-5 years" },
    { value: "5+ years", label: "5+ years" },
  ];

  const { error } = useSelector((state: RootState) => state.candidate);
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || technicalSkills.length === 0) {
      alert("Please fill Name, Email, and at least one Technical Skill.");
      return;
    }

    const payload: CandidateRequest = {
      name,
      email,
      phone: "",
      address: [],
      location: "",

      personalInfo: {
        dob: "",
        gender: "",
        maritalStatus: "",
        nationality: "",
      },

      summary: "",

      education: [
        {
          degree: education || "",
          institution: "",
          location: "",
          start_date: "",
          end_date: "",
          grade: "",
        },
      ],

      experience: [
        {
          title: experience ? experience.value : "",
          company: "",
          location: "",
          start_date: "",
          end_date: "",
          description: "",
        },
      ],

      previousJobs: [
        {
          title: "",
          company: "",
          location: "",
          start_date: "",
          end_date: "",
          description: [],
        },
      ],

      internships: [],
      technicalSkills,
      softSkills: [],
      languages: [], // ✅ since `languages` is string[] in TS
      certifications: [
        {
          title: "",
          issuer: "",
          date: "",
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          url: "",
        },
      ],
      hobbies: [],
      salaryExpectation: undefined,
      department: "",
    };

    try {
      setLoading(true);
      const response = await dispatch(addCandidate(payload));

      if (response.meta.requestStatus === "fulfilled") {
        onSuccess?.();
        // Clear form
        setName("");
        setEmail("");
        setTechnicalSkills([]);
        setSkillInput("");
        setEducation("");
        setExperience(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Add Candidate
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Education as Input */}
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              placeholder="e.g. B.Tech in Computer Science"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>

          {/* Experience Dropdown */}
          <div className="space-y-2">
            <Label>Experience</Label>
            <ReactSelect
              placeholder="Select Experience"
              options={experienceOptions}
              value={experience}
              onChange={(selected) => setExperience(selected)}
            />
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-2">
          <Label>Technical Skills</Label>
          <Input
            className="border p-2 w-full bg-gray-50 rounded-md"
            placeholder="Press Enter to add skill"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && skillInput.trim()) {
                e.preventDefault();
                setTechnicalSkills([...technicalSkills, skillInput.trim()]);
                setSkillInput("");
              }
            }}
          />

          <div className="flex gap-2 flex-wrap mt-2">
            {technicalSkills.map((skill) => (
              <span
                key={skill}
                className="bg-amber-100 px-2 py-1 rounded-md text-sm cursor-pointer hover:bg-amber-200"
                onClick={() =>
                  setTechnicalSkills(technicalSkills.filter((s) => s !== skill))
                }
              >
                {skill} ✕
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Candidate"}
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm font-medium">
          ⚠️ <span className="font-semibold">Error:</span> {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ReactSelect, { components } from "react-select";
import { Button } from "@/components/ui/button";
import { addCandidate } from "@/lib/slices/candidate/candidate-slice";
import {
  fetchSkillSuggestions,
  fetchSkillSuggestionsByDept,
  updateSkillSuggestion,
  deleteSkillSuggestion,
} from "@/lib/slices/skill_suggestion/skill-suggestion-slice";
import { AppDispatch, RootState } from "@/lib/store";
import { CandidateRequest } from "@/interface/candidate";

export default function AddGuestCandidatePage({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [department, setDepartment] = useState<{
    value: string;
    label: string;
    skillSuggestionId: string;
  } | null>(null);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { departments, suggestions, loading: skillLoading, error } = useSelector(
    (state: RootState) => state.skillSuggestions
  );

  useEffect(() => {
    dispatch(fetchSkillSuggestions());
  }, [dispatch]);

  const departmentOptions =
    departments.map((dept) => ({
      value: dept.name,
      label: dept.name,
      skillSuggestionId: dept.id,
    })) || [];

  const handleDepartmentChange = async (selected: any) => {
    setDepartment(selected);
    setTechnicalSkills([]);
    setSkillInput("");
    if (selected?.skillSuggestionId) {
      await dispatch(fetchSkillSuggestionsByDept(selected.skillSuggestionId));
    }
  };

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
  };

  // ✅ Add new skill
  const handleAddNewSuggestion = async () => {
    if (!department?.skillSuggestionId || !skillInput.trim()) return;
    const trimmedSkill = skillInput.trim();

    if (
      suggestionList.some(
        (s: string) => s.toLowerCase() === trimmedSkill.toLowerCase()
      )
    ) {
      alert("Skill already exists in suggestions.");
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

      setTechnicalSkills((prev) => [...prev, trimmedSkill]);
      setSkillInput("");
      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } catch (err) {
      console.error("Failed to add new skill suggestion:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete skill suggestion from DB
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

      setTechnicalSkills((prev) => prev.filter((s) => s !== skill));
      await dispatch(fetchSkillSuggestionsByDept(department.skillSuggestionId));
    } catch (err) {
      console.error("Failed to delete skill suggestion:", err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Custom Option with ❌ button
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

  // ✅ Submit candidate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !department || technicalSkills.length === 0) {
      alert("Please fill Name, Email, Department, and at least one skill.");
      return;
    }

    const payload: CandidateRequest = {
      name,
      email,
      phone: "",
      address: [],
      location: "",
      personalInfo: { dob: "", gender: "", maritalStatus: "", nationality: "" },
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
      experience: [],
      previousJobs: [],
      internships: [],
      technicalSkills,
      softSkills: [],
      languages: [],
      certifications: [],
      projects: [],
      hobbies: [],
      salaryExpectation: undefined,
      department: department.value,
    };

    try {
      setLoading(true);
      const response = await dispatch(addCandidate(payload));
      if (response.meta.requestStatus === "fulfilled") {
        setName("");
        setEmail("");
        setEducation("");
        setTechnicalSkills([]);
        setSkillInput("");
        setDepartment(null);
        onSuccess?.();
      }
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
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Full Name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </div>
          <div>
            <Label>Education</Label>
            <Input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. B.Tech in Computer Science"
            />
          </div>
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

            {/* Show Update Skill button only if skillInput is new */}
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

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Candidate"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          ⚠️ Error: {error}
        </div>
      )}
    </div>
  );
}

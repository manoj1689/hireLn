"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { addCandidate } from "@/lib/slices/candidate/candidate-slice";
import { useRouter } from "next/navigation";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import Select from "react-select";
import { MapPin, Save, CheckCircle } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { PreviousJob } from "@/interface/candidate";

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

const AddCandidatePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState<string[]>([]);
  const [addressInput, setAddressInput] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    dob: "",
    gender: "",
    maritalStatus: "",
    nationality: ""
  });
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState([
    { degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }
  ]);

  // Step 2 state
  const [experience, setExperience] = useState([
    { title: "", company: "", location: "", start_date: "", end_date: "" }
  ]);
  const [previousJobs, setPreviousJobs] = useState<PreviousJob[]>([
    { title: "", company: "", location: "", start_date: "", end_date: "", description: [""] }
  ]);
  const [internships, setInternships] = useState<string[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [certifications, setCertifications] = useState([
    { title: "", issuer: "", date: "" }
  ]);
  const [projects, setProjects] = useState([
    { title: "", description: "", url: "" }
  ]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [salaryExpectation, setSalaryExpectation] = useState(0);
  const [department, setDepartment] = useState("");
  const [resume, setResume] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  // Generic array handler for tags
  const addTag = (value: string, setFn: (v: string[]) => void) => {
    if (value.trim()) {
      setFn((prev) => [...prev, value.trim()]);
    }
  };

  const onSubmit = async () => {
    const payload = {
      name,
      email,
      phone,
      address,
      location: `${region}, ${country}`,
      personalInfo,
      summary,
      education,
      experience,
      previousJobs,
      internships,
      technicalSkills,
      softSkills,
      languages,
      certifications,
      projects,
      hobbies,
      salaryExpectation,
      department,
      resume,
      portfolio,
      linkedin,
      github
    };

    console.log("payload", payload);
    try {
      const res = await dispatch(addCandidate(payload));
      if (res.meta.requestStatus === "fulfilled") {
        router.push("/candidates");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push("/candidates")}
          className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:underline mb-4"
        >
          <FaArrowLeft /> back to Candidates
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white p-4 rounded-lg md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Add New Candidate</h1>
            <p className="text-white">Fill in the details to create a new Candidate</p>
          </div>
          <Button variant="outline" className="flex text-foreground items-center gap-2">
            <Save className="h-4 w-4" /> Save as Draft
          </Button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <StepIndicator number={1} title="Personal Details" isActive={currentStep === 1} isCompleted={currentStep > 1} />
          <StepIndicator number={2} title="Experience & Skills" isActive={currentStep === 2} isCompleted={false} />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 1) setCurrentStep(2);
            else onSubmit();
          }}
          className="max-w-7xl mx-auto"
        >
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name" value={name} onChange={setName} />
              <InputField label="Email" value={email} onChange={setEmail} type="email" />
              <InputField label="Phone" value={phone} onChange={setPhone} />
              <div className="space-y-2">
                <Label>Department</Label>
                <ShadSelect value={department} onValueChange={setDepartment}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                    ))}
                  </SelectContent>
                </ShadSelect>
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <div className="flex gap-2">
                  <Input value={addressInput} onChange={(e) => setAddressInput(e.target.value)} placeholder="Enter address" />
                  <Button type="button" onClick={() => { addTag(addressInput, setAddress); setAddressInput(""); }}>+ Add</Button>
                </div>
                {address.length > 0 && <ul className="list-disc pl-5">{address.map((a, i) => <li key={i}>{a}</li>)}</ul>}
              </div>
              <div className="col-span-2">
                <Label>Location</Label>
                <div className="flex gap-4">
                  <CountryDropdown
                    value={country}
                    onChange={(val) => { setCountry(val); if (!val) setRegion(""); }}
                    className="border rounded px-3 py-2 w-1/2"
                  />
                  <RegionDropdown
                    country={country}
                    value={region}
                    onChange={setRegion}
                    className="border rounded px-3 py-2 w-1/2"
                  />
                </div>
              </div>
              <InputField label="Summary" value={summary} onChange={setSummary} className="col-span-2" />
              {/* Personal Info */}
              <div className="col-span-2 md:col-span-1">
                <Label>Date of Birth (Optional)</Label>
                <Input
                  type="date"
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <Label>Gender (Optional)</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={personalInfo.gender === "Male"}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={personalInfo.gender === "Female"}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                    />
                    Female
                  </label>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <Label>Marital Status (Optional)</Label>
                <ShadSelect
                  value={personalInfo.maritalStatus}
                  onValueChange={(val) => setPersonalInfo({ ...personalInfo, maritalStatus: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </ShadSelect>
              </div>

              <div className="col-span-2 md:col-span-1">
                <Label>Nationality (Optional)</Label>
                <ShadSelect
                  value={personalInfo.nationality}
                  onValueChange={(val) => setPersonalInfo({ ...personalInfo, nationality: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Canadian">Canadian</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Australian">Australian</SelectItem>
                  </SelectContent>
                </ShadSelect>
              </div>

              {/* Education */}
              <div className="col-span-2">
                <Label>Education</Label>
                {education.map((edu, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateArrayField(setEducation, i, "degree", e.target.value)} />
                    <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateArrayField(setEducation, i, "institution", e.target.value)} />
                    <Input placeholder="Location" value={edu.location} onChange={(e) => updateArrayField(setEducation, i, "location", e.target.value)} />
                    <Input placeholder="Grade" value={edu.grade} onChange={(e) => updateArrayField(setEducation, i, "grade", e.target.value)} />
                    <Input type="date" value={edu.start_date} onChange={(e) => updateArrayField(setEducation, i, "start_date", e.target.value)} />
                    <Input type="date" value={edu.end_date} onChange={(e) => updateArrayField(setEducation, i, "end_date", e.target.value)} />
                  </div>
                ))}
                <Button type="button" onClick={() => setEducation([...education, { degree: "", institution: "", location: "", start_date: "", end_date: "", grade: "" }])}>
                  + Add Education
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience */}
              <div className="col-span-2">
                <Label>Experience</Label>
                {experience.map((exp, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <Input placeholder="Title" value={exp.title} onChange={(e) => updateArrayField(setExperience, i, "title", e.target.value)} />
                    <Input placeholder="Company" value={exp.company} onChange={(e) => updateArrayField(setExperience, i, "company", e.target.value)} />
                    <Input placeholder="Location" value={exp.location} onChange={(e) => updateArrayField(setExperience, i, "location", e.target.value)} />
                    <Input type="date" value={exp.start_date} onChange={(e) => updateArrayField(setExperience, i, "start_date", e.target.value)} />
                    <Input type="date" value={exp.end_date} onChange={(e) => updateArrayField(setExperience, i, "end_date", e.target.value)} />
                  </div>
                ))}
                <Button type="button" onClick={() => setExperience([...experience, { title: "", company: "", location: "", start_date: "", end_date: "" }])}>
                  + Add Experience
                </Button>
              </div>

              {/* Previous Jobs */}
              <div className="col-span-2">
                <Label>Previous Jobs</Label>
                {previousJobs.map((job, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      placeholder="Title"
                      value={job.title}
                      onChange={(e) => updateArrayField(setPreviousJobs, i, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Company"
                      value={job.company}
                      onChange={(e) => updateArrayField(setPreviousJobs, i, "company", e.target.value)}
                    />
                    <Input
                      placeholder="Location"
                      value={job.location}
                      onChange={(e) => updateArrayField(setPreviousJobs, i, "location", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={job.start_date}
                      onChange={(e) => updateArrayField(setPreviousJobs, i, "start_date", e.target.value)}
                    />
                    <Input
                      type="date"
                      value={job.end_date}
                      onChange={(e) => updateArrayField(setPreviousJobs, i, "end_date", e.target.value)}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    setPreviousJobs([
                      ...previousJobs,
                      { title: "", company: "", location: "", start_date: "", end_date: "", description: [] }
                    ])
                  }
                >
                  + Add Previous Job
                </Button>
              </div>


              {/* Internships */}
              <TagInput label="Internships" tags={internships} setTags={setInternships} />

              {/* Technical Skills */}
              <TagInput label="Technical Skills" tags={technicalSkills} setTags={setTechnicalSkills} />

              {/* Soft Skills */}
              <TagInput label="Soft Skills" tags={softSkills} setTags={setSoftSkills} />

              {/* Languages */}
              <TagInput label="Languages" tags={languages} setTags={setLanguages} />

              {/* Certifications */}
              <div className="col-span-2">
                <Label>Certifications</Label>
                {certifications.map((cert, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Title" value={cert.title} onChange={(e) => updateArrayField(setCertifications, i, "title", e.target.value)} />
                    <Input placeholder="Issuer" value={cert.issuer} onChange={(e) => updateArrayField(setCertifications, i, "issuer", e.target.value)} />
                    <Input type="date" value={cert.date} onChange={(e) => updateArrayField(setCertifications, i, "date", e.target.value)} />
                  </div>
                ))}
                <Button type="button" onClick={() => setCertifications([...certifications, { title: "", issuer: "", date: "" }])}>
                  + Add Certification
                </Button>
              </div>

              {/* Projects */}
              <div className="col-span-2">
                <Label>Projects</Label>
                {projects.map((proj, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <Input placeholder="Title" value={proj.title} onChange={(e) => updateArrayField(setProjects, i, "title", e.target.value)} />
                    <Input placeholder="Description" value={proj.description} onChange={(e) => updateArrayField(setProjects, i, "description", e.target.value)} />
                    <Input placeholder="URL" value={proj.url} onChange={(e) => updateArrayField(setProjects, i, "url", e.target.value)} />
                  </div>
                ))}
                <Button type="button" onClick={() => setProjects([...projects, { title: "", description: "", url: "" }])}>
                  + Add Project
                </Button>
              </div>

              {/* Hobbies */}
              <TagInput label="Hobbies" tags={hobbies} setTags={setHobbies} />

              {/* Salary */}
              <InputField label="Salary Expectation" value={salaryExpectation} onChange={setSalaryExpectation} type="number" />

              {/* Links */}
              <InputField label="Resume URL" value={resume} onChange={setResume} className="col-span-2" />
              <InputField label="Portfolio URL" value={portfolio} onChange={setPortfolio} className="col-span-2" />
              <InputField label="LinkedIn URL" value={linkedin} onChange={setLinkedin} className="col-span-2" />
              <InputField label="GitHub URL" value={github} onChange={setGithub} className="col-span-2" />
            </div>
          )}



          {/* Step Controls */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>}
            <Button type="submit">{currentStep === 1 ? "Next" : "Add Candidate"}</Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AddCandidatePage;

function InputField({ label, value, onChange, type = "text", className = "" }: any) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function updateArrayField(setter: any, index: number, field: string, value: string) {
  setter((prev: any[]) => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
}

function StepIndicator({ number, title, isActive, isCompleted }: any) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center w-full">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${isCompleted || isActive
          ? "border-primary bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white"
          : "border-gray-300 bg-white text-gray-400"
          }`}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : number}
      </div>
      <span className={`mt-2 text-xs font-medium ${isCompleted || isActive ? "text-foreground" : "text-gray-500"}`}>
        {title}
      </span>
    </div>
  );
}


function TagInput({ label, tags, setTags }: { label: string; tags: string[]; setTags: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  return (
    <div className="col-span-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Add ${label}`} />
        <Button type="button" onClick={() => { if (input.trim()) { setTags([...tags, input.trim()]); setInput(""); } }}>
          + Add
        </Button>
      </div>
      {tags.length > 0 && (
        <ul className="list-disc pl-5 mt-1">
          {tags.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

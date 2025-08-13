"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Modal } from "react-responsive-modal"
import { AppDispatch } from "@/lib/store"
import { fetchCandidateById, updateCandidate } from "@/lib/slices/candidate/candidate-slice"
import "react-responsive-modal/styles.css"
import { Button } from "@/components/ui/button"
import Select from "react-select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Briefcase, GraduationCap, PlusCircle, CheckCircle } from "lucide-react"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"

const educationOptions = [
    { label: "High School", value: "High School" },
    { label: "Associate's Degree", value: "Associate's Degree" },
    { label: "Bachelor's Degree", value: "Bachelor's Degree" },
    { label: "Master's Degree", value: "Master's Degree" },
    { label: "PhD", value: "PhD" },
    { label: "No specific requirement", value: "None" },
]

const experienceOptions = [
    { label: "0-1 years", value: "0-1" },
    { label: "1-3 years", value: "1-3" },
    { label: "3-5 years", value: "3-5" },
    { label: "5+ years", value: "5+" },
]

export default function EditCandidateModal({ candidate, candidateId, openModal, closeModal }: any) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<any>(candidate)
    const [skillInput, setSkillInput] = useState("")
    const [previousJobInput, setPreviousJobInput] = useState("")
    const [country, setCountry] = useState("")
    const [region, setRegion] = useState("")

    const dispatch = useDispatch<AppDispatch>()



    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSelectChange = (selectedOption: any, name: string) => {
        setFormData({
            ...formData,
            [name]: selectedOption?.value || "",
        })
    }

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] })
            setSkillInput("")
        }
    }

    const handleAddJob = () => {
        if (previousJobInput.trim()) {
            setFormData({ ...formData, previousJobs: [...(formData.previousJobs || []), previousJobInput.trim()] })
            setPreviousJobInput("")
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        dispatch(updateCandidate({ id: candidateId, formData: { ...formData, location:`${country},${region}`} }))
            .then(() => closeModal())
    }

    return (
        <Modal open={openModal} onClose={closeModal} center classNames={{ modal: 'w-full max-w-5xl mx-auto rounded-lg p-6' }}>
            <h2 className="text-xl font-bold mb-6 text-center">Edit Candidate</h2>
            <div className="flex items-center justify-between mb-6 relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                <StepIndicator number={1} title="Personal Details" isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <StepIndicator number={2} title="Education & Experience" isActive={currentStep === 2} isCompleted={false} />

            </div>
            {formData ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input name="name" value={formData.name || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input name="phone" value={formData.phone || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Education Level</Label>
                                    <Select options={educationOptions} value={educationOptions.find(opt => opt.value === formData.education)} onChange={(opt) => handleSelectChange(opt, "education")} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Skills</Label>
                                    <div className="flex gap-2">
                                        <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Enter skill" />
                                        <Button type="button" onClick={handleAddSkill}><PlusCircle className="mr-1" size={16} />Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.skills?.map((skill: string, idx: number) => {
                                            const hue = Math.floor(Math.random() * 360)
                                            const bgColor = `hsl(${hue}, 90%, 85%)`
                                            const textColor = `hsl(${hue}, 30%, 40%)`

                                            return (
                                                <span
                                                    key={idx}
                                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                                                    style={{ backgroundColor: bgColor, color: textColor }}
                                                >
                                                    {skill}
                                                    <button
                                                        onClick={() => {
                                                            setFormData((prev: { skills: any[] }) => ({
                                                                ...prev,
                                                                skills: prev.skills?.filter((_: any, i: number) => i !== idx)
                                                            }))
                                                        }}
                                                        className="ml-1 text-gray-600 hover:text-red-600"
                                                        type="button"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )
                                        })}
                                    </div>

                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label className="flex items-center gap-2"><MapPin size={16} /> Location</Label>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <CountryDropdown value={country} onChange={(val) => { setCountry(val); if (!val) setRegion("") }} className="w-full md:w-1/2 border px-3 py-2 text-sm rounded" />
                                        <RegionDropdown country={country} value={region} onChange={setRegion} className="w-full md:w-1/2 border px-3 py-2 text-sm rounded" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="button" onClick={() => setCurrentStep(2)}>Next</Button>
                            </div>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Briefcase size={16} /> Experience</Label>
                                    <Select options={experienceOptions} value={experienceOptions.find(opt => opt.value === formData.experience)} onChange={(opt) => handleSelectChange(opt, "experience")} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Salary Expectation</Label>
                                    <Input name="salaryExpectation" type="number" value={formData.salaryExpectation || ''} onChange={handleChange} />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label>Experience Summary</Label>
                                    <Input name="experienceSummary" value={formData.experienceSummary || ''} onChange={handleChange} />
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label>Previous Jobs</Label>
                                    <div className="flex gap-2">
                                        <Input value={previousJobInput} onChange={(e) => setPreviousJobInput(e.target.value)} placeholder="Previous job or company" />
                                        <Button type="button" onClick={handleAddJob}><PlusCircle className="mr-1" size={16} />Add</Button>
                                    </div>
                                    <ul className="list-disc pl-5 mt-2 text-sm">
                                        {formData.previousJobs?.map((job: string, idx: number) => (
                                            <li key={idx}>{job}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <Label>Resume URL</Label>
                                    <Input name="resume" value={formData.resume || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Portfolio URL</Label>
                                    <Input name="portfolio" value={formData.portfolio || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>LinkedIn</Label>
                                    <Input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label>GitHub</Label>
                                    <Input name="github" value={formData.github || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </>
                    )}
                </form>
            ) : (
                <p>Loading candidate data...</p>
            )}
        </Modal>
    )
}

// Step Indicator Component
interface StepIndicatorProps {
    number: number;
    title: string;
    isActive: boolean;
    isCompleted: boolean;
}

function StepIndicator({ number, title, isActive, isCompleted }: StepIndicatorProps) {
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

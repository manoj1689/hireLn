"use client"

import React, { useState } from "react"
import {
  Home,
  Network,
  ClipboardList,
  Info,
  Users,
  Briefcase,
  ChevronRight,
  RotateCcw,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { submitJobDetailsStep } from "@/lib/slices/job/jobDetails-slice"
import { JobDetailsStepRequest } from "@/interface/jobsteps"

const experienceOptions = [
  { value: '0-1', label: '0–1 year' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10+', label: '10+ years' },
]

const teamSizeOptions = ["1-5", "5-10", "10-20", "20-50", "50+"]

const reportingStructureOptions = [
  { value: "engineering-manager", label: "Reports to Engineering Manager" },
  { value: "product-manager", label: "Reports to Product Manager" },
  { value: "cto", label: "Reports to CTO" },
  { value: "team-lead", label: "Reports to Team Lead" },
]

interface JobDetailsStepProps {
  onSuccess: () => void
  sessionId: string
}

export default function JobDetailsStep({ onSuccess, sessionId }: JobDetailsStepProps) {
  const dispatch = useDispatch<AppDispatch>()

  const [jobDescription, setJobDescription] = useState("")
  const [keyResponsibilityInput, setKeyResponsibilityInput] = useState("")
  const [keyResponsibilities, setKeyResponsibilities] = useState<string[]>([])
  const [workMode, setWorkMode] = useState<"Remote" | "Hybrid" | "On-site" | "">("")
  const [requiredExperience, setRequiredExperience] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [reportingStructure, setReportingStructure] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const JobStep1 = useSelector((state: RootState) => state.jobBasicInfo)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!jobDescription.trim()) newErrors.jobDescription = "Job description is required"
    if (keyResponsibilities.length === 0) newErrors.keyResponsibilities = "At least one responsibility is required"
    if (!workMode) newErrors.workMode = "Select a work mode"
    if (!requiredExperience.trim()) newErrors.requiredExperience = "Experience is required"
    if (!teamSize.trim()) newErrors.teamSize = "Select a team size"
    if (!reportingStructure.trim()) newErrors.reportingStructure = "Select reporting structure"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addResponsibility = () => {
    if (keyResponsibilityInput.trim()) {
      setKeyResponsibilities([...keyResponsibilities, keyResponsibilityInput.trim()])
      setKeyResponsibilityInput("")
      setErrors((prev) => ({ ...prev, keyResponsibilities: "" }))
    }
  }

  const handleWorkModeClick = (mode: "Remote" | "Hybrid" | "On-site") => {
    setWorkMode((prev) => (prev === mode ? "" : mode))
    setErrors((prev) => ({ ...prev, workMode: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload: JobDetailsStepRequest = {
      jobDescription,
      keyResponsibilities,
      workMode,
      requiredExperience,
      teamSize,
      reportingStructure,
    }

    try {
      const result = await dispatch(
        submitJobDetailsStep({ sessionId: JobStep1.data?.sessionId || sessionId, details: payload })
      ).unwrap()
      console.log("Submitted:", result)
      onSuccess()
    } catch (error) {
      console.error("Submit failed:", error)
      alert("Failed to submit job details.")
    }
  }

  const resetForm = () => {
    setJobDescription("")
    setKeyResponsibilityInput("")
    setKeyResponsibilities([])
    setWorkMode("")
    setRequiredExperience("")
    setTeamSize("")
    setReportingStructure("")
    setErrors({})
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Job Description */}
      <div className="space-y-2">
        <Label htmlFor="jobDescription" className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          Job Description
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="Enter job description..."
          className="min-h-[100px]"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value)
            setErrors((prev) => ({ ...prev, jobDescription: "" }))
          }}
        />
        {errors.jobDescription && <p className="text-red-500 text-sm">{errors.jobDescription}</p>}
      </div>

      {/* Key Responsibilities */}
      <div className="space-y-2">
        <Label htmlFor="keyResponsibility" className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          Key Responsibilities
        </Label>
        <div className="flex gap-2">
          <Input
            id="keyResponsibility"
            placeholder="Add responsibility"
            value={keyResponsibilityInput}
            onChange={(e) => setKeyResponsibilityInput(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={addResponsibility}>
            + Add
          </Button>
        </div>
        {errors.keyResponsibilities && (
          <p className="text-red-500 text-sm">{errors.keyResponsibilities}</p>
        )}
        {keyResponsibilities.length > 0 && (
          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            {keyResponsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Required Experience */}
      <div className="space-y-2">
        <Label htmlFor="requiredExperience" className="flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Required Experience
        </Label>
        <div className="w-64">
          <Select
            value={requiredExperience}
            onValueChange={(val) => {
              setRequiredExperience(val)
              setErrors((prev) => ({ ...prev, requiredExperience: "" }))
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience range" />
            </SelectTrigger>
            <SelectContent>
              {experienceOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.requiredExperience && (
          <p className="text-red-500 text-sm">{errors.requiredExperience}</p>
        )}
      </div>

      {/* Team Size & Reporting Structure */}
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="space-y-2 lg:w-1/2">
          <Label htmlFor="teamSize" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Size
          </Label>
          <Select
            value={teamSize}
            onValueChange={(val) => {
              setTeamSize(val)
              setErrors((prev) => ({ ...prev, teamSize: "" }))
            }}
          >
            <SelectTrigger id="teamSize">
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent>
              {teamSizeOptions.map(size => (
                <SelectItem key={size} value={size}>{size} people</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize}</p>}
        </div>

        <div className="space-y-2 lg:w-1/2">
          <Label htmlFor="reportingStructure" className="flex items-center gap-2">
            <Network className="w-4 h-4" />
            Reporting Structure
          </Label>
          <Select
            value={reportingStructure}
            onValueChange={(val) => {
              setReportingStructure(val)
              setErrors((prev) => ({ ...prev, reportingStructure: "" }))
            }}
          >
            <SelectTrigger id="reportingStructure">
              <SelectValue placeholder="Select reporting structure" />
            </SelectTrigger>
            <SelectContent>
              {reportingStructureOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.reportingStructure && <p className="text-red-500 text-sm">{errors.reportingStructure}</p>}
        </div>
      </div>

      {/* Work Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Work Mode
        </Label>
        <div className="grid grid-cols-3 gap-4">
          {["Remote", "Hybrid", "On-site"].map((mode) => (
            <div
              key={mode}
              className={`flex flex-col items-center rounded-md border p-4 cursor-pointer hover:border-primary hover:bg-primary/5 ${
                workMode === mode ? "border-primary bg-primary/10" : ""
              }`}
              onClick={() => handleWorkModeClick(mode as any)}
            >
              <Home className="mb-2 h-6 w-6" />
              <span className="text-sm">{mode}</span>
            </div>
          ))}
        </div>
        {errors.workMode && <p className="text-red-500 text-sm">{errors.workMode}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex w-full justify-between pt-4">
        <Button type="button" variant="secondary" onClick={resetForm} className="py-2 px-4 rounded">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button type="submit" variant="default" className="flex items-center gap-2">
          Continue
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}

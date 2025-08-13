"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Upload, UserPlus, MapPin, UserCheck, Filter, Delete } from "lucide-react"
import Select from "react-select"
import { Search, Globe, Briefcase, Settings2 } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CandidateCard } from "./candidate-list"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchCandidates, resetCandidateState } from "@/lib/slices/candidate/candidate-slice"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import { uploadResumes } from "@/lib/slices/aitools/resume-parcing-slice"
import BulkResumeUploadDialog from "./BulkResumeUploadDialog"
import { RxReload } from "react-icons/rx"

export default function CandidatesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { data: candidates, loading, error } = useSelector((state: RootState) => state.candidate)

  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)

  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false)
  const [technicalSkills, setTechnicalSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>("");

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      setTechnicalSkills([...technicalSkills, skillInput.trim()]);
      setSkillInput(""); // clear input
    }
  };

  const removeSkill = (index: number) => {
    setTechnicalSkills(technicalSkills.filter((_, i) => i !== index));
  };

  const itemsPerPage = 6

  useEffect(() => {
    dispatch(fetchCandidates({
      skip: (page - 1) * itemsPerPage,
      limit: itemsPerPage,
      search: searchQuery,
      technicalSkills,

    }))
  }, [dispatch, searchQuery, page, technicalSkills])


  const handleUpload = (files: File[]) => {
    dispatch(uploadResumes(files));
  };

  const handleNextPage = () => setPage((prev) => prev + 1)
  const handlePrevPage = () => page > 1 && setPage((prev) => prev - 1)

  const experienceOptions = [
    { value: '0-1', label: '0–1 year' },
    { value: '1-3', label: '1–3 years' },
    { value: '3-5', label: '3–5 years' },
    { value: '5-10', label: '5–10 years' },
    { value: '10+', label: '10+ years' },
  ]

  const allowedStatuses = ["APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED", "REJECTED"] as const
  type Status = typeof allowedStatuses[number]
  type DisplayStatus = Status | "NEW"
  function toValidStatus(value: string | null | undefined): DisplayStatus {
    return value && allowedStatuses.includes(value as Status) ? (value as Status) : "NEW"
  }

  const allowedInterviewStatuses = [
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
    "RESCHEDULED",
  ] as const
  type InterviewStatus = typeof allowedInterviewStatuses[number]
  type DisplayInterviewStatus = InterviewStatus | "NOT SCHEDULED"
  function toValidInterviewStatus(value: string | null | undefined): DisplayInterviewStatus {
    return value && allowedInterviewStatuses.includes(value as InterviewStatus)
      ? (value as InterviewStatus)
      : "NOT SCHEDULED"
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-primary-gradient  space-y-4 justify-between p-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-3xl text-white font-bold tracking-tight">Candidates Management</h1>
          <p className="text-white"><span>Total candidates </span> <span className="text-lg text-yellow-200">{candidates?.length}</span> </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-1" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={() => router.push("/candidates/create-candidate")}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filters */}


      <div className="flex flex-col md:flex-row gap-4 w-full my-4">
        <div className="flex w-full justify-between gap-4">
          {/* Skills input */}
          <div className="flex flex-col w-full ">
            <div className="relative w-full">
              <div>
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Skills (comma or space separated)"

                  className="w-full pl-10 bg-white focus:outline-none focus:ring-0"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>


            </div>

            {/* Skill badges */}
            <div className="flex flex-wrap gap-1 mt-2 ">
              {(Array.isArray(technicalSkills) ? technicalSkills : String(technicalSkills).split(",")).map((skill: string, index: number) => {
                const hue = Math.floor(Math.random() * 360);
                const bgColor = `hsl(${hue}, 90%, 85%)`;
                const textColor = `hsl(${hue}, 30%, 40%)`;
                return (
                  <span
                    key={index}
                    className="flex px-2 py-0.5 rounded-full text-xs font-light gap-1 whitespace-nowrap items-center"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <span> {skill.trim()}</span>
                    <span><button onClick={() => removeSkill(index)} className=" text-red-500"><Delete size={16} /></button></span>
                  </span>
                );
              })}
            </div>
          </div>

        </div>
        {/* Search input with icon */}
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-1/3 transform -translate-y-1/2 text-muted-foreground" size={18}  />
          <Input
            type="search"
            placeholder="Search Candidate..."
            className="w-full pl-10 focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-end mb-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setTechnicalSkills([])
              setPage(1)
              dispatch(resetCandidateState())
            }}
            className="text-sm "
          >
            <RxReload size={20} />
          </Button>
        </div>
      </div>







      {/* Candidate List */}
      <div className="mt-6">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && candidates?.length ? (
          <div className="flex flex-col space-y-4">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-6">No candidates found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={(candidates?.length ?? 0) < itemsPerPage}
          >
            Next
          </Button>
        </div>
      </div>


      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Interview Date & Time</Label>
              <Input id="interviewDate" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewType">Interview Type</Label>
              <ShadSelect>
                <SelectTrigger id="interviewType">
                  <SelectValue placeholder="Select type of Interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                  <SelectItem value="cultural">Cultural Fit</SelectItem>
                  <SelectItem value="ai">AI Interview</SelectItem>
                </SelectContent>
              </ShadSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewer">Interviewer</Label>
              <ShadSelect>
                <SelectTrigger id="interviewer">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                  <SelectItem value="ai">AI Interviewer</SelectItem>
                </SelectContent>
              </ShadSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" placeholder="Add any additional notes or instructions" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowScheduleDialog(false)}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BulkResumeUploadDialog
        showBulkUploadDialog={showBulkUploadDialog}
        setShowBulkUploadDialog={setShowBulkUploadDialog}
      />
    </MainLayout>
  )
}



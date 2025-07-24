"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Upload, UserPlus } from "lucide-react"
import Select from "react-select"

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
import Multiselect from "multiselect-react-dropdown";
import { candidateCategories } from "./candidate-cateories"
import AddCandidateModal from "./add-candidate"
import { CandidateCard } from "./candidate-list"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchCandidates } from "@/lib/slices/candidate/candidate-slice"

export default function CandidatesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: candidates, loading, error } = useSelector((state: RootState) => state.candidate)

  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [showAddCandidateDialog, setShowAddCandidateDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)

  const itemsPerPage = 10

  useEffect(() => {
    dispatch(fetchCandidates({ skip: (page - 1) * itemsPerPage, limit: itemsPerPage, search: searchQuery }))
  }, [dispatch, searchQuery, page])

  const handleNextPage = () => setPage(page + 1)
  const handlePrevPage = () => page > 1 && setPage(page - 1)

  const handleScheduleInterview = (candidateId: string) => {
    setSelectedCandidate(candidateId)
    setShowScheduleDialog(true)
  }

  const positionOptions = [
    { value: "all", label: "All Positions" },
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Engineer" },
    { value: "product", label: "Product Designer" },
    { value: "marketing", label: "Marketing Manager" },
    { value: "sales", label: "Sales Representative" },
  ]

  const experienceOptions = [
    { value: "all", label: "All Levels" },
    { value: "entry", label: "Entry Level (0–2 years)" },
    { value: "mid", label: "Mid Level (3–5 years)" },
    { value: "senior", label: "Senior (6+ years)" },
  ]

  const locationOptions = [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "newyork", label: "New York" },
    { value: "london", label: "London" },
    { value: "singapore", label: "Singapore" },
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
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);

  const handleCategorySelect = (selectedList: any[]) => {
    const selected = selectedList[0];
    setSelectedCategory(selected);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (selectedList: any[]) => {
    const selected = selectedList[0];
    setSelectedSubcategory(selected);
  };
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row bg-primary-gradient  space-y-4 justify-between p-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-3xl text-white font-bold tracking-tight">Candidates Management</h1>
          <p className="text-white">125 total candidates, 45 new this week</p>

        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-1" />
            Bulk Upload
          </Button>
          <Button variant="outline" onClick={() => setShowAddCandidateDialog(true)}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full mt-6 flex flex-col md:flex-row items-center gap-4">
        <Input
          type="search"
          placeholder="Search Candidate..."
          className="w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Candidate List */}
        <div className="mt-6 lg:w-3/4 order-2 lg:order-1">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && candidates && candidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  name={candidate.name}
                  location={candidate.location}
                  experience={candidate.experience}
                  appliedAt={candidate.createdAt}
                  aiMatch={Math.floor(Math.random() * 21) + 80}
                  education={candidate.education}
                  applicationStatus={toValidStatus(candidate.applicationStatus)}
                  interviewStatus={toValidInterviewStatus(candidate.interviewStatus)}
                  phone={candidate.phone}
                  skills={candidate.skills}
                />
              ))}
            </div>
          ) : !loading && !error ? (
            <p className="text-muted-foreground">No candidates found.</p>
          ) : null}

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
        <div className="flex flex-col mt-6 lg:w-1/4 order-1 lg:order-2 gap-4">
          <div className="bg-sky-50 p-4 rounded-lg shadow-lg">
            <div className="text-lg font-semibold ">Quick filters</div>
            <div className="space-y-6 max-w-md mx-auto">
              {/* Always active filters */}
              <div>
                <Select
                  options={experienceOptions}
                  placeholder="Experience"
                  isClearable
                  onChange={(o) => console.log(o)}
                />
              </div>
              <div className="w-full">
                <Select
                  options={locationOptions}
                  placeholder="Location"
                  isClearable
                  onChange={(o) => console.log(o)}
                />
              </div>

              {/* Conditional filters */}
              <div>
                <label className="font-medium text-sm">Select Job Category</label>
                <Multiselect
                  options={candidateCategories}
                  singleSelect
                  displayValue="label"
                  onSelect={handleCategorySelect}
                  onRemove={() => setSelectedCategory(null)}
                  placeholder="Choose Category"
                />
              </div>

              <div>
                <label className="font-medium text-sm">Select Job Role</label>
                <Multiselect
                  options={selectedCategory?.subcategories || []}
                  singleSelect
                  displayValue="label"
                  onSelect={handleSubcategorySelect}
                  onRemove={() => setSelectedSubcategory(null)}
                  placeholder="Choose Role"
                  disable={!selectedCategory}
                />
              </div>

              <div>
                <label className="font-medium text-sm">Required Skills</label>
                <Multiselect
                  options={selectedSubcategory?.skills || []}
                  isObject={false}
                  placeholder="Select Required Skills"
                  showCheckbox
                  disable={!selectedSubcategory}
                />
              </div>
            </div>

            <div className="flex py-4 justify-center">
              <Button >Find Candidate</Button>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg shadow-lg p-4">
            <div className="text-lg font-semibold ">Recent Activity</div>


            <ul className="space-y-2">
              <li className="text-sm text-gray-700">
                ✅ <strong>Priya Sharma</strong> was added as a <em>React Developer</em>.
              </li>
              <li className="text-sm text-gray-700">
                ✅ <strong>Amit Verma</strong> was added as a <em>Node.js Developer</em>.
              </li>
              <li className="text-sm text-gray-700">
                ✅ <strong>Neha Patel</strong> was added as a <em>Sales Manager</em>.
              </li>
            </ul>
          </div>
        </div>


      </div>



      {/* Modals */}
      <AddCandidateModal
        showAddCandidateDialog={showAddCandidateDialog}
        setShowAddCandidateDialog={setShowAddCandidateDialog}
      />

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

      <Dialog open={showBulkUploadDialog} onOpenChange={setShowBulkUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Bulk Upload Candidates</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border border-dashed p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Drag and drop your CSV file here</h3>
              <p className="mt-2 text-sm text-muted-foreground">or Browse</p>
              <p className="mt-2 text-xs text-muted-foreground">Supported formats: CSV</p>
            </div>
            <div className="space-y-2">
              <Label>CSV Template format</Label>
              <div className="rounded-md bg-muted p-2 text-sm">Name, email, position, location, Experience</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBulkUploadDialog(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}


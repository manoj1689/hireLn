"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, MoreVertical, Search, Upload, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import AddCandidateModal from "./add-candidate"
import { CandidateCard } from "./candidate-list"
import { AppDispatch, RootState } from "@/lib/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchCandidates } from "@/lib/slices/candidate/candidate-slice"


export default function CandidatesPage() {

  const dispatch = useDispatch<AppDispatch>()
  const { data: candidates, loading, error } = useSelector((state: RootState) => state.candidate)

  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddCandidateDialog, setShowAddCandidateDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const itemsPerPage = 10
  useEffect(() => {
    dispatch(fetchCandidates({ skip: (page - 1) * itemsPerPage, limit: itemsPerPage, search: searchQuery }))
  }, [dispatch, searchQuery, page])


  const handleNextPage = () => {
    setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }
  const handleScheduleInterview = (candidateId: string) => {
    setSelectedCandidate(candidateId)
    setShowScheduleDialog(true)
  }

  // 1. Allowed status list
  const allowedStatuses = [
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "REJECTED",
  ] as const;

  // 2. Main allowed type
  type Status = typeof allowedStatuses[number];

  // 3. Extended type with fallback
  type DisplayStatus = Status | "NEW";

  // 4. Converter utility
  function toValidStatus(value: string | null | undefined): DisplayStatus {
    return value && allowedStatuses.includes(value as Status)
      ? (value as Status)
      : "NEW"; // fallback when invalid or null
  }

  console.log("candidate List", candidates)
  // 1. Declare allowed interview statuses
  const allowedInterviewStatuses = [
    "SCHEDULED",
    "CONFIRMED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
    "RESCHEDULED",
  ] as const;

  // 2. Create a type from the array
  type InterviewStatus = typeof allowedInterviewStatuses[number];

  // 3. Extended type with NOT_SCHEDULED for fallback
  type DisplayInterviewStatus = InterviewStatus | "NOT SCHEDULED";

  // 4. Utility to validate/convert raw string to DisplayInterviewStatus
  function toValidInterviewStatus(value: string | null | undefined): DisplayInterviewStatus {
    if (!value) return "NOT SCHEDULED";
    return allowedInterviewStatuses.includes(value as InterviewStatus)
      ? (value as InterviewStatus)
      : "NOT SCHEDULED";
  }


  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Candidates Management</h1>
          <p className="text-muted-foreground">125 total candidates, 45 new this week</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowBulkUploadDialog(true)}>
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Button className="flex items-center gap-2" onClick={() => setShowAddCandidateDialog(true)}>
            <UserPlus className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/4">
          {/* Search Input */}
          <div className="my-4">
            <Input
              type="search"
              placeholder="Search Candidate..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Candidates List */}
          <div>
            {/* Loading State */}
            {loading && <p>Loading...</p>}

            {/* Error State */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Candidate List */}
            {!loading && !error && candidates && candidates.length > 0 ? (
              candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  name={candidate.name}
                  location={candidate.location}
                  experience={candidate.experience}
                  appliedAt={candidate.createdAt}
                  aiMatch={Math.floor(Math.random() * 21) + 80}
                  education={candidate.education}// mock 80–100% match
                  applicationStatus={toValidStatus(candidate.applicationStatus)}
                  interviewStatus={toValidInterviewStatus(candidate.interviewStatus)}
                  phone={candidate.phone}
                  skills={candidate.skills}
                />
              ))
            ) : !loading && !error ? (
              <p>No candidates found.</p>
            ) : null}
          </div>


          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={(candidates?.length ?? 0) >= itemsPerPage}
            >
              Next
            </Button>



          </div>


        </div>
        <div className="lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Application Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="new" checked />
                      <label
                        htmlFor="new"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New (45)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="review" />
                      <label
                        htmlFor="review"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Review (32)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="interviewed" />
                      <label
                        htmlFor="interviewed"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Interviewed (28)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="offered" />
                      <label
                        htmlFor="offered"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Offered (20)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Position Applied</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Positions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Engineer</SelectItem>
                      <SelectItem value="product">Product Designer</SelectItem>
                      <SelectItem value="marketing">Marketing Manager</SelectItem>
                      <SelectItem value="sales">Sales Representative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (6+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer">
                      React
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      TypeScript
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Node.js
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      UI/UX
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      Figma
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="newyork">New York</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                      <SelectItem value="singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Add Candidate Dialog */}
      <AddCandidateModal showAddCandidateDialog={showAddCandidateDialog} setShowAddCandidateDialog={setShowAddCandidateDialog} />

      {/* Schedule Interview Dialog */}
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
              <Select>
                <SelectTrigger id="interviewType">
                  <SelectValue placeholder="Select type of Interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="behavioral">Behavioral Interview</SelectItem>
                  <SelectItem value="cultural">Cultural Fit</SelectItem>
                  <SelectItem value="ai">AI Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewer">Interviewer</Label>
              <Select>
                <SelectTrigger id="interviewer">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Smith</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                  <SelectItem value="ai">AI Interviewer</SelectItem>
                </SelectContent>
              </Select>
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

      {/* Bulk Upload Dialog */}
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

      {/* <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Image
                src="/images/candidate-management.png"
                alt="AI Match Score Chart"
                width={800}
                height={300}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Configure AI Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </MainLayout>
  )
}



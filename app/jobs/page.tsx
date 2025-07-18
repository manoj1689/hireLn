"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Filter, MoreVertical, Plus, Search } from "lucide-react"
import { fetchJobs, deleteJob } from "@/lib/slices/job/jobsList-slice"
import { AppDispatch } from "@/lib/store"
import ViewJobModal from "./ViewJobModal" 
import EditJobModal from "./EditJobModal"
import MatchedCandidateModal from "./MatchedCandidateModal" // Import MatchedCandidateModal

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'all'>('all')
  const [openModal, setOpenModal] = useState(false) // View Job Modal
  const [editOpenModal, setEditOpenModal] = useState(false) // Edit Job Modal
  const [openMatchedCandidateModal, setOpenMatchedCandidateModal] = useState(false) // Matched Candidates Modal
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const { jobs, loading, error } = useSelector((state: any) => state.jobsList)

  useEffect(() => {
    if (statusFilter !== 'all') {
      dispatch(fetchJobs({ skip: 0, limit: 10, status: statusFilter, search: searchQuery }))
    } else {
      dispatch(fetchJobs({ skip: 0, limit: 10, search: searchQuery }))
    }
  }, [dispatch, searchQuery, statusFilter])
console.log("job list",jobs)
  const openJobModal = (jobId: string) => {
    setSelectedJobId(jobId)
    setOpenModal(true)
  }

  const openEditJobModal = (jobId: string) => {
    setSelectedJobId(jobId)
    setEditOpenModal(true)
  }

  const openMatchedCandidateModalHandler = (jobId: string) => {
    setSelectedJobId(jobId)
    setOpenMatchedCandidateModal(true) // Open matched candidate modal
  }

  const closeAllModals = () => {
    setOpenModal(false)
    setEditOpenModal(false)
    setOpenMatchedCandidateModal(false)
    setSelectedJobId(null)
  }

  const handleDeleteJob = (DeleteJobId: string) => {
    if (DeleteJobId) {
      dispatch(deleteJob(DeleteJobId))
        .catch((error: any) => {
          console.error("Failed to delete the job:", error)
        })
    }
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings and track applications</p>
        </div>
        <Button asChild>
          <Link href="/jobs/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Job
          </Link>
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle>Active Job Postings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-600">{error}</TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <Link href={`/jobs/${job.id}`} className="hover:text-primary hover:underline">
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.applications}</TableCell>
                      <TableCell>
                        <Badge
                          variant={job.status === "ACTIVE" ? "default" : job.status === "DRAFT" ? "outline" : "secondary"}
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.postedDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openJobModal(job.id)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditJobModal(job.id)}>Edit Job</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openMatchedCandidateModalHandler(job.id)}>Matched Candidates</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteJob(job.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>24</strong> jobs
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewJobModal jobId={selectedJobId} openModal={openModal} closeModal={closeAllModals} />
      <MatchedCandidateModal jobId={selectedJobId} openModal={openMatchedCandidateModal} closeModal={closeAllModals} />
      <EditJobModal jobId={selectedJobId} openModal={editOpenModal} closeModal={closeAllModals} />
    </MainLayout>
  )
}

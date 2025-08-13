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
import { Briefcase, Filter, MoreVertical, Plus, Search, Home, Building } from "lucide-react"
import { fetchJobs, deleteJob } from "@/lib/slices/job/jobsList-slice"
import { AppDispatch } from "@/lib/store"
import ViewJobModal from "./ViewJobModal"
import EditJobModal from "./EditJobModal"
import MatchedCandidateModal from "./MatchedCandidateModal"

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


export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setselectedDepartment] = useState("")
  const [statusFilter, setStatusFilter] = useState<'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'all'>('all')
  const [openModal, setOpenModal] = useState(false)
  const [editOpenModal, setEditOpenModal] = useState(false)
  const [openMatchedCandidateModal, setOpenMatchedCandidateModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const { jobs, loading, error } = useSelector((state: any) => state.jobsList)

useEffect(() => {
  if (statusFilter !== 'all') {
    dispatch(fetchJobs({ skip: 0, limit: 10, status: statusFilter, search: searchQuery }));
  } else if (selectedDepartment !== 'all') {
    dispatch(fetchJobs({ skip: 0, limit: 10, department: selectedDepartment, search: searchQuery }));
  } else {
    dispatch(fetchJobs({ skip: 0, limit: 10, search: searchQuery }));
  }
}, [dispatch, searchQuery, statusFilter, selectedDepartment]);


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
    setOpenMatchedCandidateModal(true)
  }

  const closeAllModals = () => {
    setOpenModal(false)
    setEditOpenModal(false)
    setOpenMatchedCandidateModal(false)
    setSelectedJobId(null)
  }

  const handleDeleteJob = (DeleteJobId: string) => {
    if (DeleteJobId) {
      dispatch(deleteJob(DeleteJobId)).catch((error: any) => {
        console.error("Failed to delete the job:", error)
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">{status}</Badge>
      case "DRAFT":
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>
      case "PAUSED":
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>
      case "CLOSED":
        return <Badge className="bg-gray-200 text-gray-800">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }
  console.log("job list", jobs)
  return (
    <MainLayout>

      <div className="flex bg-primary-gradient items-center justify-between p-4 rounded-lg shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-white">Manage your job postings and track applications</p>
        </div>
        <Button asChild variant="outline">
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
              <Select value={selectedDepartment} onValueChange={(value) => setselectedDepartment(value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <SelectValue placeholder="Department" />
                </div>
              </SelectTrigger>
              <SelectContent>
               <SelectItem value="all">All Departments</SelectItem>
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
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
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Skills</TableHead>
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
                  jobs.map((job:any) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <Link href={`/jobs/${job.id}`} className="flex items-center gap-4 hover:text-primary hover:underline">
                          {job.isRemote ? <Home size={30} className=" text-primary " /> : <Building size={30} className="text-primary " />}
                          {job.title}
                        </Link>
                      </TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-96">
                          {(Array.isArray(job.skills) ? job.skills : String(job.skills).split(",")).map(
                            (skill: string, index: number) => {
                              // Generate a light random HSL color
                              const hue = Math.floor(Math.random() * 360);
                              const bgColor = `hsl(${hue}, 90%, 85%)`;
                              const textColor = `hsl(${hue},90%, 30%)`;

                              return (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 rounded-full text-xs font-normal"
                                  style={{ backgroundColor: bgColor, color: textColor }}
                                >
                                  {skill.trim()}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell>{new Date(job.updatedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openJobModal(job.id)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditJobModal(job.id)}>Edit Job</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openMatchedCandidateModalHandler(job.id)}>Matched Candidates</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteJob(job.id)}>Delete</DropdownMenuItem>
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
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">Next</Button>
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

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import EditCandidateModal from "./edit-candidate.tsx/page"
import { useDispatch } from "react-redux"
import { CandidateResponse } from "@/interface/candidate"
import { AppDispatch } from "@/lib/store"
import { deleteCandidate } from "@/lib/slices/candidate/candidate-slice"
import { useRouter } from "next/navigation"

interface CandidateProps {
  candidate: CandidateResponse
}

export const CandidateCard = ({ candidate }: CandidateProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const router=useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    id: candidateId,
    name = "N/A",
    email,
    interviewStatus,
    location,
    applicationStatus,
    technicalSkills = [],
    createdAt
  } = candidate

  const applicationStatusColor: Record<string, string> = {
    NEW: "bg-red-100 text-red-600",
    INVITED:"bg-pink-100 text-pink-600",
    APPLIED: "bg-blue-100 text-blue-600",
    SCREENING: "bg-yellow-100 text-yellow-700",
    INTERVIEW: "bg-purple-100 text-purple-600",
    OFFER: "bg-green-100 text-green-600",
    HIRED: "bg-emerald-100 text-emerald-600",
    REJECTED: "bg-gray-200 text-gray-600"
  }

  const interviewStatusStyles: Record<string, string> = {
    "NOT SCHEDULED": "bg-gray-200 text-gray-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
    RESCHEDULED: "bg-purple-100 text-purple-700"
  }

  const openEditCandidateModal = () => setIsModalOpen(true)

  return (
    <>
      <Card className="flex flex-row gap-4 p-4 rounded-xl shadow-md bg-white">
        {/* Candidate Info */}
        <div className="w-4/5 flex flex-col">
          <div className="flex gap-4 items-start mb-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-stone-500">
              {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-2 items-center">
                <span className="font-medium text-neutral-800 text-lg">{name}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${applicationStatusColor[applicationStatus ?? "NEW"]}`}>
                  {applicationStatus ?? "NEW"}
                </span>
              </div>
              {location && <p className="text-sm text-gray-600">{location}</p>}
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
            </div>
          </div>



          <div className="flex flex-wrap gap-2 mt-2">
            {(Array.isArray(technicalSkills) ? technicalSkills : String(technicalSkills).split(",")).map((skill: string, index: number) => {
              const hue = Math.floor(Math.random() * 360)
              return (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full text-xs font-light"
                  style={{
                    backgroundColor: `hsl(${hue}, 90%, 85%)`,
                    color: `hsl(${hue}, 30%, 40%)`
                  }}
                >
                  {skill.trim()}
                </span>
              )
            })}
          </div>
        </div>

        {/* Actions */}
    <div className="w-1/5 flex justify-end items-start">
  <div className="flex h-full flex-col justify-around items-end gap-2 text-sm">
    {/* Interview Status */}
    <div className={`text-xs px-3 py-1 rounded-lg italic font-semibold ${interviewStatusStyles[interviewStatus ?? "NOT SCHEDULED"]}`}>
      {interviewStatus ?? "NOT SCHEDULED"}
    </div>

    {/* Dropdown Menu */}
    <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
         <DropdownMenuItem onClick={() => router.push(`/candidates/details-candidate?candidate_id=${candidateId}`)}>View Details</DropdownMenuItem>
        {/* <DropdownMenuItem onClick={openEditCandidateModal}>Edit</DropdownMenuItem> */}
        <DropdownMenuItem>Share</DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => dispatch(deleteCandidate(candidateId))}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>


    {/* Created Date */}
    <div className="text-gray-400 text-xs">
      {createdAt && !isNaN(new Date(createdAt).getTime())
        ? new Date(createdAt).toISOString().split("T")[0]
        : "Date N/A"}
    </div>
  </div>
</div>

      </Card>

      {/* Modal */}
      {isModalOpen && (
        <EditCandidateModal
          candidate={candidate}
          candidateId={candidateId}
          openModal={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

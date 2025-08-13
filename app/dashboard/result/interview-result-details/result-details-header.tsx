"use client"

import { ApplicationStatus } from "@/interface/types/applicationTypes"
import { AppDispatch } from "@/lib/store"
import { Download } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { updateApplication } from "@/lib/slices/applicant/application-slice"
import { Select } from "react-day-picker"

interface ResultDetailHeaderProps {
  applicationId: string;
  interview: {
    interviewStatus: InterviewStatus
    status: ApplicationStatus
  }
  onExport?: () => void
  onCompare?: () => void
  onScheduleFollowUp?: () => void
}
console.log("interview Status")
type InterviewStatus =
  | "NOT SCHEDULED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED"

const interviewStatusStyles: Record<InterviewStatus, string> = {
  "NOT SCHEDULED": "bg-gray-200 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
  RESCHEDULED: "bg-purple-100 text-purple-700",
}


const nextStatusOptions: ApplicationStatus[] = [
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
]


export function ResultDetailHeader({ interview, applicationId }: ResultDetailHeaderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("")

  if (!interview) return null // Prevent crash if interview is null

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    dispatch(
      updateApplication({
        applicationId: applicationId,
        updateData: {
          status: newStatus,
          notes: "",
          matchScore: 0,
        },
      })
    )
    setSelectedStatus("")
  }



  return (
    <div className="flex w-full flex-col lg:flex-row bg-primary-gradient space-y-4 justify-between p-4 shadow-lg rounded-lg">
      <div>
        <h1 className="text-3xl text-white font-bold tracking-tight">Candidate Interview Details</h1>
        <p className="text-white">Review and analysis of completed AI interview</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 items-end lg:items-center">
        {/* Interview Status Badge */}
        {interview.interviewStatus && (
          <span
            className={`px-3 py-1 rounded-full font-medium text-sm whitespace-nowrap ${interviewStatusStyles[interview.interviewStatus]}`}
          >
            {interview.interviewStatus}
          </span>
        )}

        {/* Application Status Dropdown */}
        {interview.interviewStatus === "COMPLETED" && (
          <Select
            value={selectedStatus}
            onChange={(e) => {
              const value = e.target.value as ApplicationStatus
              setSelectedStatus(value)
              handleStatusChange(value) // Call here directly
            }}
            className="border-2 border-sky-100 text-sm bg-white rounded-full px-3 py-2 shadow-lg text-neutral-700 focus:outline-none"
          >
            <option value="">Application Status</option>
            {nextStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        )}
      </div>
    </div>
  )
}
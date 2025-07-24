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

interface CandidateProps {
  name: string
  location: string
  education: string
  experience: string
  appliedAt: string
  aiMatch: number
  applicationStatus: "NEW" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED"
  interviewStatus:
  | "NOT SCHEDULED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED"
  phone: string
  skills: string[]
  avatarUrl?: string
}

export const CandidateCard = ({
  name,
  location,
  experience,
  appliedAt,
  aiMatch,
  education,
  applicationStatus,
  interviewStatus,
  phone,
  skills,
  avatarUrl
}: CandidateProps) => {
  const applicationStatusColor: Record<string, string> = {
    NEW: "bg-red-100 text-red-600",
    APPLIED: "bg-blue-100 text-blue-600",
    SCREENING: "bg-yellow-100 text-yellow-700",
    INTERVIEW: "bg-purple-100 text-purple-600",
    OFFER: "bg-green-100 text-green-600",
    HIRED: "bg-emerald-100 text-emerald-600",
    REJECTED: "bg-gray-200 text-gray-600"
  }

  const interviewStatusStyles: Record<CandidateProps["interviewStatus"], string> = {
    "NOT SCHEDULED": "bg-gray-200 text-gray-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
    RESCHEDULED: "bg-purple-100 text-purple-700"
  }

  return (
    <Card className="relative p-4 rounded-xl shadow-md bg-white  ">
      {/* Status Badge */}
      {applicationStatus === "NEW" && (
        <div className="absolute top-3 left-3 text-xs px-2 py-1 bg-red-500 text-white rounded-full font-medium">
          New
        </div>
      )}

      {/* 3-Dot Menu */}
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar and Info */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-stone-500">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {education || "Degree info not available"}
        </p>
      </div>
      {/* Interview Status */}
      {/* <div className="mt-4 flex justify-end">
        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${interviewStatusStyles[interviewStatus]}`}
        >
          {interviewStatus}
        </span>
      </div> */}
      {/* Name & Salary */}
      <div className="bg-blue-50 py-2 px-3 gap-4 rounded flex justify-between items-center my-4">
        <div>
          <p className="font-medium text-gray-800 text-lg">{name}</p>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-900">$25000</p>
          <p className="text-xs text-gray-600">Salary Expectation</p>
        </div>
      </div>


      {/* Skills & Phone */}
      <div className="space-y-8 text-sm mb-4">
        {/* Skills Section */}
        <div className="flex items-start gap-8 ">
          <span className="w-20 font-semibold text-[#3B82F6]">Skills</span>
          <div className="flex flex-wrap gap-1 ">
            {(Array.isArray(skills) ? skills : String(skills).split(",")).map(
              (skill: string, index: number) => {
                const hue = Math.floor(Math.random() * 360);
                const bgColor = `hsl(${hue}, 90%, 85%)`;
                const textColor = `hsl(${hue}, 30%, 40%)`;
                return (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {skill.trim()}
                  </span>
                );
              }
            )}
          </div>
        </div>
        {/* Phone Section */}
        <div className="flex gap-8">
          <span className="w-20 font-semibold text-[#3B82F6]">Phone</span>
          <span>{phone}</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex mt-3 text-sm text-neutral-500  text-center px-2">
        {experience}
      </div>
    </Card>
  )
}

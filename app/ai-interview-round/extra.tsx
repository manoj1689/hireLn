"use client"

import React, { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import {
  fetchInterviewJoin,
  confirmInterview,
} from "@/lib/slices/join_interview/interviewJoinSlice"
import InterviewJoinScreen from "./InterviewJoinScreen"

const InterviewInfoPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("interview_id") || ""
  const token = searchParams.get("token") || ""
  const status = searchParams.get("status") || ""

  const dispatch = useDispatch<AppDispatch>()
  const { interview, loading, error, confirmationMessage } = useSelector(
    (state: RootState) => state.joinInterview
  )
console.log("interview id",interviewId,token)
  // Fetch the interview
  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewJoin({ interviewId, token }))
    }
  }, [interviewId, token, dispatch])
  console.log("interview",interview)
  // Handle confirmation after successful join
  useEffect(() => {
    if (status === "joined" && interview?.id) {
      dispatch(
        confirmInterview({ interviewId: interview.id, responseMessage: "interview start" })
      )
    }
  }, [status, interview?.id, dispatch])

  if (loading) return <p className="p-6">Loading...</p>
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!interview) return <p className="p-6">No interview found.</p>

  // 🎥 Show Interview Screen
  if (status === "joined") {
    return (
      <div className="p-6 container mx-auto">
      
        {confirmationMessage && <p className="mt-2 text-green-600">✅ {confirmationMessage}</p>}
      </div>
    )
  }
 console.log("seduleded interview time",interview.scheduledAt)
  // 📋 Show Instructions
  return (
    <div className="p-6 container mx-auto">
     <InterviewJoinScreen interview={interview}  />
    </div>
  )
}

export default InterviewInfoPage  

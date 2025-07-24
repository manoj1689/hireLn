"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"

import {
  fetchInterviewJoin,
  confirmInterview,
} from "@/lib/slices/join_interview/interview-join-slice"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import utc from "dayjs/plugin/utc"
import { ColorRing } from 'react-loader-spinner'

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

dayjs.extend(duration)
dayjs.extend(utc)

const InterviewInfoPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("interview_id") || ""
  const token = searchParams.get("token") || ""
  const dispatch = useDispatch<AppDispatch>()

  const { interview, loading, error, confirmationMessage, redirectUrl, status } =
    useSelector((state: RootState) => state.joinInterview)

  const [remainingTime, setRemainingTime] = useState("")
  const [canJoin, setCanJoin] = useState(true)
  const [responseMsg, setResponseMsg] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [toastShown, setToastShown] = useState(false)
  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewJoin({ interviewId, token }))
    }
  }, [interviewId, token, dispatch])

  const handleConfirmInterview = () => {
    if (interview?.id) {
      setConfirming(true)
      dispatch(
        confirmInterview({ interviewId: interview.id, responseMessage: responseMsg })
      )
    }
  }

  useEffect(() => {
    if (!interview?.scheduledAt) return

    const interval = setInterval(() => {
      const now = dayjs()
      const scheduledTime = dayjs.utc(interview.scheduledAt).local()
      const diff = scheduledTime.diff(now)

      if (diff <= 0) {
        setCanJoin(true)
        setRemainingTime("✅ Interview can be joined now!")
        clearInterval(interval)
      } else {
        const d = dayjs.duration(diff)
        const display = [
          d.asDays() > 0 ? `${Math.floor(d.asDays())}d` : null,
          `${String(d.hours()).padStart(2, "0")}h`,
          `${String(d.minutes()).padStart(2, "0")}m`,
          `${String(d.seconds()).padStart(2, "0")}s`,
        ]
          .filter(Boolean)
          .join(" ")

        setRemainingTime(display)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [interview?.scheduledAt])

  useEffect(() => {
    if (status === "CONFIRMED") {
      router.push(`/ai-interview-test?interview_id=${interview.id}&token=${token}`)
    }
  }, [status, interview?.id, token, router])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    if (interviewId && confirmationMessage && !toastShown) {
      console.log("confirmation", confirmationMessage)

      timeoutId = setTimeout(() => {
        toast.success(confirmationMessage, {
          position: "top-right",
          autoClose: 2000,
        })
        setToastShown(true)
      }, 2000) // 20 seconds
    }

    return () => clearTimeout(timeoutId) // Cleanup on unmount
  }, [interviewId, confirmationMessage, toastShown])


  if (loading || confirming) {
    return <div className="flex items-center justify-center h-screen ">
      <div className="flex flex-col w-full gap-8">
        <div className="flex w-full justify-center">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </div>
        <div className="flex justify-center text-lg lg:text-2xl font-semibold text-stone-600">
          Confirming Interview ....
        </div>
      </div>
    </div>
  }

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>
  if (!interview) return <p className="p-6">No interview found.</p>

  return (
    <div className="p-6 container mx-auto flex min-h-screen flex-col lg:flex-row gap-6">
      <ToastContainer />
      {/* Left: Company Info */}
      <div className="flex flex-col w-full lg:w-1/3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-6 rounded-2xl shadow-xl justify-around text-white">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            HireLn
          </h2>
          <p className="mt-2 text-xl text-white/90">
            AI-powered hiring made smarter. Automate your recruitment with resume screening, job publishing, and AI interviews.
          </p>
        </div>

        <div className="w-12 h-1 bg-white/30 my-4 mx-auto rounded-full" />

        <div>
          <h3 className="text-lg font-bold mb-3">✨ Platform Highlights</h3>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              "Smart resume analysis with AI scoring",
              "Automated job posting across portals",
              "AI-conducted & evaluated interviews",
              "Real-time candidate performance feedback",
              "Collaborative dashboard for hiring teams"
            ].map((feature, idx) => (
              <span
                key={idx}
                className="bg-white/10 backdrop-blur-sm text-base text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-white/80 hover:text-white underline transition"
          >
            🔗 Learn more at HireLn.com
          </a>
        </div>
      </div>

      {/* Right: Interview Info */}
      <div className="flex flex-col w-full h-auto lg:w-2/3 bg-white p-8 rounded-2xl shadow-xl justify-center space-y-6">
        <div className="p-6 container mx-auto">
          {/* ✅ Removed inline message since toast shows it */}
        </div>

        <div>Interview Status: {status}</div>

        <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
          🎯 Interview Invitation
        </h1>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-semibold shadow-inner">
            {interview.candidateName?.charAt(0).toUpperCase()}
          </div>
          <p className="mt-2 text-lg font-medium text-gray-800">{interview.candidateName}</p>
          <span className="text-sm text-gray-500">Candidate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base">
          <p><span className="font-semibold">🧑‍💼 Job Title:</span> {interview.jobTitle}</p>
          <p><span className="font-semibold">📋 Notes:</span> {interview.notes}</p>
          <p><span className="font-semibold">🗣️ Feedback:</span> {interview.feedback || "N/A"}</p>
          <p className="sm:col-span-2">
            <span className="font-semibold">📅 Scheduled At:</span>{" "}
            {dayjs(interview.scheduledAt).format("MMMM D, YYYY h:mm A")}
          </p>
          <span className="text-sm text-gray-500">({interview.timezone})</span>
        </div>

        <div className="flex flex-col text-center">
          <span className="text-cyan-600 font-bold text-lg">Remaining Time</span>
          <span className="text-slate-600 font-bold text-3xl">{remainingTime}</span>
        </div>

        {/* CTA Buttons */}
        {status === "JOINED" && canJoin && (
          <>
            <textarea
              placeholder="Write your confirmation message..."
              value={responseMsg}
              onChange={(e) => setResponseMsg(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
              rows={4}
            />
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              onClick={handleConfirmInterview}
            >
              ✅ Confirm Interview
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default InterviewInfoPage

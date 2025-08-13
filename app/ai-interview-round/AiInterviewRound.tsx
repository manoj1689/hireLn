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
import {
  Bot,
  Search,
  ClipboardList,
  FileText
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Calendar, Clock, Mail, MapPin, Video } from "lucide-react"
import { FaMapMarkerAlt } from "react-icons/fa"
import AuthNavbar from "@/components/auth-navbar/page"

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
  console.log("interview ", interview)

  return (
    <>
      <div>
        <AuthNavbar />
      </div>
      <div className="pt-24 p-6 container mx-auto flex min-h-screen flex-col lg:flex-row gap-6">
        <ToastContainer />
        {/* Left: Candidate Info*/}

        <div className="w-full  lg:w-1/4">
          {/* Candidate Profile Card */}
          <div className="shadow-sm rounded-lg bg-white">
            {/* Header */}
            <div className="flex flex-col w-full bg-primary-gradient rounded-t-lg py-4 justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-stone-600">
                  {interview.candidateName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{interview.candidateName}</h1>




              </div>
            </div>

            <div className="p-4 space-y-4 ">
              {/* Contact Info */}
              <div className="flex flex-col gap-4 w-full ">
                <a href={`mailto:${interview.candidateEmail}`} className="block">
                  <div className="flex items-center gap-2 text-gray-800 break-all">
                    <Mail className="text-sky-500 w-4 h-4" />
                    <span className="text-sm">{interview.candidateEmail}</span>
                  </div>
                </a>

                {interview.candidateLocation && (
                  <div className="flex items-center gap-2 text-gray-800">
                    <MapPin className="text-orange-500 w-4 h-4" />
                    <span>{interview.candidateLocation}</span>
                  </div>
                )}
              </div>
              <div>
                {/* Education */}
                {Array.isArray(interview.candidateEducation) && interview.candidateEducation.length > 0 && (
                  <div className="bg-slate-100 p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-blue-500 font-semibold ">Education</h3>

                    {interview.candidateEducation.map((edu, index) => (
                      <div
                        key={index}
                        className="flex flex-col  items-start lg:items-center gap-4 "
                      >
                        {/* Left: Degree + Institution + Location */}
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-gray-900">{edu.degree}</p>
                          <p className="text-base font-medium text-gray-500">{edu.institution}</p>
                          {edu.location && (
                            <p className="text-sm text-gray-500">{edu.location}</p>
                          )}
                        </div>

                        {/* Right: Dates & Grade */}
                        <div className="flex flex-col items-start lg:items-end text-sm text-gray-600">
                          {(edu.start_date || edu.end_date) && (
                            <span>
                              {edu.start_date} - {edu.end_date || "Present"}
                            </span>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Skills */}
              <div className=" space-y-2">
                <span className="font-semibold text-[#3B82F6]">Skills</span>
                {/* Candidate Skills */}
                {Array.isArray(interview.candidateSkills) && interview.candidateSkills.length > 0 && (

                  <div className="flex flex-wrap gap-2">
                    {interview.candidateSkills.map((skill: string, idx: number) => {
                      const hue = 180 + (idx * 40) % 360;
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `hsl(${hue}, 80%, 85%)`,
                            color: `hsl(${hue}, 60%, 35%)`,
                            border: `1px solid hsl(${hue}, 60%, 70%)`,
                          }}
                        >
                          {skill.trim()}
                        </span>
                      );
                    })}
                  </div>

                )}
              </div>


              {/* Experience */}
              <div className="flex flex-col space-y-2">


                {Array.isArray(interview.candidateExperience) && interview.candidateExperience.length > 0 && (
                  <div className="bg-slate-100 p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-blue-500 font-semibold ">Experience</h3>

                    {interview.candidateExperience.map((exp, index) => (
                      <div
                        key={index}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b last:border-b-0 pb-4 mb-4 last:pb-0 last:mb-0"
                      >
                        {/* Left: Job Title + Company + Location */}
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-gray-900">{exp.jobTitle}</p>
                          <p className="text-base font-medium text-gray-500">{exp.company}</p>
                          {exp.location && (
                            <p className="text-sm text-gray-500">{exp.location}</p>
                          )}
                        </div>

                        {/* Right: Dates & Description */}
                        <div className="flex flex-col items-start lg:items-end text-sm text-gray-600">
                          {(exp.start_date || exp.end_date) && (
                            <span>
                              {exp.start_date} - {exp.end_date || "Present"}
                            </span>
                          )}
                          {exp.description && (
                            <span className="mt-1 text-gray-600 max-w-xs text-sm">
                              {exp.description}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* <span className="text-sm font-normal text-stone-500">{interview.candidateExperience}</span> */}
              </div>
              {/* Notes */}
              {interview.notes && (
                <>
                  <h4 className="text-md font-semibold text-gray-800 my-2">Notes</h4>
                  <div className="bg-orange-100 p-4 rounded-lg shadow-sm border-2 border-orange-200 border-dashed">
                    <p className="text-sm text-orange-700 leading-relaxed">{interview.notes}</p>
                  </div>
                </>
              )}
              {/* Candidate Links */}
              <div className="flex gap-4 justify-around px-4 py-8">
                {interview.candidateGitHub && (
                  <a href={interview.candidateGitHub} target="_blank" rel="noopener noreferrer">
                    <img src="/images/candidate/github.png" alt="GitHub" className="w-12" />
                  </a>
                )}
                {interview.candidateLinkedIn && (
                  <a href={interview.candidateLinkedIn} target="_blank" rel="noopener noreferrer">
                    <img src="/images/candidate/linkedin.png" alt="LinkedIn" className="w-12" />
                  </a>
                )}
                {interview.candidateResume && (
                  <a href={interview.candidateResume} target="_blank" rel="noopener noreferrer">
                    <img src="/images/candidate/download.png" alt="Download" className="w-12" />
                  </a>
                )}

              </div>
            </div>

          </div>
        </div>

        <div className="w-full lg:w-3/4">
          {/* Interview Info Block */}
          <div className="flex flex-col lg:flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4 justify-between items-center">
            <div className="w-full lg:w-2/3 xl:w-1/2">
              <h3 className="text-neutral-700 font-bold text-2xl">{interview.jobTitle}</h3>
              <p className="text-sm text-sky-400 italic ">{interview.jobEducation}</p>
              <p className="text-lg text-gray-500 ">{interview.jobDepartment}</p>
            </div>

            <div className="space-y-1 gap-4 text-sm w-full lg:w-1/3 xl:w-1/2 text-end">
              {interview.status && (
                <div className="flex justify-end">
                  <span className="font-medium bg-rose-400 px-2 py-1 rounded-full text-white text-sm">{interview.status}</span>
                </div>
              )}

            </div>
          </div>
          {/* Skills & Languages */}
          <div >
            {/* Job Skills */}
            {Array.isArray(interview.jobSkills) && interview.jobSkills.length > 0 && (
              <div className="w-full my-4 ">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Job Skills</h4>
                <div className="flex flex-row gap-2">
                  {interview.jobSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-0.5 rounded-lg text-white text-sm font-medium bg-emerald-400"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}


          </div>
          {/* Interview Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Type */}
            <div className="bg-red-100 rounded-xl py-4">
              <div className="flex justify-start">
                <span className="text-sm font-semibold bg-red-400 text-white px-2 py-1 rounded-r-lg mb-2">Type</span>
              </div>
              <div className="px-4 flex flex-col items-center justify-center text-center">
                <Video className="w-10 h-10 text-red-400 mb-2" />
                <p className="text-sm text-stone-400 capitalize">Interview Mode</p>
                <p className="text-lg font-semibold text-stone-500 capitalize">
                  {interview.interviewType || "N/A"}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="bg-green-100 rounded-xl py-4">
              <div className="flex justify-start">
                <span className="text-sm font-semibold bg-green-400 text-white px-2 py-1 rounded-r-lg mb-2">Status</span>
              </div>
              <div className="px-4 flex flex-col items-center justify-center text-center">
                <Calendar className="w-10 h-10 text-green-400 mb-2" />
                <p className="text-sm text-stone-400">Interview Status</p>
                <p className="text-lg font-semibold text-stone-500 capitalize">{interview.status}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="bg-blue-100 rounded-xl py-4">
              <div className="flex justify-start">
                <span className="text-sm font-semibold bg-blue-400 text-white px-2 py-1 rounded-r-lg mb-2">Duration</span>
              </div>
              <div className="px-4 flex flex-col items-center justify-center text-center">
                <Clock className="w-10 h-10 text-blue-400 mb-2" />
                <p className="text-sm text-stone-400">Duration (minutes)</p>
                <p className="text-lg font-semibold text-stone-500">{interview.duration || "N/A"}</p>
              </div>
            </div>

            {/* Department */}
            <div className="bg-orange-100 rounded-xl py-4">
              <div className="flex justify-start">
                <span className="text-sm font-semibold bg-orange-400 text-white px-2 py-1 rounded-r-lg mb-2">Location</span>
              </div>
              <div className="px-4 flex flex-col items-center justify-center text-center">
                <FaMapMarkerAlt className="w-10 h-10 text-orange-400 mb-2" />
                <p className="text-sm text-stone-400">Job Location</p>
                <p className="text-lg font-semibold text-stone-500">{interview.location || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {/* {interview.jobDescription && (
            <>
              <h4 className="text-md font-semibold text-gray-800 my-2">Description</h4>
              <div className="bg-orange-100 p-4 rounded-lg shadow-sm border-2 border-orange-200 border-dashed">
                <p className="text-sm text-orange-700 leading-relaxed">{interview.jobDescription}</p>
              </div>
            </>
          )} */}

          {/* Responsibilities */}
          {/* {Array.isArray(interview.jobResponsibility) && interview.jobResponsibility.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 my-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Responsibilities</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {interview.jobResponsibility.map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>
          </div>
        )} */}

          <h4 className="text-lg font-semibold text-gray-800 my-4">Interviewer Panel</h4>
          {Array.isArray(interview.interviewers) && interview.interviewers.length > 0 && (
            <div className="bg-slate-200 p-4 rounded-xl border border-gray-200 shadow-sm ">

              {interview.interviewers.map((person: any, index: number) => (
                <div key={index} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Left: Avatar + Name + Role + Tags */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
                      {person.avatar ? (
                        <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xl">
                          <img src="./images/Avatar/MaleUsAi.jpeg" alt={person.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-base font-semibold text-gray-900">{person.name}</p>
                      <p className="text-base font-medium text-gray-500 flex items-center gap-1">  <Mail className="w-4 h-4 text-sky-500" /> {person.email}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Bot className="w-4 h-4 text-sky-500" />
                        {person.role || "Virtual Assistant"}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {person.tags?.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className={`text-xs font-medium px-2 py-1 rounded-full ${i === 0 ? "bg-rose-100 text-rose-600" :
                              i === 1 ? "bg-blue-100 text-blue-600" :
                                "bg-purple-100 text-purple-600"
                              }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Features */}
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2 text-sky-900 font-medium">
                      <Search className="w-4 h-4 text-sky-500" /> Automated Q&A
                    </div>
                    <div className="flex items-center gap-2 text-sky-900 font-medium">
                      <ClipboardList className="w-4 h-4 text-sky-500" /> Tailored based on job profile
                    </div>
                    <div className="flex items-center gap-2 text-sky-900 font-medium">
                      <FileText className="w-4 h-4 text-sky-500" /> Real-time evaluation
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="my-4">
            <div className="flex flex-col text-center pb-4">
              <div className="flex justify-center items-center gap-2 text-cyan-600 font-bold text-lg">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>Time Left</span>
              </div>
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
                <div className="flex w-full justify-center mt-4 ">

                  <button
                    className="px-12 bg-primary-gradient text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all"
                    onClick={handleConfirmInterview}
                  >
                    Confirm Interview
                  </button>
                </div>

              </>
            )}
          </div>
        </div>



      </div>

    </>

  )
}

export default InterviewInfoPage

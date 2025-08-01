"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"

import {
  fetchInterviewQuestions,
} from "@/lib/slices/questions/interview-question-Slice"
import {
  generateInterviewQuestions,
} from "@/lib/slices/aitools/generate-interview-questions"
import { bulkUploadQuestions } from "@/lib/slices/questions/upload-bulk-questions"
import { Button } from "@/components/ui/button"
import { ShowTimer } from "@/components/interview/ShowTimer"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import AIChat from "@/components/interview/AIChat"
import Checklist from "@/components/interview/Checklist"
import QuestionPerformance from "@/components/interview/QuestionPerformance"
import VideoInterfacePage from "@/components/interview/videoInterface"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import SpeakingAvatar from "@/components/interview/SpeakingAvatar"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"

import PreventBackForward from "@/components/BlockBackForward"
import { RotatingLines } from "react-loader-spinner"

import { Lightbulb } from "lucide-react"
import { PiBuildingOffice } from "react-icons/pi"

const InterviewScreenPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const interviewId = searchParams.get("interview_id") || ""
  const token = searchParams.get("token") || ""

  const [toastShown, setToastShown] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "performance">("chat")
  const [transcript, setTranscript] = useState("")
  const [showTranscript, setShowTranscript] = useState(true)
  const [interviewReady, setInterviewReady] = useState(false)
  const [examStatus, setExamStatus] = useState("")
  const [faceDetectionResults, setFaceDetectionResults] = useState({
    faceVerified: false,
    multiplePeopleDetected: false,
  })
  const [permissions, setPermissions] = useState({
    camera: true,
    microphone: true,
    devToolsOpen: false,
    fullscreen: false,
    tabActive: true,
  })

  const {
    interview,
    loading: interviewLoading,
    error: interviewError,
    confirmationMessage,
    status,
  } = useSelector((state: RootState) => state.joinInterview)

  const {
    questions,
    loading: questionLoading,
    error: questionError,
  } = useSelector((state: RootState) => state.interviewQuestions)

  const {
    loading: uploadLoading,
    error: uploadError,
  } = useSelector((state: RootState) => state.bulkUploadQuestions)

  const checkFullscreenStatus = useCallback(() => {
    setPermissions((prev) => ({ ...prev, fullscreen: !!document.fullscreenElement }))
  }, [])

  const handleVisibilityChange = useCallback(() => {
    setPermissions((prev) => ({ ...prev, tabActive: document.visibilityState === "visible" }))
  }, [])

  const detectDevToolsOpen = useCallback(() => {
    const threshold = 100
    const devToolsOpen = window.outerWidth - window.innerWidth > threshold
    setPermissions((prev) => ({ ...prev, devToolsOpen }))
  }, [])

  useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreenStatus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("resize", detectDevToolsOpen)
    checkFullscreenStatus()
    handleVisibilityChange()
    detectDevToolsOpen()
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreenStatus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("resize", detectDevToolsOpen)
    }
  }, [checkFullscreenStatus, detectDevToolsOpen, handleVisibilityChange])

  // Toast Effect MUST be outside any conditional return
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (interviewId && confirmationMessage && interviewReady && !toastShown) {
      timeoutId = setTimeout(() => {
        toast.success(confirmationMessage, {
          position: "top-right",
          autoClose: 2000,
        })
        setToastShown(true)
      }, 2000)
    }
    return () => clearTimeout(timeoutId)
  }, [interviewId, confirmationMessage, interviewReady, toastShown])

  // Generate + Upload + Fetch Questions
  useEffect(() => {
    const alreadyRun = sessionStorage.getItem(`interview_ready_${interview?.id}`)
    if (alreadyRun || interviewReady) return

    const generateAndUpload = async () => {
      if (
        status === "IN_PROGRESS" &&
        interview?.id &&
        interview?.jobId &&
        interview?.candidateId &&
        interview?.interviewType &&
        token
      ) {
        sessionStorage.setItem(`interview_ready_${interview.id}`, "true")

        const result = await dispatch(generateInterviewQuestions({
          jobId: interview.jobId,
          candidateId: interview.candidateId,
          interviewType: interview.interviewType,
          numberOfQuestions: 4,
          token,
        }))

        const data = result.payload as any
        if (data?.questions?.length) {
          await dispatch(bulkUploadQuestions({
            interview_id: interview.id,
            token,
            questions: data.questions,
          }))
          await dispatch(fetchInterviewQuestions({ interviewId: interview.id, token }))
          setInterviewReady(true)
        }
      }
    }

    generateAndUpload()
  }, [
    status,
    interview?.id,
    interview?.jobId,
    interview?.candidateId,
    interview?.interviewType,
    token,
    interviewReady,
    dispatch,
  ])

  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript)
  }

  const handleExamEnd = async () => {
    router.push(`/ai-interview-result?interview_id=${interview.id}&token=${token}`)
    console.log("exam ended")
  }

  // 🔁 EARLY RETURNS (but hooks are already above this!)
  if (examStatus === "COMPLETED") {
    return <p className="p-6 text-blue-600">Exam Ending...</p>
  }



  if (interviewLoading) return <p className="p-6">Loading interview...</p>
  if (interviewError) return <p className="p-6 text-red-500">Error: {interviewError}</p>
  if (!interview) return <p className="p-6">No interview found.</p>


  if (questionLoading || uploadLoading || !interviewReady) {
    return <div className="flex items-center justify-center h-screen ">
      <div className="flex flex-col w-full gap-8">
        <div className="flex w-full justify-center">
          <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="#F472B6"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
        <div className="flex justify-center text-lg lg:text-2xl font-semibold text-stone-600">
          Your AI-powered interview questions are on their way...
        </div>
      </div>
    </div>
  }
  if (questionError || uploadError) {
    return <p className="p-6 text-red-500">Error: {questionError || uploadError}</p>
  }

  function setShowTipsModal(arg0: boolean): void {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="">
      {/* <PreventBackForward /> */}
      <ToastContainer />
      <header className="flex  rounded-lg bg-cyan-50 border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">

              <img
                src="/images/logo/company-logo.png"
                alt="Company Logo"
                className="w-28"
              />

            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTipsModal(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Quick Tips
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-4 px-4 space-y-4  mt-4 rounded-lg">
        <section>
          <Card className="bg-gradient-to-r from-sky-400 to-pink-400 rounded-xl shadow-md">
            <div className="flex justify-between items-center px-6 py-4 text-white text-sm sm:text-base font-medium">
              {/* Left Side: Job Title & Date */}
              <div >
                <div className="flex gap-4">
                  <div>
                    <PiBuildingOffice size={40} />

                  </div>
                  <div>
                    <p>

                      {interview.jobTitle}
                    </p>
                    <p>

                      {interview.jobEducation}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap mt-2 gap-2">
                  {interview.jobSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-sky-300 shadow-md rounded-full px-2 py-1  text-xs font-medium text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Duration, Type, Status */}
              <div className="flex flex-col  items-center">
                <p>
                  Status
                </p>
                <p>

                  <span className="font-bold text-yellow-300">{interview.status}</span>
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* <p className="mt-4 text-gray-700">
        Questions uploaded and fetched successfully. Total: {questions.length}
      </p> */}

        <section className="flex flex-col lg:flex-row gap-4 h-auto   ">
          <div className="flex flex-col  lg:w-3/5  space-y-4 justify-around items-center  lg:border-l-2 lg:border-r-2 px-4 ">
            <div className="flex w-full justify-center mt-4 ">
              <VideoInterfacePage
                permissions={permissions}
                setPermissions={setPermissions}
                faceDetectionResults={faceDetectionResults}
                setFaceDetectionResults={setFaceDetectionResults}
                examStatus={examStatus}
              />
            </div>





            <div className="flex flex-col lg:flex-row w-full bg-gray-200 rounded-lg min-h-32 shadow-lg mx-auto relative p-2">
              {/* Toggle Button */}
              <button
                className="absolute top-2 right-2 p-2 md:p-3 z-10"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {!showTranscript ? (
                  <IoMdEye className="text-gray-600" size={24} />
                ) : (
                  <IoMdEyeOff className="text-gray-600" size={24} />
                )}
              </button>

              {/* Avatar Section */}
              <div className={`flex w-full lg:w-1/4 lg:border-r-2  border-gray-300 justify-center items-center transition-all duration-300 ${showTranscript ? 'opacity-100' : 'opacity-0'} max-sm:hidden`}>
                <SpeakingAvatar
                  text={transcript}
                  imgSrc="/images/Avatar/femaleUsAi.jpeg"
                  candidateName={interview.candidateName}
                />
              </div>

              {/* Transcript Section with scroll */}
              <div className={`flex w-full lg:w-3/4 justify-start items-start px-4 py-4 transition-all duration-300 ${showTranscript ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-full max-h-64 overflow-y-auto pr-2">
                  <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">
                    {transcript}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="w-full lg:w-5/12 space-y-4  px-4">
            <div className="flex flex-col w-full bg-sky-50 rounded-xl p-4 justify-center">
              {/* Toggle Tabs */}
              <div className="flex w-fit mx-auto bg-[#e4e9f2] rounded-full p-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${activeTab === "chat"
                    ? "bg-sky-500 text-white shadow"
                    : "text-gray-500"
                    }`}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveTab("performance")}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${activeTab === "performance"
                    ? "bg-sky-500 text-white shadow"
                    : "text-gray-500"
                    }`}
                >
                  Performance
                </button>
              </div>
              <div className={activeTab === "chat" ? "block w-full" : "hidden"}>
                <AIChat
                  interviewId={interviewId}
                  questionList={questions}
                  handleExamEnd={handleExamEnd}
                  token={token}
                  examID={interview.id}
                  onTranscriptChange={handleTranscriptChange}
                  selectedAvatar=""
                />
              </div>
              <div className={activeTab === "performance" ? "block" : "hidden"}>
                <QuestionPerformance />
              </div>
            </div>
          </div>



          <div className="max-md:hidden">
            <Checklist permissions={permissions} />
          </div>


        </section>

      </main>

    </div>


  )
}

export default InterviewScreenPage

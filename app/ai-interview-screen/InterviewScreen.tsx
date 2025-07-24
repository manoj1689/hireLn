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
import { Divide } from "lucide-react"
import { MdFullscreenExit } from "react-icons/md"
import PreventBackForward from "@/components/BlockBackForward"
import { RotatingLines } from "react-loader-spinner"

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

  return (
    <div className="flex h-screen ">
      <PreventBackForward />
      <div className="flex-1 h-auto  container mx-auto px-4">
        <ToastContainer />

        <header className="flex w-full lg:h-1/6 items-center">
          <Card className="bg-gradient-to-r from-sky-400 to-pink-400 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center px-6 py-4 text-white text-sm sm:text-base font-medium">
              <div className="flex justify-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-200 text-white text-2xl">
                    {interview.candidateName.split(" ").map(word => word[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{interview.jobTitle}</p>
                  <p className="text-gr-white font-medium">{interview.candidateName}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-right">
                <span className="text-center">
                  <span className="font-light">Time Left</span>{" "}
                  <ShowTimer duration={interview.duration} />
                </span>
                <p className="flex flex-col text-center">
                  <span className="font-light">Status</span>{" "}
                  <span className="font-bold text-yellow-300">{interview.status}</span>
                </p>
              </div>
            </div>
          </Card>
        </header>

        {/* <p className="mt-4 text-gray-700">
        Questions uploaded and fetched successfully. Total: {questions.length}
      </p> */}

        <div className="flex flex-col lg:flex-row  lg:h-5/6    ">
          <div className="flex flex-col lg:w-7/12   justify-around   ">
            <div className="flex w-full justify-center mt-4 ">
              <VideoInterfacePage
                permissions={permissions}
                setPermissions={setPermissions}
                faceDetectionResults={faceDetectionResults}
                setFaceDetectionResults={setFaceDetectionResults}
                examStatus={examStatus}
              />
            </div>

            {showTranscript && (
              <div className="max-sm:hidden flex w-full justify-center  ">
                <SpeakingAvatar
                  text={transcript}
                  imgSrc="/public/images/Avatar/femaleUsAi.jpeg"
                />
              </div>
            )}



            <div className="flex flex-col w-full bg-gray-200 rounded-lg shadow-lg lg:w-5/6 mx-auto   ">

              <div className="flex gap-2 justify-center items-center">
                {showTranscript && <>
                  <div className="w-full px-4">
                    {transcript}
                  </div>
                </>}
                <button className="p-2 md:p-4" onClick={() => setShowTranscript(!showTranscript)}>
                  {!showTranscript ? (
                    <IoMdEye className="text-gray-400" />
                  ) : (
                    <IoMdEyeOff className="text-gray-400" />
                  )}
                </button>

              </div>
            </div>
          </div>

          <div className="w-full lg:w-5/12 space-y-4  px-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 ${activeTab === "chat" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
              >
                AI Chat
              </button>
              <button
                onClick={() => setActiveTab("performance")}
                className={`px-4 py-2 rounded-t-md text-sm font-medium border-b-2 ${activeTab === "performance" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"}`}
              >
                Performance
              </button>
            </div>

            <div className="bg-white  rounded-b-md shadow">
              <div className="w-full space-y-4">
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
          </div>
        </div>

        <div className="max-md:hidden">
          <Checklist permissions={permissions} />
        </div>
      </div>
    </div>

  )
}

export default InterviewScreenPage

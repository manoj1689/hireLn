"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Mic,
    Brain,
    Play,
    Shield,
    Lightbulb
} from "lucide-react"
import InstructionPage from "@/components/interview/BrowserInstructions"
import Checklist from "@/components/interview/Checklist"
import {
    FiCamera,
} from "react-icons/fi"

import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import dayjs from "dayjs"
import VideoInterfacePage from "@/components/interview/videoInterface"
import { startInterview } from "@/lib/slices/join_interview/interview-join-slice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export default function InterviewConfirmation() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const interviewId = searchParams.get("interview_id") || ""
    const token = searchParams.get("token") || ""

    const dispatch = useDispatch<AppDispatch>()
    const { interview, loading, error, confirmationMessage, status } = useSelector((state: RootState) => state.joinInterview)

    const [consentChecked, setConsentChecked] = useState(false)
    const [showReadyModal, setShowReadyModal] = useState(false)
    const [showTipsModal, setShowTipsModal] = useState(false)
    const [toastShown, setToastShown] = useState(false)
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
    const [joining, setJoining] = useState(false);

    const handleStartInterview = async () => {
        const allOk =
            permissions.camera &&
            permissions.microphone &&
            !permissions.devToolsOpen &&
            permissions.fullscreen;

        if (
            allOk &&
            status === "CONFIRMED" &&
            interview.status !== "IN_PROGRESS"
        ) {
            setJoining(true);
            try {
                await dispatch(startInterview(interview.id));
                router.push(`/ai-interview-screen?interview_id=${interview?.id}&token=${token}`);
            } catch (err) {
                setJoining(false);
                console.error("Failed to start interview:", err);
            }
        } else {
            setShowReadyModal(true);
        }
    };

    const checkFullscreenStatus = useCallback(() => {
        setPermissions(prev => ({ ...prev, fullscreen: !!document.fullscreenElement }))
    }, [])

    const handleVisibilityChange = useCallback(() => {
        setPermissions(prev => ({ ...prev, tabActive: document.visibilityState === "visible" }))
    }, [])

    const detectDevToolsOpen = useCallback(() => {
        const threshold = 100
        const devToolsOpen = window.outerWidth - window.innerWidth > threshold
        setPermissions(prev => ({ ...prev, devToolsOpen }))
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

    const scheduledTime =
        interview?.scheduledAt && !isNaN(new Date(interview.scheduledAt).getTime())
            ? new Date(interview.scheduledAt).toLocaleString("en-IN", {
                timeZone: interview?.timezone || "Asia/Kolkata",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            : "Not Scheduled"
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

    const tips = [
        {
            icon: Lightbulb,
            title: "Be Confident",
            description: "Confidence in your answers shows clarity and preparation.",
            color: "text-yellow-500",
            bg: "bg-yellow-50",
        },
        {
            icon: Mic,
            title: "Speak Clearly",
            description: "Use a moderate pace and pronounce words clearly.",
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            icon: FiCamera,
            title: "Maintain Eye Contact",
            description: "Look into the camera for better engagement.",
            color: "text-purple-500",
            bg: "bg-purple-50",
        },
    ]

    if (!interview || loading) {
        return <div className="p-8 text-center text-gray-500">Loading interview...</div>
    }
    return (
        <div className="min-h-screen">
            <ToastContainer />
            <header className="flex  rounded-lg bg-cyan-50 border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">HireLn</h1>
                                <p className="text-xs text-gray-500">Smart Interview Platform</p>
                            </div>
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
            <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Interview Tips</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {tips.map((tip, index) => (
                            <Card key={index} className={`${tip.bg} border`}>
                                <CardContent className="flex flex-col gap-2 p-4">
                                    <tip.icon className={`w-6 h-6 ${tip.color}`} />
                                    <h3 className="font-semibold">{tip.title}</h3>
                                    <p className="text-sm">{tip.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            {joining ? (
                <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
                    ⏳ Joining interview...
                </div>
            ) : (
                <>
                    <main className="container mx-auto py-4 px-4 space-y-4 bg-gray-100 mt-4 rounded-lg">
                        <section>
                            <Card className="bg-gradient-to-r from-sky-400 to-pink-400 rounded-xl shadow-md">
                                <div className="flex justify-between items-center px-6 py-4 text-white text-sm sm:text-base font-medium">
                                    {/* Left Side: Job Title & Date */}
                                    <div>
                                        <p>
                                            <span className="font-bold">Interview Setup:</span>{" "}
                                            {interview.jobTitle}
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            {dayjs(interview.scheduledAt).format("D MMM YYYY, h:mm a")}
                                        </p>
                                    </div>

                                    {/* Right Side: Duration, Type, Status */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-right">
                                        <p>
                                            <span className="font-light">Duration:</span>{" "}
                                            {interview.duration} minutes
                                        </p>
                                        <p>
                                            <span className="font-light">Type:</span>{" "}
                                            {interview.interviewType}
                                        </p>
                                        <p>
                                            <span className="font-light">Status:</span>{" "}
                                            <span className="font-bold text-yellow-300">{interview.status}</span>
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        <section className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 w-full h-auto lg:w-3/4 xl:w-3/5 space-y-4 justify-center items-center ">
                                <VideoInterfacePage permissions={permissions} setPermissions={setPermissions} faceDetectionResults={faceDetectionResults} setFaceDetectionResults={setFaceDetectionResults} examStatus={false} />
                            </div>
                            <div className="w-full lg:w-1/4 xl:w-2/5 space-y-4">

                                <Card className="bg-blue-50 shadow-md rounded-xl text-center  py-4 space-y-4">
                                    <div className="flex justify-center">
                                        <Avatar className="h-16 w-16">
                                            <AvatarFallback className="bg-blue-200 text-white text-3xl">
                                                {interview.candidateName.split(" ").map(word => word[0]).join("").toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <CardTitle className="text-blue-700 text-sm font-semibold">
                                        Candidate Information
                                    </CardTitle>

                                    <CardContent className="flex flex-col space-y-1 justify-center text-sm">
                                        <p>
                                            <span className="text-gray-500">Name:</span>{" "}
                                            <span className="text-gray-800 font-medium">{interview.candidateName}</span>
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Email:</span>{" "}
                                            <span className="text-gray-800 font-medium">{interview.candidateEmail}</span>
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Meeting:</span>{" "}
                                            <span className="text-gray-800 font-medium">{interview.location}</span>
                                        </p>
                                    </CardContent>
                                </Card>


                                <div className="max-md:hidden">
                                    <Checklist
                                        permissions={permissions}
                                    />
                                </div>
                                <div >
                                    <InstructionPage />
                                </div>

                            </div>


                        </section>



                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-red-600" /> Privacy & Consent
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start space-x-3">
                                    <Checkbox id="consent" checked={consentChecked} onCheckedChange={setConsentChecked} className="mt-1" />
                                    <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
                                        I understand and agree to the recording of this interview session for evaluation purposes.
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="flex w-full justify-center items-center">
                            <Button onClick={handleStartInterview} disabled={!consentChecked}
                                className=" bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium">
                                <Play className="w-5 h-5 mr-2" /> Join Interview
                            </Button>

                        </div>

                    </main>

                    <Dialog open={showReadyModal} onOpenChange={setShowReadyModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-red-600">Permissions Required</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3 text-sm text-gray-700">
                                <p>You're missing some required permissions to start the interview:</p>
                                <ul className="list-disc list-inside text-red-600">
                                    {!permissions.camera && <li>Camera access is required</li>}
                                    {!permissions.microphone && <li>Microphone access is required</li>}
                                    {permissions.devToolsOpen && <li>Close developer tools</li>}
                                    {!permissions.fullscreen && <li>Please enable fullscreen mode</li>}
                                </ul>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button onClick={() => setShowReadyModal(false)}>OK</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>

            )}


        </div>
    );
}


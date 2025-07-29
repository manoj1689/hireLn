"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Users,
  Building,
  Timer,
  Star,
  ExternalLink,
  Mail,
  Award,
  MessageCircle,
  FileText,
  Copy,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  Brain,
  Heart,
  Target,
  TrendingUp,
  Sparkles,
  BarChart,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { InterviewResponse } from "@/interface/interview"

interface InterviewDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  interview: InterviewResponse | null
}

export function InterviewDetailsDialog({ open, onOpenChange, interview }: InterviewDetailsDialogProps) {


  const hue = Math.floor(Math.random() * 360);
  const avatarBgColor = `hsl(${hue}, 90%, 85%)`;
  const avatarTextColor = `hsl(${hue}, 40%, 40%)`;
  const borderColor = `hsl(${hue}, 90%, 85%)`;



  const statusConfig = useMemo(() => {
    const configs = {
      SCHEDULED: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Calendar className="h-4 w-4" />,
      },
      COMPLETED: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      CANCELLED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-4 w-4" />,
      },
      RESCHEDULED: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <RotateCcw className="h-4 w-4" />,
      },
      NO_SHOW: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <AlertCircle className="h-4 w-4" />,
      },
    }
    return configs[interview?.status as keyof typeof configs] || configs.SCHEDULED
  }, [interview?.status])

  const typeConfig = useMemo(() => {
    const configs = {
      VIDEO: {
        color: "text-sky-400",
        icon: <Video className="h-8 w-8" />,
        label: "Video",
      },
      PHONE: {
        color: "text-green-400",
        icon: <Phone className="h-4 w-4" />,
        label: "Phone",
      },
      IN_PERSON: {
        color: "text-purple-400",
        icon: <MapPin className="h-4 w-4" />,
        label: "In Person",
      },
      PANEL: {
        color: "text-orange-400",
        icon: <Users className="h-4 w-4" />,
        label: "Panel",
      },
      TECHNICAL: {
        color: "text-indigo-400",
        icon: <Brain className="h-4 w-4" />,
        label: "Technical",
      },
      BEHAVIORAL: {
        color: "text-pink-400",
        icon: <Heart className="h-4 w-4" />,
        label: "Behavioral",
      },
    };
    return configs[interview?.interviewType as keyof typeof configs] || configs.VIDEO
  }, [interview?.interviewType])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const matchScore = useMemo(() => {
    if (interview?.feedback?.rating) {
      return (interview.feedback.rating / 5) * 100
    }
    return Math.floor(Math.random() * 40) + 60
  }, [interview?.feedback])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!interview) return null
  console.log("view interview details", interview)
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto p-0">



        <div className="space-y-6">

          {/* Header Section */}
          <div className=" bg-primary-gradient">

            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-white text-center py-4">Interview Details</DialogTitle>
            </DialogHeader>


            <div className="flex justify-between p-4 ">
              <div className="flex gap-2 items-center ">
                <Avatar className="h-16 w-16  shadow-xl">
                  <AvatarFallback className={cn("text-white font-bold text-xl")} style={{ backgroundColor: avatarBgColor, color: avatarTextColor }}>
                    {getInitials(interview.candidateName)}
                  </AvatarFallback>
                </Avatar>
                <div className=" space-y-1 ">
                  <div className="flex  items-center ">
                    <h2 className="text-xl font-bold text-white">{interview.candidateName}</h2>
                    {interview.feedback?.rating && interview.feedback.rating >= 4 && (
                      <Award className="h-6 w-6 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-white mb-2">{interview.candidateEmail}</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-white" />
                    <span className="font-semibold" style={{ color: avatarTextColor }}>{interview.jobTitle}</span>
                  </div>
                </div>

              </div>

              <div className="flex flex-col items-end gap-2">
                <Badge className={cn("font-medium text-sm px-3 py-1", statusConfig.color)}>
                  {statusConfig.icon}
                  <span className="ml-2">{interview.status.replace("_", " ")}</span>
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-white">Match Score: </span>
                  <span className="font-bold text-stone-600">{Math.round(matchScore)}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Interview Type & Schedule */}
          <div className="space-y-2 px-4">
            <h3 className="text-lg font-semibold text-neutral-700">Interview Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Interview Type */}
              <div className="bg-red-50 rounded-xl py-4">
                <div className="flex justify-start">
                  <span className="text-sm font-semibold bg-red-400 text-white px-2 py-1 rounded-r-lg mb-2">Type</span>
                </div>
                <div className="px-4 flex flex-col items-center justify-center text-center">
                  <Video className="w-16 h-16 text-red-400 mb-2" />
                  <p className="text-sm text-stone-400 capitalize">
                    {interview.interviewType === "VIDEO" ? "Live" : "Offline"}
                  </p>
                  <p className="text-lg font-semibold text-stone-400 capitalize">
                    {interview.interviewType.replace("_", " ").toLowerCase().includes("video") ? "Video Call" : interview.interviewType}
                  </p>
                </div>
              </div>

              {/* Interview Date */}
              <div className="bg-green-50 rounded-xl py-4">
                <div className="flex justify-start">
                  <span className="text-sm font-semibold bg-green-400 text-white px-2 py-1 rounded-r-lg mb-2">Date</span>
                </div>
                <div className="px-4 flex flex-col items-center justify-center text-center">
                  <Calendar className="w-16 h-16 text-green-400 mb-2" />
                  <p className="text-sm text-stone-400">
                    {format(new Date(interview.scheduledAt), "EEEE")}
                  </p>
                  <p className="text-lg font-semibold text-stone-400">
                    {format(new Date(interview.scheduledAt), "MMMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {/* Interview Time */}
              <div className="bg-blue-50 rounded-xl py-4">
                <div className="flex justify-start">
                  <span className="text-sm font-semibold bg-blue-400 text-white px-2 py-1 rounded-r-lg mb-2">Time</span>
                </div>
                <div className="px-4 flex flex-col items-center justify-center text-center">
                  <Clock className="w-16 h-16 text-blue-400 mb-2" />
                  <p className="text-sm text-stone-400">{interview.duration} Mins</p>
                  <p className="text-lg font-semibold text-stone-400">
                    {format(new Date(interview.scheduledAt), "HH:mm")} -{" "}
                    {format(
                      new Date(new Date(interview.scheduledAt).getTime() + interview.duration * 60000),
                      "HH:mm"
                    )}
                  </p>
                </div>
              </div>

              {/* Interview Location */}
              <div className="bg-yellow-50 rounded-xl py-4">
                <div className="flex justify-start">
                  <span className="text-sm font-semibold bg-yellow-400 text-white px-2 py-1 rounded-r-lg mb-2">Location</span>
                </div>
                <div className="px-4 flex flex-col items-center justify-center text-center">
                  <MapPin className="w-16 h-16 text-yellow-400 mb-2" />
                  <p className="text-sm text-stone-400">{interview.location || "Not provided"}</p>
                  <p className="text-lg font-semibold text-stone-400">{interview.timezone || "Asia/Kolkata"}</p>
                </div>
              </div>
            </div>
          </div>






         

          {/* Interview Panel */}
          <div className="space-y-2 px-4">
            <h3 className="text-lg font-semibold text-neutral-700">Interviewer Panel</h3>

            {interview.interviewers.map((interviewer, index) => (
              <div key={index} className="rounded-xl bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-4">
                  {interviewer.avatar ? (
                    <img
                      src={interviewer.avatar}
                      alt={interviewer.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold flex items-center justify-center">
                      {getInitials(interviewer.name)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{interviewer.name}</p>
                    <p className="text-sm text-gray-500">{interviewer.role || "🎓 AI Interviewer"}</p>

                    {/* Tags — optional static skills (or make dynamic if needed) */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-red-200 text-red-700 font-medium">Communication</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-700 font-medium">Problem Solving</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-700 font-medium">Technical Skills</span>
                    </div>
                  </div>
                </div>

                {/* Right: Features */}
                <div className="flex flex-col gap-1 sm:gap-2 text-sm text-zinc-700 font-light">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Automated Q&A</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="w-4 h-4" />
                    <span>Tailored based on job profile</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Real-time evaluation</span>
                  </div>
                </div>
              </div>
            ))}
          </div>


      

          {/* Meeting Details */}
          {/* <div className="space-y-4 px-4">
            <h3 className="text-lg font-semibold text-gray-900">Meeting Details</h3>

            {interview.meetingLink && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Video Meeting</p>
                      <p className="text-sm text-blue-700">Click to join the interview</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => window.open(interview.meetingLink, "_blank")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join Meeting
                  </Button>
                </div>
              </div>
            )}

            {interview.location && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Meeting Location</p>
                    <p className="text-sm text-purple-700">{interview.location}</p>
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* Feedback Section */}
          {/* {interview.feedback && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Interview Feedback</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600 font-medium mb-1">Technical Skills</p>
                    <p className="text-2xl font-bold text-green-800">{interview.feedback.technicalSkills}/5</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium mb-1">Communication</p>
                    <p className="text-2xl font-bold text-blue-800">{interview.feedback.communicationSkills}/5</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium mb-1">Cultural Fit</p>
                    <p className="text-2xl font-bold text-purple-800">{interview.feedback.culturalFit}/5</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Detailed Feedback</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{interview.feedback.detailedFeedback}</p>
                </div>

                {interview.feedback.strengths && interview.feedback.strengths.length > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.feedback.strengths.map((strength, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {interview.feedback.weaknesses && interview.feedback.weaknesses.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.feedback.weaknesses.map((weakness, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )} */}

          {/* Notes */}
          {interview.notes && (
            <>
       
              <div className="space-y-2 px-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-neutral-700">Notes</h3>
                </div>
                <div className="p-4 bg-amber-50 border-dashed border-2 border-amber-200 rounded-lg">
                  <p className="text-amber-800 whitespace-pre-wrap">{interview.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Timeline */}
       
      
          <Separator/>
            <div className="flex justify-between px-4 py-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Created</span>
                <span className="font-medium text-gray-400">{format(new Date(interview.createdAt), "MMM dd, yyyy 'at' HH:mm")}</span>
              </div>
              {interview.updatedAt !== interview.createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Last updated</span>
                  <span className="font-medium text-gray-400">
                    {formatDistanceToNow(new Date(interview.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
              {interview.feedback && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400">Feedback submitted</span>
                  <span className="font-medium">
                    {format(new Date(interview.feedback.submittedAt), "MMM dd, yyyy 'at' HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </div>
           </DialogContent>
    </Dialog>
  )
}

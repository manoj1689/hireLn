"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Calendar,
  MapPin,
  Video,
  Phone,
  Users,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  RotateCcw,
  MoreVertical,
  LocateIcon,
  ExternalLink,
  Timer,
  Star,
  AlertCircle,
  Zap,
  Award,
  Mail,
  Copy,
  Download,
  Share2,
  Target,
  Brain,
  Heart,
  Clock,
} from "lucide-react"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { InterviewResponse } from "@/interface/interview"

interface InterviewCardProps {
  interview: InterviewResponse
  onViewDetails: (interview: InterviewResponse) => void
  onStatusUpdate: (interviewId: string, status: string) => void
  onReschedule: (interview: InterviewResponse) => void
  onDelete: (interviewId: string) => void
  onAddFeedback: (interview: InterviewResponse) => void
}

export function InterviewCard({
  interview,
  onViewDetails,
  onStatusUpdate,
  onReschedule,
  onDelete,
  onAddFeedback,
}: InterviewCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)


  const hue = Math.floor(Math.random() * 360);
  const avatarBgColor = `hsl(${hue}, 90%, 85%)`;
  const avatarTextColor = `hsl(${hue}, 40%, 40%)`;
  const borderColor = `hsl(${hue}, 90%, 85%)`;


  const statusConfig = useMemo(() => {
    const configs = {
      SCHEDULED: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Calendar className="h-3 w-3" />,
        pulse: true,
      },
      COMPLETED: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: <CheckCircle className="h-3 w-3" />,
        pulse: false,
      },
      CANCELLED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: <XCircle className="h-3 w-3" />,
        pulse: false,
      },
      RESCHEDULED: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <RotateCcw className="h-3 w-3" />,
        pulse: true,
      },
      NO_SHOW: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: <AlertCircle className="h-3 w-3" />,
        pulse: false,
      },
    }
    return configs[interview.status as keyof typeof configs] || configs.SCHEDULED
  }, [interview.status])

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

    return configs[interview.interviewType as keyof typeof configs] || configs.VIDEO
  }, [interview.interviewType])

  const timeInfo = useMemo(() => {
    const interviewDate = new Date(interview.scheduledAt)
    const now = new Date()
    const isUpcoming = interviewDate > now

    let timeLabel = ""
    let timeColor = ""
    let isUrgent = false

    if (isToday(interviewDate)) {
      timeLabel = "Today"
      timeColor = isUpcoming ? "text-blue-600 font-semibold" : "text-gray-600"
      isUrgent = isUpcoming
    } else if (isTomorrow(interviewDate)) {
      timeLabel = "Tomorrow"
      timeColor = "text-blue-600 font-medium"
      isUrgent = true
    } else if (isYesterday(interviewDate)) {
      timeLabel = "Yesterday"
      timeColor = "text-gray-500"
    } else {
      timeLabel = format(interviewDate, "MMM dd")
      timeColor = isUpcoming ? "text-gray-700" : "text-gray-500"
    }

    return {
      label: timeLabel,
      color: timeColor,
      time: format(interviewDate, "HH:mm"),
      isUrgent,
    }
  }, [interview.scheduledAt])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <TooltipProvider>
      <Card className="flex w-full group hover:shadow-lg transition-all duration-200 border-l-4 cursor-pointer" style={{ borderLeftColor: borderColor }}>
        <CardContent className="p-4 w-11/12">
             <div className=" flex justify-end items-center gap-2 flex-shrink-0  sm:hidden">
                    <Badge className={cn("text-xs font-medium", statusConfig.color, statusConfig.pulse && "animate-pulse")}>
                      {statusConfig.icon}
                      <span className="ml-1">{interview.status.replace("_", " ")}</span>
                    </Badge>


                  </div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between py-2 gap-4">
            <div className="flex items-center gap-3 w-full lg:w-2/3 mb-4 sm:mb-0 " onClick={() => onViewDetails(interview)}>
              <div className="relative ">
                <Avatar className="h-12 sm:h-16 w-12 sm:w-16 ring-2 ring-white shadow-sm">
                  <AvatarFallback className={cn("text-white font-semibold")} style={{ backgroundColor: avatarBgColor, color: avatarTextColor }}>
                    {getInitials(interview.candidateName)}
                  </AvatarFallback>
                </Avatar>
                {timeInfo.isUrgent && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-neutral-700 group-hover:text-blue-600 transition-colors truncate">
                    {interview.candidateName}
                  </h3>
                  <div className=" justify-end items-center gap-2 flex-shrink-0 hidden sm:block">
                    <Badge className={cn("text-xs font-medium", statusConfig.color, statusConfig.pulse && "animate-pulse")}>
                      {statusConfig.icon}
                      <span className="ml-1">{interview.status.replace("_", " ")}</span>
                    </Badge>


                  </div>
                  {interview.feedback?.rating && interview.feedback.rating >= 4 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>High-rated candidate ({interview.feedback.rating}/5)</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{interview.jobTitle}</p>
              </div>

            </div>
            {/* Interview Info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4 sm:mb-0 w-full lg:w-1/3">
              <div className="flex flex-col items-start ">
                <div className={cn(" rounded-full text-white", typeConfig.color)}>{typeConfig.icon}</div>
                <span className="text-sm font-medium text-gray-700">{typeConfig.label}</span>
              </div>
              <div className="flex flex-row sm:flex-col items-center gap-2">

                <div className="flex  items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className={cn("text-sm font-medium", timeInfo.color)}>{timeInfo.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{timeInfo.time}</span>
                </div>
              </div>


            </div>

          </div>



          {/* Quick Info */}

          <div className="grid grid-cols-2 sm:flex sm:items-start  text-xs sm:text-sm text-gray-600 gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <LocateIcon className="h-4 w-4" />
              <span className="text-primary">{interview.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              <span className="text-primary">{interview.duration}min</span>
            </div>
            <div className="flex items-center gap-1 col-span-2 sm:col-auto">
              <Users className="h-4 w-4" />
              <span className="text-primary">
                {interview.interviewers.length} interviewer{interview.interviewers.length !== 1 ? "s" : ""}
              </span>
            </div>



          </div>
        </CardContent>
        <div className="flex w-1/12 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 ">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onViewDetails(interview)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Target className="mr-2 h-4 w-4" />
                  Update Status
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {interview.status === "SCHEDULED" && (
                    <>
                      <DropdownMenuItem onClick={() => onStatusUpdate(interview.id, "COMPLETED")}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Mark Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusUpdate(interview.id, "NO_SHOW")}>
                        <AlertCircle className="mr-2 h-4 w-4 text-orange-600" />
                        Mark No Show
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusUpdate(interview.id, "CANCELLED")}>
                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {interview.status === "SCHEDULED" && (
                <DropdownMenuItem onClick={() => onReschedule(interview)}>
                  <RotateCcw className="mr-2 h-4 w-4 text-blue-600" />
                  Reschedule
                </DropdownMenuItem>
              )}

              {interview.status === "COMPLETED" && !interview.feedback && (
                <DropdownMenuItem onClick={() => onAddFeedback(interview)}>
                  <MessageSquare className="mr-2 h-4 w-4 text-purple-600" />
                  Add Feedback
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => copyToClipboard(interview.candidateEmail)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Copy Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(interview.meetingLink || "")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Meeting Link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem onClick={() => onReschedule(interview)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the interview with <strong>{interview.candidateName}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(interview.id)
                setShowDeleteDialog(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider >
  )
}

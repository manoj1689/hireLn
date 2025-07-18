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
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        icon: <Video className="h-4 w-4" />,
        label: "Video",
      },
      PHONE: {
        color: "bg-gradient-to-r from-green-500 to-green-600",
        icon: <Phone className="h-4 w-4" />,
        label: "Phone",
      },
      IN_PERSON: {
        color: "bg-gradient-to-r from-purple-500 to-purple-600",
        icon: <MapPin className="h-4 w-4" />,
        label: "In Person",
      },
      PANEL: {
        color: "bg-gradient-to-r from-orange-500 to-orange-600",
        icon: <Users className="h-4 w-4" />,
        label: "Panel",
      },
      TECHNICAL: {
        color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
        icon: <Brain className="h-4 w-4" />,
        label: "Technical",
      },
      BEHAVIORAL: {
        color: "bg-gradient-to-r from-pink-500 to-pink-600",
        icon: <Heart className="h-4 w-4" />,
        label: "Behavioral",
      },
    }
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
      <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 cursor-pointer">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1" onClick={() => onViewDetails(interview)}>
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  <AvatarFallback className={cn("text-white font-semibold", typeConfig.color)}>
                    {getInitials(interview.candidateName)}
                  </AvatarFallback>
                </Avatar>
                {timeInfo.isUrgent && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {interview.candidateName}
                  </h3>
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

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={cn("text-xs font-medium", statusConfig.color, statusConfig.pulse && "animate-pulse")}>
                {statusConfig.icon}
                <span className="ml-1">{interview.status.replace("_", " ")}</span>
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
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
          </div>

          {/* Interview Info */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-full text-white", typeConfig.color)}>{typeConfig.icon}</div>
              <span className="text-sm font-medium text-gray-700">{typeConfig.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className={cn("text-sm font-medium", timeInfo.color)}>{timeInfo.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{timeInfo.time}</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                <span>{interview.duration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {interview.interviewers.length} interviewer{interview.interviewers.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

        
          </div>
        </CardContent>
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
    </TooltipProvider>
  )
}

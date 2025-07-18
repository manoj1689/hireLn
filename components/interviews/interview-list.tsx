"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { InterviewCard } from "./interview-card"
import { InterviewResponse } from "@/interface/interview"

interface InterviewListProps {
  interviews: InterviewResponse[]
  loading: boolean
  error: string | null
  searchTerm: string
  onViewDetails: (interview: InterviewResponse) => void
  onStatusUpdate: (interviewId: string, status: string) => void
  onReschedule: (interview: InterviewResponse) => void
  onDelete: (interviewId: string) => void
  onAddFeedback: (interview: InterviewResponse) => void
}

export function InterviewList({
  interviews,
  loading,
  error,
  searchTerm,
  onViewDetails,
  onStatusUpdate,
  onReschedule,
  onDelete,
  onAddFeedback,
}: InterviewListProps) {
  const filteredInterviews = interviews.filter(
    (interview) =>
      interview.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="text-center py-8">Loading interviews...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>
  }

  if (filteredInterviews.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search or filters" : "Schedule your first interview to get started"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {filteredInterviews.map((interview) => (
        <InterviewCard
          key={interview.id}
          interview={interview}
          onViewDetails={onViewDetails}
          onStatusUpdate={onStatusUpdate}
          onReschedule={onReschedule}
          onDelete={onDelete}
          onAddFeedback={onAddFeedback}
        />
      ))}
    </div>
  )
}

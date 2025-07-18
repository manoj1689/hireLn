"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"

interface InterviewHeaderProps {
  onScheduleInterview?: () => void
}

export function InterviewHeader({ onScheduleInterview }: InterviewHeaderProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
        <p className="text-muted-foreground">Manage and track all your interviews</p>
      </div>
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <DialogDescription>Schedule an interview with a candidate</DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            Interview scheduling form would be implemented here
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

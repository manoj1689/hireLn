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
import { Download, Eye } from "lucide-react"
import { useState } from "react"

interface InterviewResultHeaderProps {
  onExportResults?: () => void
}

export function InterviewResultHeader({ onExportResults }: InterviewResultHeaderProps) {
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="flex w-full flex-col sm:flex-row bg-primary-gradient space-y-4 justify-between p-4 shadow-lg rounded-lg">
      <div>
        <h1 className="text-3xl text-white font-bold tracking-tight">AI Interview Results</h1>
        <p className="text-white">Review and analyze completed AI interviews</p>
      </div>
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Interview Results</DialogTitle>
            <DialogDescription>Download or share the AI interview results</DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            Export functionality would be implemented here
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

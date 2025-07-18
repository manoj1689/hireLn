"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReschedule: (data: { newDate: string; newTime: string; reason: string; notifyCandidate: boolean }) => void
}

export function RescheduleDialog({ open, onOpenChange, onReschedule }: RescheduleDialogProps) {
  const [formData, setFormData] = useState({
    newDate: "",
    newTime: "",
    reason: "",
    notifyCandidate: true,
  })

  useEffect(() => {
    if (!open) {
      setFormData({
        newDate: "",
        newTime: "",
        reason: "",
        notifyCandidate: true,
      })
    }
  }, [open])

  const handleSubmit = () => {
    onReschedule(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Interview</DialogTitle>
          <DialogDescription>Change the interview date and time</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newDate">New Date</Label>
              <Input
                id="newDate"
                type="date"
                value={formData.newDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, newDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="newTime">New Time</Label>
              <Input
                id="newTime"
                type="time"
                value={formData.newTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, newTime: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="reason">Reason for Rescheduling</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for rescheduling..."
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.newDate || !formData.newTime}>
            Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

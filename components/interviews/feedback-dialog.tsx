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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmitFeedback: (feedback: any) => void
}

export function FeedbackDialog({ open, onOpenChange, onSubmitFeedback }: FeedbackDialogProps) {
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 3,
    technicalSkills: 3,
    communicationSkills: 3,
    culturalFit: 3,
    overallRecommendation: "MAYBE" as "HIRE" | "NO_HIRE" | "MAYBE" | "STRONG_HIRE",
    strengths: [] as string[],
    weaknesses: [] as string[],
    detailedFeedback: "",
    nextSteps: "",
  })

  const [strengthInput, setStrengthInput] = useState("")
  const [weaknessInput, setWeaknessInput] = useState("")

  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setFeedbackForm({
      rating: 3,
      technicalSkills: 3,
      communicationSkills: 3,
      culturalFit: 3,
      overallRecommendation: "MAYBE",
      strengths: [],
      weaknesses: [],
      detailedFeedback: "",
      nextSteps: "",
    })
    setStrengthInput("")
    setWeaknessInput("")
  }

  const addStrength = () => {
    if (strengthInput.trim()) {
      setFeedbackForm((prev) => ({
        ...prev,
        strengths: [...prev.strengths, strengthInput.trim()],
      }))
      setStrengthInput("")
    }
  }

  const addWeakness = () => {
    if (weaknessInput.trim()) {
      setFeedbackForm((prev) => ({
        ...prev,
        weaknesses: [...prev.weaknesses, weaknessInput.trim()],
      }))
      setWeaknessInput("")
    }
  }

  const removeStrength = (index: number) => {
    setFeedbackForm((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }))
  }

  const removeWeakness = (index: number) => {
    setFeedbackForm((prev) => ({
      ...prev,
      weaknesses: prev.weaknesses.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = () => {
    onSubmitFeedback(feedbackForm)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Feedback</DialogTitle>
          <DialogDescription>Provide feedback for the completed interview</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Overall Rating</Label>
              <Select
                value={feedbackForm.rating.toString()}
                onValueChange={(value) => setFeedbackForm((prev) => ({ ...prev, rating: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Technical Skills</Label>
              <Select
                value={feedbackForm.technicalSkills.toString()}
                onValueChange={(value) =>
                  setFeedbackForm((prev) => ({ ...prev, technicalSkills: Number.parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Communication Skills</Label>
              <Select
                value={feedbackForm.communicationSkills.toString()}
                onValueChange={(value) =>
                  setFeedbackForm((prev) => ({ ...prev, communicationSkills: Number.parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cultural Fit</Label>
              <Select
                value={feedbackForm.culturalFit.toString()}
                onValueChange={(value) => setFeedbackForm((prev) => ({ ...prev, culturalFit: Number.parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <Label>Overall Recommendation</Label>
            <Select
              value={feedbackForm.overallRecommendation}
              onValueChange={(value: any) => setFeedbackForm((prev) => ({ ...prev, overallRecommendation: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STRONG_HIRE">Strong Hire</SelectItem>
                <SelectItem value="HIRE">Hire</SelectItem>
                <SelectItem value="MAYBE">Maybe</SelectItem>
                <SelectItem value="NO_HIRE">No Hire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Strengths */}
          <div>
            <Label>Strengths</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a strength..."
                value={strengthInput}
                onChange={(e) => setStrengthInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addStrength()}
              />
              <Button type="button" onClick={addStrength}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {feedbackForm.strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeStrength(index)}>
                  {strength} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <Label>Areas for Improvement</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add an area for improvement..."
                value={weaknessInput}
                onChange={(e) => setWeaknessInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addWeakness()}
              />
              <Button type="button" onClick={addWeakness}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {feedbackForm.weaknesses.map((weakness, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeWeakness(index)}>
                  {weakness} ×
                </Badge>
              ))}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div>
            <Label>Detailed Feedback</Label>
            <Textarea
              placeholder="Provide detailed feedback about the interview..."
              value={feedbackForm.detailedFeedback}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, detailedFeedback: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Next Steps */}
          <div>
            <Label>Next Steps</Label>
            <Textarea
              placeholder="What are the recommended next steps?"
              value={feedbackForm.nextSteps}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, nextSteps: e.target.value }))}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!feedbackForm.detailedFeedback}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

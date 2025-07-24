"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, Save } from "lucide-react"
import BasicInfoStep from "./BasicInfoStep"
import JobDetailsStep from "./JobDetailStep"
import RequirementsStep from "./RequirementsStep"
import ReviewStep from "./ReviewStep"

function CreateJobPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }



  return (
    <MainLayout>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row   border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white p-4 rounded-lg   md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Job Posting</h1>
            <p className="text-white">Fill in the details to create a new job posting</p>
          </div>
          <Button variant="outline" className="flex text-foreground items-center gap-2">
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        </div>



      </div>
      <div className="flex w-full gap-4 p-4">
        <div className="w-full lg:w-2/3">
          <div className="mt-6 w-full ">
            <div className="flex items-center justify-between">
              <div className="flex w-full container mx-auto max-w-5/6 items-center">
                <StepIndicator number={1} title="Basic Info" isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <div className={`h-1 rounded-full w-full ${currentStep > 1 ? "bg-primary" : "bg-gray-200"}`} />
                <StepIndicator number={2} title="Job Details" isActive={currentStep === 2} isCompleted={currentStep > 2} />
                <div className={`h-1 rounded-full w-full ${currentStep > 2 ? "bg-primary" : "bg-gray-200"}`} />
                <StepIndicator number={3} title="Requirements" isActive={currentStep === 3} isCompleted={currentStep > 3} />
                <div className={`h-1  rounded-full w-full ${currentStep > 3 ? "bg-primary" : "bg-gray-200"}`} />
                <StepIndicator
                  number={4}
                  title="Review & Publish"
                  isActive={currentStep === 4}
                  isCompleted={currentStep > 4}
                />
              </div>
            </div>
            {currentStep === 1 && <BasicInfoStep onSuccess={handleNextStep} />}
            {currentStep === 2 && <JobDetailsStep onSuccess={handleNextStep} sessionId={""} />}
            {currentStep === 3 && <RequirementsStep onSuccess={handleNextStep} sessionId={""} />}
            {currentStep === 4 && <ReviewStep />}
          </div>

         
        </div>
         <div className="w-full lg:w-1/3 hidden  lg:block">
            <Card className="bg-sky-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Home className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">AI Assistant</h3>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Ask AI anything about job posting...</p>
                </div>
                <Input className="mt-4" placeholder="Type your question here..." />
                <div className="mt-6">
                  <h4 className="text-sm font-medium">Smart Suggestions</h4>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-md bg-gray-50 p-2 text-xs">
                      <div className="font-medium">Title Suggestion</div>
                      <div className="mt-1">Senior Frontend Developer</div>
                    </div>
                    <div className="rounded-md bg-gray-50 p-2 text-xs">
                      <div className="font-medium">Salary Range (Market Average)</div>
                      <div className="mt-1">$120,000 - $180,000 / year</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-sm font-medium">Similar Active Positions</h4>
                  <div className="mt-2 space-y-2 text-xs">
                    <div>
                      <div className="font-medium">Senior Frontend Developer</div>
                      <div className="text-muted-foreground">Google • San Francisco • $150-180K</div>
                    </div>
                    <div>
                      <div className="font-medium">Frontend Team Lead</div>
                      <div className="text-muted-foreground">Meta • Remote • $160-200K</div>
                    </div>
                  </div>
                  <Button variant="link" className="mt-1 h-auto p-0 text-xs">
                    View all
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>


    </MainLayout>
  )
}

export default CreateJobPage;

interface StepIndicatorProps {
  number: number
  title: string
  isActive: boolean
  isCompleted: boolean
}

function StepIndicator({ number, title, isActive, isCompleted }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center text-center sm:min-w-32  lg:mb-8  ">
      <div
        className={`flex h-10 w-10 items-center justify-center  rounded-full border-2 ${isActive
          ? "border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white"
          : isCompleted
            ? "border bg-gradient-to-r from-[#63A7D4] to-[#F295BE] text-white"
            : "border-gray-200 bg-white text-gray-400"
          }`}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : number}
      </div>
      <span className={`mt-2 text-xs font-medium ${isActive || isCompleted ? "text-foreground" : "text-gray-500"}`}>
        {title}
      </span>
    </div>
  )
}



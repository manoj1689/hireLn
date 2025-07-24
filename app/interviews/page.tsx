

"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"

// import {
//   fetchInterviews,
//   fetchInterview,
//   updateInterviewStatus,
//   rescheduleInterview,
//   deleteInterview,
//   submitInterviewFeedback,
//   type Interview,
// } from "@/lib/slices/interviews/fetch-interview-slice"
import { toast } from "sonner"

// Import all components
import { InterviewHeader } from "@/components/interviews/interview-header"
import { InterviewFilters } from "@/components/interviews/interview-filters"
import { InterviewList } from "@/components/interviews/interview-list"
import { InterviewDetailsDialog } from "@/components/interviews/interview-details-dialog"
import { RescheduleDialog } from "@/components/interviews/reschedule-dialog"
import { FeedbackDialog } from "@/components/interviews/feedback-dialog"
import { MainLayout } from "@/components/layout/main-layout"
import { fetchInterviews } from "@/lib/slices/interviews/fetch-interview-slice"
import { InterviewResponse } from "@/interface/interview"
import { getInterviewById,deleteInterview } from "@/lib/slices/interviews/fetch-interview-slice";
export default function InterviewsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { interviews, loading, error } = useSelector((state: RootState) => state.fetchInterview);
  //const { interviews, currentInterview, loading, error, filters } = useSelector((state: RootState) => state.fetchInterview)
  console.log("interview list",interviews)
  // State for dialogs and forms
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [currentInterview, setCurrentInterview] = useState<InterviewResponse | null>(null);


  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  //const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)

  useEffect(() => {
    dispatch(
      fetchInterviews({
        skip: 0,
        limit: 10,
        status: selectedStatus,   // e.g., from state
        type: selectedType,       // e.g., from dropdown
        from_date: fromDate? fromDate.toISOString().split("T")[0] : undefined,     // format: 'YYYY-MM-DD'
        to_date: toDate? toDate.toISOString().split("T")[0] : undefined,
      })
    );
  }, [dispatch, selectedStatus, selectedType, fromDate, toDate]);


   // // Event handlers


// ...

const handleViewDetails = async (interview: InterviewResponse) => {
  try {
    const fullInterview = await dispatch(getInterviewById(interview.id)).unwrap();
    setCurrentInterview(fullInterview);
    setShowDetailsDialog(true);
  } catch (error) {
    toast.error("Failed to fetch interview details");
  }
};




  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



 
  // const handleStatusUpdate = async (interviewId: string, newStatus: string) => {
  //   try {
  //     await dispatch(updateInterviewStatus({ interviewId, status: newStatus })).unwrap()
  //     toast.success("Interview status updated successfully")
  //   } catch (error) {
  //     toast.error("Failed to update interview status")
  //   }
  // }

  // const handleReschedule = async (data: {
  //   newDate: string
  //   newTime: string
  //   reason: string
  //   notifyCandidate: boolean
  // }) => {
  //   if (!selectedInterview) return

  //   try {
  //     await dispatch(
  //       rescheduleInterview({
  //         interviewId: selectedInterview.id,
  //         ...data,
  //       }),
  //     ).unwrap()
  //     toast.success("Interview rescheduled successfully")
  //     setShowRescheduleDialog(false)
  //   } catch (error) {
  //     toast.error("Failed to reschedule interview")
  //   }
  // }

  const handleDelete = async (interviewId: string) => {
    try {
      await dispatch(deleteInterview(interviewId)).unwrap()
      toast.success("Interview deleted successfully")
    } catch (error) {
      toast.error("Failed to delete interview")
    }
  }

  // const handleSubmitFeedback = async (feedback: any) => {
  //   if (!selectedInterview) return

  //   try {
  //     await dispatch(
  //       submitInterviewFeedback({
  //         interviewId: selectedInterview.id,
  //         feedback,
  //       }),
  //     ).unwrap()
  //     toast.success("Feedback submitted successfully")
  //     setShowFeedbackDialog(false)
  //   } catch (error) {
  //     toast.error("Failed to submit feedback")
  //   }
  // }

  // const openRescheduleDialog = (interview: Interview) => {
  //   setSelectedInterview(interview)
  //   setShowRescheduleDialog(true)
  // }

  // const openFeedbackDialog = (interview: Interview) => {
  //   setSelectedInterview(interview)
  //   setShowFeedbackDialog(true)
  // }

  return (
    <MainLayout>

      <div className="space-y-6">
        {/* Header Component */}
        <InterviewHeader />

        {/* Filters Component */}
        <InterviewFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onClearFilters={() => {
            setSearchTerm("")
            setSelectedStatus(undefined)
            setSelectedType(undefined)
            setFromDate(null)
            setToDate(null)
          }}
        />


        {/* Interview List Component */}
        <InterviewList
          interviews={interviews}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onViewDetails={handleViewDetails}
          onStatusUpdate={() => { }}
          onReschedule={() => { }}
          onDelete={handleDelete}
          onAddFeedback={() => { }}
        />


        {/* Dialog Components */}
        <InterviewDetailsDialog
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          interview={currentInterview}
        />

        {/* <RescheduleDialog
          open={showRescheduleDialog}
          onOpenChange={setShowRescheduleDialog}
          onReschedule={handleReschedule}
        />

        <FeedbackDialog
          open={showFeedbackDialog}
          onOpenChange={setShowFeedbackDialog}
          onSubmitFeedback={handleSubmitFeedback}
        /> */}
      </div>

    </MainLayout>

  )
}



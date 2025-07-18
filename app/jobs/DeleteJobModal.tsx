"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { deleteJob } from "@/lib/slices/job/jobsList-slice" // Async thunk to delete a job
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal" // Import react-responsive-modal
import "react-responsive-modal/styles.css" // Modal styles

type ConfirmationDeleteJobModalProps = {
  jobId: string | null
  openModal: boolean
  closeModal: () => void
  onDelete: () => void
}

export default function ConfirmationDeleteJobModal({
  jobId,
  openModal,
  closeModal,
  onDelete
}: ConfirmationDeleteJobModalProps) {
  const dispatch = useDispatch<AppDispatch>()

  // Function to handle delete job action
  const handleDeleteJob = () => {
    if (jobId) {
      dispatch(deleteJob(jobId)) // Dispatch delete job action
        .then(() => {
          onDelete() // Callback to update the parent component after deletion
          closeModal() // Close the modal after deleting
        })
        .catch((error: any) => {
          console.error("Failed to delete the job:", error)
          closeModal() // Close the modal if there's an error
        })
    }
  }

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      center
      classNames={{
        modal: 'max-w-md rounded-lg' // Adding rounded corners to the modal
      }}
    >
      <h2 className="text-lg font-bold mb-4">Delete Job</h2>
      <p className="mb-4">Are you sure you want to delete this job? This action cannot be undone.</p>
      
      <div className="flex justify-end gap-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteJob}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}

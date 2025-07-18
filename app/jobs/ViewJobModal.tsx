"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchJobById } from "@/lib/slices/job/jobsList-slice" // Async thunk to fetch a single job
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal" // Import react-responsive-modal
import "react-responsive-modal/styles.css" // Modal styles

type ViewDetailsModalProps = {
  jobId: string | null
  openModal: boolean
  closeModal: () => void
}

export default function ViewDetailsModal({ jobId, openModal, closeModal }: ViewDetailsModalProps) {
  const [jobData, setJobData] = useState<any>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId)) // Dispatch the action to fetch job by ID
        .then((data) => setJobData(data.payload)) // Store the job data once fetched
    }
  }, [jobId, dispatch])

  return (
    <Modal open={openModal} onClose={closeModal} center  classNames={{
        modal: 'max-w-4xl rounded-lg' // Adding rounded corners to the modal
      }}>
      <h2 className="text-lg font-bold mb-4">Job Details</h2>
      {jobData ? (
        <>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p><strong>Title:</strong> {jobData.title}</p>
            <p><strong>Description:</strong> {jobData.description}</p>
            <p><strong>Department:</strong> {jobData.department}</p>
            <p><strong>Location:</strong> {jobData.location}</p>
            <p><strong>Status:</strong> {jobData.status}</p>
          </div>
          <div className="space-y-4">
            <p><strong>Salary:</strong> ${jobData.salaryMin} - ${jobData.salaryMax}</p>
            <p><strong>Experience:</strong> {jobData.experience}</p>
            <p><strong>Education:</strong> {jobData.education}</p>
            <p><strong>Is Remote:</strong> {jobData.isRemote ? "Yes" : "No"}</p>
            <p><strong>Is Hybrid:</strong> {jobData.isHybrid ? "Yes" : "No"}</p>
          </div>
        </div>
         
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Job Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.requirements.length ? (
                jobData.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))
              ) : (
                <p>No requirements listed</p>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Key Responsibilities</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.responsibilities.length ? (
                jobData.responsibilities.map((resp: string, index: number) => (
                  <li key={index}>{resp}</li>
                ))
              ) : (
                <p>No responsibilities listed</p>
              )}
            </ul>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Skills</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.skills.length ? (
                jobData.skills.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))
              ) : (
                <p>No skills listed</p>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Additional Information</h4>
            <p><strong>Experience:</strong> {jobData.experience}</p>
            <p><strong>Education Level:</strong> {jobData.education}</p>
            <p><strong>Remote:</strong> {jobData.isRemote ? "Yes" : "No"}</p>
            <p><strong>Hybrid:</strong> {jobData.isHybrid ? "Yes" : "No"}</p>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Certifications</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.certifications.length ? (
                jobData.certifications.map((cert: string, index: number) => (
                  <li key={index}>{cert}</li>
                ))
              ) : (
                <p>No certifications listed</p>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Languages</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.languages.length ? (
                jobData.languages.map((lang: { name: string, proficiency: string }, index: number) => (
                  <li key={index}>{`${lang.name} (${lang.proficiency})`}</li>
                ))
              ) : (
                <p>No languages listed</p>
              )}
            </ul>
          </div>
        </div>

    
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Soft Skills</h4>
            <ul className="list-disc list-inside space-y-1">
              {jobData.softSkills.length ? (
                jobData.softSkills.map((skill: string, index: number) => (
                  <li key={index}>{skill}</li>
                ))
              ) : (
                <p>No soft skills listed</p>
              )}
            </ul>
          </div>
        </>
       

      ) : (
        <p>Loading job details...</p>
      )}
    </Modal>
  )
}


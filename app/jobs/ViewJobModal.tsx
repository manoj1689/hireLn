"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchJobById } from "@/lib/slices/job/jobsList-slice"
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal"
import "react-responsive-modal/styles.css"

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
      dispatch(fetchJobById(jobId)).then((data) => setJobData(data.payload))
    }
  }, [jobId, dispatch])

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      center
      classNames={{ modal: "max-w-5xl rounded-lg p-6" }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Job Details</h2>

      {jobData ? (
        <div className="space-y-6">
          {/* Top Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <h3 className="text-xl font-bold">{jobData.title}</h3>
              <p className="text-sm text-gray-600">{jobData.location}</p>
              <p className="text-sm text-blue-600">{jobData.experience}</p>
            </div>
            <div className="text-right">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Full Time</span>
              <p className="mt-2 text-lg font-bold text-gray-800">${jobData.salaryMin}/yr</p>
              <p className="text-xs text-gray-500">Salary Expectation</p>
            </div>
          </div>

          {/* Education */}
          <div className="bg-blue-100 text-blue-700 text-center py-2 px-4 rounded-md font-semibold">
            {jobData.education}
          </div>

          {/* Description */}
          <p className="text-gray-700">{jobData.description}</p>

          {/* Requirements */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Requirements</h4>
            <ul className="list-decimal list-inside space-y-1 text-gray-800">
              {jobData.requirements.map((req: string, idx: number) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
             {/* Responsibilities */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Responsibilities</h4>
            <ul className="list-decimal list-inside space-y-1 text-gray-800">
              {jobData.responsibilities.map((req: string, idx: number) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
          {/* Skills, Soft Skills, Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-md border">
              <h5 className="text-red-600 font-semibold mb-2">SKILLS</h5>
              <ul className="list-disc list-inside text-sm">
                {jobData.skills.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-md border">
              <h5 className="text-green-600 font-semibold mb-2">SOFT SKILLS</h5>
              <ul className="list-disc list-inside text-sm">
                {jobData.softSkills.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border">
              <h5 className="text-blue-600 font-semibold mb-2">CERTIFICATIONS</h5>
              <ul className="list-disc list-inside text-sm">
                {jobData.certifications.map((cert: string, idx: number) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Languages</h4>
            <ul className="list-disc list-inside text-sm">
              {jobData.languages.map((lang: { name: string, proficiency: string }, idx: number) => (
                <li key={idx}>{lang.name} ({lang.proficiency})</li>
              ))}
            </ul>
          </div>

          {/* Remote/Hybrid */}
          <div className="flex justify-between items-center text-sm text-gray-700 border-t pt-4">
            <p><strong>Is Remote:</strong> {jobData.isRemote ? "Yes" : "No"}</p>
            <p><strong>Is Hybrid:</strong> {jobData.isHybrid ? "Yes" : "No"}</p>
          </div>
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
    </Modal>
  )
}

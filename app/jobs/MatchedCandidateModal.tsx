"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchMatchedCandidatesByJobId } from "@/lib/slices/aitools/matched-candidate-Slice" // Async thunk to fetch matched candidates
import { AppDispatch } from "@/lib/store"
import { Modal } from "react-responsive-modal" // Import react-responsive-modal
import "react-responsive-modal/styles.css" // Modal styles
import { CandidateResponse } from "@/interface/candidate" // Import the CandidateResponse type
import { useRouter } from "next/navigation"
type MatchedCandidateModalProps = {
  jobId: string | null
  openModal: boolean
  closeModal: () => void
}

export default function MatchedCandidateModal({ jobId, openModal, closeModal }: MatchedCandidateModalProps) {
   const dispatch = useDispatch<AppDispatch>()
   const router=useRouter() 
  const [candidates, setCandidates] = useState<CandidateResponse[]>([]) // Correctly type candidates
 

  useEffect(() => {
    if (jobId) {
      const fetchData = async () => {
        const result = await dispatch(fetchMatchedCandidatesByJobId(jobId)) // Dispatch the action
        if (fetchMatchedCandidatesByJobId.fulfilled.match(result)) {
          setCandidates(result.payload) // Set the payload as the candidates
        }
      }
      fetchData()
    }
  }, [jobId, dispatch])
  console.log("candidates", candidates)
  return (
    <Modal open={openModal} onClose={closeModal} center classNames={{ modal: 'max-w-7xl rounded-lg' }}>
      <h2 className="text-2xl font-bold mb-6 text-center">Matched Candidates</h2>
      {candidates.length > 0 ? (
        <div className="flex flex-col  space-y-6 h-[600px] p-4 overflow-y-auto">
          {candidates.map((candidate: CandidateResponse, index: number) => (
            <div key={index} className="border p-6 rounded-lg shadow-lg bg-white hover:shadow-xl hover:bg-cyan-50  cursor-pointer  transition duration-300 ease-in-out"
            onClick={() => router.push(`/candidates/view-candidate?job_id=${jobId}&candidate_id=${candidate.id}`)} >
              <div className="flex justify-end items-center">
                <span
                  className={`text-xs px-3 py-2 rounded-full font-semibold ${(candidate.applicationStatus ?? "NEW") === "APPLIED" ? "bg-blue-100 text-blue-800" :
                      (candidate.applicationStatus ?? "NEW") === "SCREENING" ? "bg-yellow-100 text-yellow-800" :
                        (candidate.applicationStatus ?? "NEW") === "INTERVIEW" ? "bg-purple-100 text-purple-800" :
                          (candidate.applicationStatus ?? "NEW") === "OFFER" ? "bg-indigo-100 text-indigo-800" :
                            (candidate.applicationStatus ?? "NEW") === "HIRED" ? "bg-green-100 text-green-800" :
                              (candidate.applicationStatus ?? "NEW") === "REJECTED" ? "bg-red-100 text-red-800" :
                                "text-neutral-600 bg-orange-300"
                    }`}
                >
                  {candidate.applicationStatus ?? "NEW"}
                </span>


              </div>
              {/* Top Section: Avatar, Name, Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Left Column: Avatar, Name, Location */}
                <div className="flex items-center gap-6">
                  <img
                    src={candidate.avatarUrl || "/default-avatar.png"}
                    alt={candidate.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.location}</p>
                  </div>
                </div>

                {/* Middle Column: Skills, Phone, Salary Expectation */}
                <div className="flex flex-col justify-start gap-3 text-sm text-muted-foreground">
                  <p><strong>Skills:</strong> {candidate.skills.length ? candidate.skills.join(", ") : "No skills listed"}</p>
                  <p><strong>Phone:</strong> {candidate.phone}</p>
                  <p><strong>Salary Expectation:</strong> ${candidate.salaryExpectation}</p>
                </div>

                {/* Right Column: Status */}

              </div>

              {/* Bottom Section: Experience, AI Match, Resume Links */}
              <div className=" mb-6">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">{candidate.experience} years of experience</p>
                </div>

                <div className="w-2/3 text-center">
                  <p className="text-sm font-medium text-green-600">
                    {/* Mock AI match score */}
                    {Math.floor(Math.random() * 21) + 80}% <span className="text-gray-500">AI match</span>
                  </p>
                  <div className=" h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${Math.floor(Math.random() * 21) + 80}%` }} />
                  </div>
                </div>
              </div>


              {/* Links: Resume, Portfolio, LinkedIn, GitHub */}
              {/* <div className="mt-4 text-sm text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p><strong>Resume:</strong> <a href={candidate.resume} target="_blank" className="text-blue-500 hover:text-blue-700">View Resume</a></p>
                  <p><strong>Portfolio:</strong> <a href={candidate.portfolio} target="_blank" className="text-blue-500 hover:text-blue-700">View Portfolio</a></p>
                  <p><strong>LinkedIn:</strong> <a href={candidate.linkedin} target="_blank" className="text-blue-500 hover:text-blue-700">View LinkedIn</a></p>
                  <p><strong>GitHub:</strong> <a href={candidate.github} target="_blank" className="text-blue-500 hover:text-blue-700">View GitHub</a></p>
                </div>
              </div> */}


              {/* Education */}
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Education:</strong> {candidate.education}</p>
              </div>

              {/* Interview Status */}
              {/* <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Interview Status:</strong> {candidate.interviewStatus}</p>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No candidates found or loading...</p>
      )}


    </Modal>
  )
}

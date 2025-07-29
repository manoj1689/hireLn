"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Modal } from "react-responsive-modal"
import "react-responsive-modal/styles.css"
import { useRouter } from "next/navigation"
import { CandidateResponse } from "@/interface/candidate"
import { AppDispatch } from "@/lib/store"
import { fetchMatchedCandidatesByJobId } from "@/lib/slices/aitools/matched-candidate-Slice"

type MatchedCandidateModalProps = {
  jobId: string | null
  openModal: boolean
  closeModal: () => void
}

export default function MatchedCandidateModal({ jobId, openModal, closeModal }: MatchedCandidateModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [candidates, setCandidates] = useState<CandidateResponse[]>([])

  useEffect(() => {
    if (jobId) {
      const fetchData = async () => {
        const result = await dispatch(fetchMatchedCandidatesByJobId(jobId))
        if (fetchMatchedCandidatesByJobId.fulfilled.match(result)) {
          setCandidates(result.payload)
        }
      }
      fetchData()
    }
  }, [jobId, dispatch])
  console.log("candidates", candidates)
  return (
    <Modal open={openModal} onClose={closeModal} center classNames={{ modal: "max-w-6xl rounded-lg" }}>
      <h2 className="text-2xl font-bold mb-4 text-center">Match Candidate</h2>

      {candidates.length >= 1 ? (
        <div className="max-w-[450px] gap-6 max-h-[80vh] overflow-x-auto py-4">
          {candidates.map((candidate: CandidateResponse, index: number) => (
            <div
              key={index}
              onClick={() =>
                router.push(`/candidates/view-candidate?job_id=${jobId}&candidate_id=${candidate.id}`)
              }
              className="bg-white rounded-xl  shadow-lg hover:bg-pink-50 cursor-pointer p-4 relative"
            >
              {/* Status Badge */}
              <span className="absolute top-4 right-0 text-xs text-white bg-red-400 px-4  py-2 rounded-l-lg">
                {candidate.interviewStatus ?? "NEW"}
              </span>

              {/* Top Circle and Degree */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-stone-600">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {candidate.education || "Degree info not available"}
                </p>
              </div>

              {/* Name & Salary */}
              <div className="bg-blue-50 py-2 px-3 gap-4 rounded flex justify-between items-center my-8">
                <div>
                  <p className="font-medium text-gray-800 text-lg">{candidate.name}</p>
                  <p className="text-sm text-gray-600">{candidate.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">${candidate.salaryExpectation}</p>
                  <p className="text-xs text-gray-600">Salary Expectation</p>
                </div>
              </div>

              {/* Skills & Phone */}
              <div className="space-y-8 text-sm mb-4">
                {/* Skills Section */}
                <div className="flex items-start ">
                  <span className="w-20 font-semibold text-[#3B82F6]">Skills</span>
                  <div className="flex flex-wrap gap-1 max-w-96">
                    {(Array.isArray(candidate.skills) ? candidate.skills : String(candidate.skills).split(",")).map(
                      (skill: string, index: number) => {
                         const hue = Math.floor(Math.random() * 360);
                              const bgColor = `hsl(${hue}, 90%, 85%)`;
                              const textColor = `hsl(${hue},90%, 30%)`;

                              return (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 rounded-full text-xs font-normal"
                                  style={{ backgroundColor: bgColor, color: textColor }}
                                >
                                  {skill.trim()}
                                </span>
                              );
                      }
                    )}
                  </div>
                </div>
                {/* Phone Section */}
                <div className="flex">
                  <span className="w-20 font-semibold text-[#3B82F6]">Phone</span>
                  <span>{candidate.phone}</span>
                </div>


              </div>


              {/* Experience */}
              <p className="text-sm text-stone-500 text-center my-4">
                {candidate.experience}
              </p>

              <div className="flex justify-end text-sm text-neutral-500">
                {candidate.createdAt ? new Date(candidate.createdAt).toDateString() : "2 days ago"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">No candidates found or loading...</p>
      )}
    </Modal>
  )
}

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
  console.log("Matched candidates", candidates)
  return (
    <Modal open={openModal} onClose={closeModal} center classNames={{ modal: "max-w-6xl rounded-lg" }}>
      <h2 className="text-2xl font-bold mb-4 text-center">Match Candidate</h2>

      {candidates.length >= 1 ? (
        <div className=" w-full max-h-[80vh]   space-y-4 overflow-x-auto py-4">
          {candidates.map((candidate: CandidateResponse, index: number) => (
            <div
              key={index}
              onClick={() =>
                router.push(`/candidates/view-candidate?job_id=${jobId}&candidate_id=${candidate.id}`)
              }
              className="bg-orange-50 rounded-xl  shadow-lg hover:bg-pink-50 cursor-pointer p-4 relative"
            >
              {/* Status Badge */}
              <span className="absolute top-4 right-0 text-xs text-white bg-red-400 px-4  py-2 rounded-l-lg">
                {candidate.interviewStatus ?? "NEW"}
              </span>

              {/* Top Circle and Degree */}
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-stone-600">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-col">
                  <p className="text-lg text-primary ">
                    <span></span>{candidate.name}
                  </p>
                  <p className=" text-sm text-muted-foreground">
                    <span>  {candidate.email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span>  {candidate.address}</span>
                  </p>
                </div>

              </div>

              {/* Education */}
              <div className="flex flex-wrap gap-4">
                {candidate.education.map((education, index) => (
                  <div
                    key={index}
                    className="bg-sky-300 p-2 rounded-lg shadow-lg text-sm text-white"
                  >
                    {education.degree}
                  </div>
                ))}
              </div>





              <div className="space-y-4 text-sm m-4">
                {/* Skills Section */}
                <div className="flex items-start gap-4">
                  {/* Label Section: 1/3 */}
                  <div className="w-1/3 text-left">
                    <span className="font-semibold text-[#3B82F6]">Skills</span>
                  </div>

                  {/* Skills Section: 2/3 */}
                  <div className="w-2/3 flex flex-wrap gap-1">
                    {(Array.isArray(candidate.technicalSkills) ? candidate.technicalSkills : String(candidate.technicalSkills).split(",")).map(
                      (technicalSkills: string, index: number) => {
                        const hue = Math.floor(Math.random() * 360);
                        const bgColor = `hsl(${hue}, 90%, 85%)`;
                        const textColor = `hsl(${hue}, 30%, 40%)`;
                        return (
                          <span
                            key={index}
                            className="px-2 py-0.5 rounded-full text-xs font-light whitespace-nowrap"
                            style={{ backgroundColor: bgColor, color: textColor }}
                          >
                            {technicalSkills.trim()}
                          </span>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Phone Section */}


                {/* Experience */}
                <div className="flex w-full mt-3 text-sm text-neutral-500">
                  <div className="w-1/3 text-left font-semibold text-[#3B82F6]">
                    Summary
                  </div>
                  <div className="w-2/3 text-left">
                    {candidate.summary}
                  </div>
                </div>

                {/* Experience */}
                {Array.isArray(candidate.experience) &&
                  candidate.experience.some(exp => exp.title && exp.title.trim() !== "") && (
                    <div className="flex w-full mt-3 text-sm text-neutral-500">
                      <div className="w-1/3 text-left font-semibold text-[#3B82F6]">
                        Experience
                      </div>
                      <div className="w-2/3 text-left">
                        {candidate.experience
                          .filter(exp => exp.title && exp.title.trim() !== "")
                          .map((exp, index) => (
                            <div key={index} className="mb-1">
                              <span className="font-medium">{exp.title}</span>
                              {exp.company && `, ${exp.company}`}
                              {exp.location && `, ${exp.location}`}
                              {(exp.start_date || exp.end_date) && (
                                <span>
                                  {" "}
                                  ({exp.start_date || "N/A"} - {exp.end_date || "Present"})
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}


              </div>

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

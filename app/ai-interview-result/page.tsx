"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchInterviewEvaluation } from '@/lib/slices/final_evaluation/final-evaluate-interview-slice'
import { completeInterview } from "@/lib/slices/join_interview/interview-join-slice"
import { useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from "lucide-react"

const getBadgeColor = (status: string) => {
  switch (status) {
    case "pass":
      return "bg-green-100 text-green-800"
    case "borderline":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-red-100 text-red-800"
  }
}

const EvaluationPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("interview_id") || ""
  const token = searchParams.get("token") || ""

  const { data, loading, error } = useSelector((state: RootState) => state.finalInterviewEvaluation)
  const { interview } = useSelector((state: RootState) => state.joinInterview)

  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvaluationAndComplete = async () => {
      if (interviewId && token && interview?.id) {
        try {
          await dispatch(fetchInterviewEvaluation({ interviewId, token }) as any)
          await dispatch(completeInterview(interview.id))
        } catch (err) {
          console.error("Error fetching evaluation or completing interview:", err)
        }
      }
    }

    fetchEvaluationAndComplete()
  }, [interviewId, token, interview?.id])

  if (loading) return <p className="p-4">Loading evaluation...</p>
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>
  if (!data) return <p className="p-4">No evaluation data available</p>

  return (
    <div className="max-w-4xl mx-auto h-full p-6 justify-center items-center space-y-6">
       div
    
      {/* Evaluation Summary */}
      {/* <div className="bg-white shadow border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Interview Evaluation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div><strong>Interview ID:</strong> {data.interviewId}</div>
          <div><strong>Questions Evaluated:</strong> {data.evaluatedCount}</div>
          <div><strong>Average Score:</strong> {data.averageScore.toFixed(2)} / 5.0</div>
          <div>
            <strong>Status:</strong>{" "}
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(data.passStatus)}`}>
              {data.passStatus.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="mt-4 text-gray-800"><strong>Summary:</strong> {data.summaryResult}</p>
      </div> */}

      {/* Per-Question Evaluation */}
      {/* <div className="space-y-4">
        <h3 className="text-xl font-semibold">Per-Question Evaluations</h3>
        {data.evaluations.map((item: any, index: number) => {
          const isOpen = expandedQuestion === item.questionId

          return (
            <div key={item.questionId} className="bg-gray-50 border rounded-lg shadow-sm">
              <button
                onClick={() =>
                  setExpandedQuestion(prev => (prev === item.questionId ? null : item.questionId))
                }
                className="w-full flex justify-between items-center text-left px-5 py-4 font-medium text-gray-800 hover:bg-gray-100 transition"
              >
                <span>{`Q${index + 1}. ${item.questionText}`}</span>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {isOpen && (
                <div className="px-6 pb-5 text-sm text-gray-700 space-y-3">
                  <p><strong>Answer:</strong> {item.answerText || "Not answered"}</p>

                  {item.evaluation ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><strong>Factual Accuracy:</strong> {item.evaluation.factualAccuracy}</div>
                      <div><strong>Completeness:</strong> {item.evaluation.completeness}</div>
                      <div><strong>Relevance:</strong> {item.evaluation.relevance}</div>
                      <div><strong>Coherence:</strong> {item.evaluation.coherence}</div>
                      <div><strong>Score:</strong> {item.evaluation.score}</div>
                      <div className="md:col-span-2">
                        <strong>Final Summary:</strong>
                        <p className="text-gray-800">{item.evaluation.finalEvaluation}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-600">{item.error || item.note}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div> */}
    </div>
  )
}

export default EvaluationPage

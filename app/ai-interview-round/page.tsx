import { Suspense } from "react"
import InterviewRoundPage from "./AiInterviewRound"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading interview screen...</div>}>
      <InterviewRoundPage />
    </Suspense>
  )
}

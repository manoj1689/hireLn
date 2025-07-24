import { Suspense } from "react"
import InterviewResultPage from "./InterviewResult"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading interview Result...</div>}>
      <InterviewResultPage />
    </Suspense>
  )
}

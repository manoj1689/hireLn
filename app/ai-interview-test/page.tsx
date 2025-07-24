import { Suspense } from "react"
import InterviewTestScreenPage from "./InterviewTest"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading interview Test screen...</div>}>
      <InterviewTestScreenPage />
    </Suspense>
  )
}

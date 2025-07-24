import { Suspense } from "react"
import InterviewScreenPage from "./InterviewScreen"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading interview screen...</div>}>
      <InterviewScreenPage />
    </Suspense>
  )
}

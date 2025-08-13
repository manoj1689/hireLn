import { Suspense } from "react"
import CandidateResultPage from "./ResultScreen"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading result screen...</div>}>
      <CandidateResultPage />
    </Suspense>
  )
}

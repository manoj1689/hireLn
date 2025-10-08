import { Suspense } from "react"
import JobAcceptPage from "./JobAccept"

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading Job Accept...</div>}>
      <JobAcceptPage />
    </Suspense>
  )
}

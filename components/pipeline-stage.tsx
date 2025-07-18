interface PipelineStageProps {
  stage: string
  count: number
  percentage: number
}

export function PipelineStage({ stage, count, percentage }: PipelineStageProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{stage}</span>
        <span className="text-sm font-medium">{count}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

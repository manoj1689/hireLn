import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string
  trend: string
  trendUp: boolean
  iconColor: string
  action?: React.ReactNode
}

export function MetricCard({ icon: Icon, title, value, trend, trendUp, iconColor, action }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="mt-4 text-3xl font-bold">{value}</div>
        <div className="mt-2 flex items-center text-xs">
          <span className={`font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}>{trend}</span>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

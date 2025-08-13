import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string
  trend: string
  trendUp: boolean
  iconColor: string
  backgroundColour:string
  action?: React.ReactNode
}

export function MetricCard({ icon: Icon, title, value, trend, trendUp, iconColor, action ,backgroundColour }: MetricCardProps) {
  return (
    <Card className={`${backgroundColour}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-2 ${iconColor}`}>
            <Icon className="h-8 w-8" />
          </div>
          <span className="text-sm md:text-md lg:text-lg font-medium">{title}</span>
        </div>
        <div className="mt-4 text-3xl font-semibold px-4">{value}</div>
        <div className="mt-2 flex items-center text-md">
          <span className={`font-light ${trendUp ? "text-green-600" : "text-red-600"}`}>{trend}</span>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

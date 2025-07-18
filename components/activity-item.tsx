import type React from "react"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}

export function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4">
      {icon}
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="mt-1 text-xs text-muted-foreground">{time}</div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  )
}

import type React from "react"
import { MoreVertical } from "lucide-react"

interface ActivityItemProps {
  icon: React.ReactNode
  type: string
  title: string
  description: string
  time: string
}

export function ActivityItem({ icon, type, title, description, time }: ActivityItemProps) {
  // Move dynamic color generation here (outside JSX)
  const hue = Math.floor(Math.random() * 360)
  const textColor = `hsl(${hue}, 30%, 40%)`

  return (
    <div className="flex w-full justify-between border-b-2 hover:shadow-lg hover:bg-pink-50 p-4 hover:rounded-t-lg gap-4">
      <div className="flex gap-4">
        <div>{icon}</div>
        <div className="flex items-start flex-col">
          <div className="font-medium">{title}</div>
          <div className="text-sm font-light text-muted-foreground">{description}</div>
        </div>
      </div>

      <div
        className="flex text-xs items-center px-2 py-1 rounded"
        style={{ color: textColor }}
      >
        {type}
      </div>

      <div>
        <div className="mt-1 text-xs text-muted-foreground">{time}</div>
      </div>

      {/* Uncomment this if you want the options button */}
      {/* 
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreVertical className="h-4 w-4" />
      </Button> 
      */}
    </div>
  )
}

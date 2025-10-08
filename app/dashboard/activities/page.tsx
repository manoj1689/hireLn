"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchActivities } from "@/lib/slices/dashboard/dashboard-slice"
import { ActivityItem } from "@/components/activity-item"
import { activityTypeIconMap } from "@/components/activity-Icons"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ActivitiesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { activities } = useSelector((state: RootState) => state.dashboard)
    const { user } = useSelector((state: RootState) => state.auth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(fetchActivities())
  }, [dispatch])

  if (!mounted) return null

  return (
    <MainLayout>
      <div className="flex flex-col mb-6 px-4">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-primary hover:underline mb-1 gap-1"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className="flex w-full flex-col lg:flex-row bg-primary-gradient space-y-4 justify-between px-4 py-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Recent Activities</h1>
          <p className=" text-white">
            Welcome back, {user?.name || "Jack"}! Here's your activities overview.
          </p>
        </div>
   
      </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">All Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No activities found.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {[...activities].reverse().map((activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  icon={activityTypeIconMap[activity.type] ?? <></>}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

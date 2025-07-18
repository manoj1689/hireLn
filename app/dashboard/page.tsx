"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Download, FileText, Plus, Users, Clock } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/metric-card"
import { RecruitmentChart } from "@/components/recruitment-chart"
import { PipelineStage } from "@/components/pipeline-stage"
import { ActivityItem } from "@/components/activity-item"
import { DepartmentChart } from "@/components/department-chart"
import { useRouter } from "next/navigation"
import {
  fetchActivities,
  fetchDashboardMetrics,
  fetchPipelineStages,
  fetchRecruitmentTrends,
} from "@/lib/slices/dashboard/dashboard-slice"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { metrics, activities, pipelineStages } = useSelector((state: RootState) => state.dashboard)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(fetchDashboardMetrics())
    dispatch(fetchActivities())
    dispatch(fetchPipelineStages())
    dispatch(fetchRecruitmentTrends())
  }, [dispatch])

  if (!mounted || !metrics) return null

  return (
    <MainLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "Jack"}! Here's your recruitment overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Job
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          icon={FileText}
          title="Total Job Postings"
          value={metrics.totalJobs.toString()}
          trend="+12% vs last month"
          trendUp={true}
          iconColor="bg-emerald-100 text-emerald-600"
        />
        <MetricCard
          icon={Users}
          title="Active Candidates"
          value={metrics.activeCandidates.toString()}
          trend="+8% vs last month"
          trendUp={true}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <MetricCard
          icon={BarChart3}
          title="Hiring Success Rate"
          value={`${metrics.hiringSuccessRate}%`}
          trend="+15% vs last month"
          trendUp={true}
          iconColor="bg-green-100 text-green-600"
        />
        <MetricCard
          icon={Clock}
          title="Avg. Time to Hire"
          value={`${metrics.avgTimeToHire} days`}
          trend="-2 days vs last month"
          trendUp={false}
          iconColor="bg-orange-100 text-orange-600"
        />
        <MetricCard
          icon={BarChart3}
          title="AI Interviews Completed"
          value={metrics.aiInterviewsCompleted.toString()}
          trend="+25% vs last month"
          trendUp={true}
          iconColor="bg-purple-100 text-purple-600"
          action={
            <Button
              size="sm"
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => router.push("/result/interview-results")}
            >
              View Results
            </Button>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recruitment Trends</CardTitle>
            <Tabs defaultValue="monthly">
              <TabsList className="grid w-[240px] grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <RecruitmentChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Hiring Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <PipelineStage
                  key={stage.stage}
                  stage={stage.stage}
                  count={stage.count}
                  percentage={stage.percentage}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Activities</CardTitle>
            <Link href="/activities" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <DepartmentChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

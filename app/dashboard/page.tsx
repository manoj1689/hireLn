"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Download, FileText, Plus, Users, Clock, MessageCircle } from "lucide-react"
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
  fetchDepartmentStats
} from "@/lib/slices/dashboard/dashboard-slice"
import { activityTypeIconMap } from "@/components/activity-Icons"

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { metrics, activities, pipelineStages, recruitmentTrends, departmentStats } = useSelector((state: RootState) => state.dashboard)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(fetchDashboardMetrics())
    dispatch(fetchActivities())
    dispatch(fetchPipelineStages())
    dispatch(fetchRecruitmentTrends())
    dispatch(fetchDepartmentStats())
  }, [dispatch])

  if (!mounted || !metrics) return null

  return (
    <MainLayout>
      <div className="flex w-full flex-col lg:flex-row bg-primary-gradient space-y-4 justify-between px-4 py-4 shadow-lg rounded-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Recruitment Dashboard</h1>
          <p className=" text-white">
            Welcome back, {user?.name || "Jack"}! Here's your recruitment overview.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button> */}
          <Button size="sm" className="flex items-center gap-2" onClick={() => router.push("/jobs/create")} >
            <Plus className="h-4 w-4" />
            Create New Job
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-md flex flex-col border-2 lg:flex-row justify-between  mt-4 ">
        <div className="flex w-full lg:w-2/3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-medium">AI Interviews Completed</div>
              <div className="text-sm font-light text-gray-400">Here’s your overall report</div>
            </div>
          </div>

        </div>
        <div className="flex flex-row w-full lg:w-1/3 justify-around">
          <div className="flex flex-col justify-center items-center">
            <div className="text-2xl font-semibold text-gray-800">{metrics.aiInterviewsCompleted.value}</div>
            <div className={`text-sm ${true ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.aiInterviewsCompleted.change} % vs last month
            </div>
          </div>
          <div className="flex items-center justify-between">

            <Button
              size="sm"
              variant="secondary"
              className="mt-2 w-full border-none bg-transparent text-md hover:bg-transparent hover:scale-105  text-sky-500 underline "
              onClick={() => router.push("/dashboard/result/interview-results")}
            >
              View Results
            </Button>
          </div>
        </div>

      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          backgroundColour="bg-red-50"
          icon={FileText}
          title="Total Job Postings"
          value={metrics.totalJobs.value.toString()}
          trend={`${metrics.totalJobs.change >= 0 ? '+' : ''}${metrics.totalJobs.change}% vs last month`}
          trendUp={metrics.totalJobs.change >= 0}
          iconColor="bg-red-200 text-red-400"
        />

        <MetricCard
          backgroundColour="bg-indigo-50"
          icon={Users}
          title="Active Candidates"
          value={metrics.activeCandidates.value.toString()}
          trend={`${metrics.activeCandidates.change >= 0 ? '+' : ''}${metrics.activeCandidates.change}% vs last month`}
          trendUp={metrics.activeCandidates.change >= 0}
          iconColor="bg-indigo-200 text-indigo-400"
        />

        <MetricCard
          backgroundColour="bg-green-50"
          icon={BarChart3}
          title="Hiring Success Rate"
          value={`${metrics.hiringSuccessRate.value}%`}
          trend={`${metrics.hiringSuccessRate.change >= 0 ? '+' : ''}${metrics.hiringSuccessRate.change}% vs last month`}
          trendUp={metrics.hiringSuccessRate.change >= 0}
          iconColor="bg-green-200 text-green-400"
        />

        <MetricCard
          backgroundColour="bg-orange-50"
          icon={Clock}
          title="Avg. Time to Hire"
          value={`${metrics.avgTimeToHire.value} days`}
          trend={`${metrics.avgTimeToHire.change >= 0 ? '-' : '+'}${Math.abs(metrics.avgTimeToHire.change)}% vs last month`}
          trendUp={metrics.avgTimeToHire.change < 0} // lower time is better
          iconColor="bg-orange-200 text-orange-400"
        />


      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recruitment Trends</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <RecruitmentChart recruitmentTrends={recruitmentTrends} />
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
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[...activities].reverse().map((activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  icon={activityTypeIconMap[activity.type] ?? <MessageCircle className="text-gray-400" />}
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
              <DepartmentChart departmentStats={departmentStats} />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

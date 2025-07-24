"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {EvaluationTabs} from "./result-evaluation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Download,
  Users,
  Share,
  Mail,
  UserPlus,
  CalendarPlus,
  Play,
  PlayCircle,
  PieChartIcon as ChartPie,
  TimerIcon as Stopwatch,
  BotIcon as Robot,
  CheckCircle,
  Circle,
  CircleIcon as ExclamationCircle,
  PrinterIcon as Print,
  AlertTriangle,
} from "lucide-react"

import { AppDispatch, RootState } from "@/lib/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchResultByInterviewId } from "@/lib/slices/interview_result/interview-result-slice"
import { useSearchParams } from "next/navigation"
import { fetchJobById } from "@/lib/slices/job/jobsList-slice"
import { fetchCandidateById } from "@/lib/slices/candidate/candidate-slice"

const CandidateResultPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("interview_id") || ""
  const [showTranscriptSection, setShowTranscriptSection] = useState(0)
  const [jobData, setJobData] = useState<any>(null)
  const [candidateData, setCandidateData] = useState<any>(null)
  const [loadingLocal, setLoadingLocal] = useState(false)

  const { result, loading, error } = useSelector((state: RootState) => state.interviewResult)

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchResultByInterviewId(interviewId))
    }
  }, [interviewId, dispatch])

  useEffect(() => {
    const fetchData = async () => {
      if (!result) return

      setLoadingLocal(true)
      try {
        if (result.jobId) {
          const jobResult = await dispatch(fetchJobById(result.jobId))
          setJobData(jobResult.payload)
        }

        if (result.candidateId) {
          const candidateResult = await dispatch(fetchCandidateById(result.candidateId))
          setCandidateData(candidateResult.payload)
        }
      } catch (error) {
        console.error("Error fetching job or candidate:", error)
      } finally {
        setLoadingLocal(false)
      }
    }

    fetchData()
  }, [result, dispatch])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Recommended":
        return "secondary"
      case "Highly Recommended":
        return "default"
      case "Under Review":
        return "outline"
      default:
        return "secondary"
    }
  }

  if (loading || loadingLocal) return <p className="p-4">Loading evaluation...</p>
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>
  if (!result) return <p className="p-4">No interview result data available</p>
  console.log("job data", jobData)
  console.log("candidate data", candidateData)
  console.log("result data", result)
  return (
    <MainLayout>
      <main className="flex-1 p-6 overflow-auto">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header with Breadcrumbs */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button
                variant="ghost"
                className="mb-2 p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interview Results
              </Button>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <span className="hover:text-primary cursor-pointer">Dashboard</span>
                <span className="mx-2">/</span>
                <span className="hover:text-primary cursor-pointer">AI Interview Results</span>
                <span className="mx-2">/</span>
                <span className="text-foreground">{candidateData?.name || "N/A"}</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Candidate Interview Details</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Compare Candidates
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </div>

          {/* Candidate Profile Section */}
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-32"></div>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap md:flex-nowrap">
                <div className="flex items-start -mt-12 mr-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                    <AvatarFallback className="text-2xl">
                      {candidateData?.name?.split(" ").map(n => n[0]).join("") || "NA"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 mt-4 md:mt-0">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2 className="text-2xl font-bold mr-3">{candidateData?.name || "N/A"}</h2>
                        <Badge variant={getStatusBadgeVariant(result?.passStatus || "")}>{result?.passStatus}</Badge>
                      </div>
                      <p className="text-lg text-muted-foreground">{jobData?.title || "N/A"}</p>
                    </div>
                    <Card className="mt-4 md:mt-0">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">{(result?.averageScore || 0)}</div>
                        <Progress value={(result?.averageScore || 0) * 10} className="w-20 h-2 mb-2" />
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{candidateData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{candidateData?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interview Date</p>
                      <p className="font-medium">{result?.interview?.scheduledAt ? new Date(result.interview.scheduledAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interview Duration</p>
                      <p className="font-medium">{result?.interview?.duration || "N/A"} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Position Applied</p>
                      <p className="font-medium">{jobData?.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">{candidateData?.experience}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Interview Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Performance Summary</CardTitle>
                <ChartPie className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Factual Accuracy</span>
                    <span className="font-medium">{result.averageFactualAccuracy.toFixed(2)} / 5</span>
                  </div>
                  <Progress value={(result.averageFactualAccuracy / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Completeness</span>
                    <span className="font-medium">{result.averageCompleteness.toFixed(2)} / 5</span>
                  </div>
                  <Progress value={(result.averageCompleteness / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Relevance</span>
                    <span className="font-medium">{result.averageRelevance.toFixed(2)} / 5</span>
                  </div>
                  <Progress value={(result.averageRelevance / 5) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Coherence</span>
                    <span className="font-medium">{result.averageCoherence.toFixed(2)} / 5</span>
                  </div>
                  <Progress value={(result.averageCoherence / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Interview Metrics</CardTitle>
                <Stopwatch className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card><CardContent className="p-3"><div className="text-muted-foreground text-sm mb-1">Questions</div><div className="text-xl font-semibold">{result.totalQuestions}</div></CardContent></Card>
                  <Card><CardContent className="p-3"><div className="text-muted-foreground text-sm mb-1">Duration</div><div className="text-xl font-semibold">{result.interview?.duration} min</div></CardContent></Card>
                  <Card><CardContent className="p-3"><div className="text-muted-foreground text-sm mb-1">Avg Score</div><div className="text-xl font-semibold">{result.averageScore.toFixed(2)} / 5</div></CardContent></Card>
                  <Card><CardContent className="p-3"><div className="text-muted-foreground text-sm mb-1">Completion</div><div className="text-xl font-semibold">{((result.evaluatedCount / result.totalQuestions) * 100).toFixed(0)}%</div></CardContent></Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">Candidate Outcome</CardTitle>
                <AlertTriangle className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  <p><span className="font-medium text-foreground">Summary:</span> {result.summaryResult || "No summary available."}</p>
                  <p><span className="font-medium text-foreground">Knowledge Level:</span> {result.knowledgeLevel || "Not provided"}</p>
                  <p><span className="font-medium text-foreground">Status:</span> {result.passStatus || "Unknown"}</p>
                </div>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium mb-1">Recommendation</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.recommendations || "No recommendation provided."}
                    </p>
                  </CardContent>
                </Card>
              
              </CardContent>
            </Card>
          </div>

          {/* Tabs Navigation */}
         {result?.evaluations && <EvaluationTabs evaluations={result.evaluations} />}


          {/* Action Panel */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Candidate Actions</h3>
                  <p className="text-muted-foreground mt-1">Take the next steps with this candidate</p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add to Shortlist
                  </Button>
                  <Button variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </MainLayout>
  )
}

export default CandidateResultPage

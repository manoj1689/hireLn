"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EvaluationTabs } from "./result-evaluation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Share,
  Mail,
  UserPlus,
  CalendarPlus,
  PieChartIcon as ChartPie,
  TimerIcon as Stopwatch,
  BotIcon as Robot,
  CircleIcon as ExclamationCircle,
  PrinterIcon as Print,
  Clock,
  MapPin,
  Phone,
  Briefcase,
} from "lucide-react"
import {
  Info,
  CheckCircle2,
  XCircle,
  Smile,
  BarChart2
} from "lucide-react"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AppDispatch, RootState } from "@/lib/store"
import { useDispatch, useSelector } from "react-redux"
import { fetchResultByInterviewId } from "@/lib/slices/interview_result/interview-result-slice"
import { useSearchParams } from "next/navigation"
import { fetchJobById } from "@/lib/slices/job/jobsList-slice"
import { fetchCandidateById } from "@/lib/slices/candidate/candidate-slice"
import { ResultDetailHeader } from "./result-details-header"
import { ApplicationStatus } from "@/interface/types/applicationTypes"
import { sendInterviewResultEmail } from "@/lib/slices/interview/sendInterviewResultSlice"
import { toast } from "react-toastify"


const CandidateResultPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()
  const interviewId = searchParams.get("interview_id") || ""
  const [showTranscriptSection, setShowTranscriptSection] = useState(0)
  const [jobData, setJobData] = useState<any>(null)
  const [candidateData, setCandidateData] = useState<any>(null)
  const [loadingLocal, setLoadingLocal] = useState(false)

  const { result, loading, error } = useSelector((state: RootState) => state.interviewResult)
  const { application } = useSelector((state: RootState) => state.application);
  const { loading: emailLoading, success, error: emailError } = useSelector(
    (state: RootState) => state.finalMail
  );
  console.log("application", application)
  const isPass = result?.passStatus?.toLowerCase() === "pass"


  // Show toast on success
  useEffect(() => {
    if (success) {
      toast.success("Email sent successfully!");
    }
  }, [success]);


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

  const handleSendEmail = (interviewId: string) => {
    if (!interviewId) return;
    dispatch(sendInterviewResultEmail(interviewId));
  };
  console.log("candidate data", candidateData)
  console.log("job data", jobData)

  console.log("result data", result)
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
  const statusColors: Record<ApplicationStatus, string> = {
    APPLIED: "text-blue-400",
    SCREENING: "text-purple-400",
    INTERVIEW: "text-yellow-400",
    OFFER: "text-green-400",
    HIRED: "text-emerald-400",
    REJECTED: "text-red-400",
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
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="container mx-auto space-y-4 ">
          {/* Page Header with Breadcrumbs */}
          <div className="flex items-center justify-between ">
            <div>
              <Button
                variant="ghost"
                className="mb-2 p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </div>

          </div>
          <div className="flex space-x-3">
            <ResultDetailHeader interview={candidateData} applicationId={result?.applicationId} />

          </div>
          {/* Candidate Profile Section */}
          <Card className="mb-6 overflow-hidden">
            <div
              className={`flex items-center justify-end px-4 h-24 text-3xl bg-gradient-to-r from-cyan-400 to-cyan-500 ${candidateData?.applicationStatus && statusColors[candidateData.applicationStatus as ApplicationStatus]
                ? statusColors[candidateData.applicationStatus as ApplicationStatus]
                : "text-gray-500"
                }`}
            >
              {candidateData?.applicationStatus ?? "No Status"}
            </div>

            <div className="flex items-start -mt-12 ml-12">
              <Avatar className="h-24 w-24 shadow-md">
                <AvatarFallback className="text-3xl font-bold text-stone-600">
                  {candidateData?.name?.split(" ").map(n => n[0]).join("") || "NA"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="px-6 pb-6">
              <div className="flex flex-wrap md:flex-nowrap">

                <div className="flex-1 ">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2 className="text-2xl font-bold mr-3">{candidateData?.name || "N/A"}</h2>
                        <Badge variant={getStatusBadgeVariant(result?.passStatus || "")}>{result?.passStatus}</Badge>
                      </div>
                      {/* Education */}
                      {candidateData?.education && (
                        <div className="flex  space-y-1 flex-col">

                          <span className="text-sm text-stone-600">{candidateData.education}</span>
                        </div>
                      )}
                    </div>
                    <Card className="mt-4 md:mt-0">
                      <CardContent className="p-6 text-center bg-cyan-400 rounded-lg">
                        <div className="text-3xl font-bold mb-2 text-white">{(result?.averageScore || 0)}</div>
                        <Progress value={(result?.averageScore || 0) * 10} className="w-20 h-2 mb-2" />
                        <div className="text-sm text-white text-muted-foreground">Overall Score</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="flex flex-col lg:flex-row gap-4 border-none shadow-none">
                    <CardContent className="lg:border-r-2">
                      <div className="p-4 space-y-6">
                        {/* Contact Info */}
                        <div className="space-y-3">
                          {candidateData?.email && (
                            <a href={`mailto:${candidateData.email}`} className="block">
                              <div className="flex items-center gap-2 text-gray-800 break-all">
                                <Mail className="text-sky-500 w-4 h-4" />
                                <span className="text-sm">{candidateData.email}</span>
                              </div>
                            </a>
                          )}

                          {candidateData?.location && (
                            <div className="flex items-center gap-2 text-gray-800">
                              <MapPin className="text-orange-500 w-4 h-4" />
                              <span className="text-sm">{candidateData.location}</span>
                            </div>
                          )}

                          {candidateData?.phone && (
                            <div className="flex items-center gap-2 text-gray-800">
                              <Phone className="text-green-500 w-4 h-4" />
                              <span className="text-sm">{candidateData.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {candidateData?.skills?.length > 0 && (
                          <div className="space-y-2">
                            <span className="font-semibold text-sky-600">Skills</span>
                            <div className="flex flex-wrap gap-2">
                              {candidateData.skills.map((skill: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-4 py-1 rounded-full text-white text-xs font-medium bg-orange-400"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {candidateData?.experience && (
                          <div className="flex  space-y-1 flex-col">
                            <span className="font-semibold text-sky-600">Experience</span>
                            <span className="text-sm text-stone-600">{candidateData.experience}</span>
                          </div>
                        )}



                        {/* Salary Expectation */}
                        {candidateData?.salaryExpectation && (
                          <div className="flex  space-y-1 flex-col">
                            <span className="font-semibold text-sky-600">Expected Salary</span>
                            <span className="text-sm text-stone-600">
                              ₹{candidateData.salaryExpectation.toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}

                        {/* Candidate Links */}
                        {(candidateData?.github || candidateData?.linkedin || candidateData?.resume || candidateData?.portfolio) && (
                          <div className="flex justify-around items-center pt-6 border-t-2">
                            {candidateData.github && (
                              <a href={candidateData.github} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/github.png" alt="GitHub" className="w-10 h-10" />
                              </a>
                            )}
                            {candidateData.linkedin && (
                              <a href={candidateData.linkedin} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/linkedin.png" alt="LinkedIn" className="w-10 h-10" />
                              </a>
                            )}
                            {candidateData.resume && (
                              <a href={candidateData.resume} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/download.png" alt="Download Resume" className="w-10 h-10" />
                              </a>
                            )}
                            {candidateData.portfolio && (
                              <a href={candidateData.portfolio} target="_blank" rel="noopener noreferrer">
                                <img src="/images/candidate/whatsapp.png" alt="Portfolio" className="w-10 h-10" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardContent>
                      <div className="space-y-4">
                        {jobData?.title && (
                          <h2 className="text-lg font-bold text-gray-800">{jobData.title}</h2>
                        )}

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {jobData?.employmentType && (
                            <div className="bg-red-100 rounded-xl py-4 px-6 flex items-center gap-4">
                              <Briefcase className="text-red-500" />
                              <div>
                                <p className="text-sm text-gray-600">Work Mode</p>
                                <p className="font-bold text-lg text-red-700">{jobData.employmentType}</p>
                              </div>
                            </div>
                          )}
                          {jobData?.duration && (
                            <div className="bg-blue-100 rounded-xl py-4 px-6 flex items-center gap-4">
                              <Clock className="text-blue-500" />
                              <div>
                                <p className="text-sm text-gray-600">Job Duration</p>
                                <p className="font-bold text-lg text-blue-700">{jobData.duration}</p>
                              </div>
                            </div>
                          )}
                          {jobData?.location && (
                            <div className="bg-yellow-100 rounded-xl py-4 px-6 flex items-center gap-4">
                              <MapPin className="text-yellow-500" />
                              <div>
                                <p className="text-sm text-gray-600">Location</p>
                                <p className="font-bold text-lg text-yellow-700">{jobData.location}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {jobData?.description && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-700 mt-4">Description</h3>
                            <p className="text-gray-700 text-sm mt-1">{jobData.description}</p>
                          </div>
                        )}

                        {/* Experience & Education */}
                        {(jobData?.experience || jobData?.education) && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {jobData?.experience && (
                              <div>
                                <h3 className="text-md font-semibold text-gray-700">Experience</h3>
                                <p className="text-sm text-gray-700 mt-1">{jobData.experience}</p>
                              </div>
                            )}
                            {jobData?.education && (
                              <div>
                                <h3 className="text-md font-semibold text-gray-700">Education</h3>
                                <p className="text-sm text-gray-700 mt-1">{jobData.education}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Salary */}
                        {jobData?.salaryMin && jobData?.salaryMax && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-700">Salary</h3>
                            <p className="text-sm text-gray-700 mt-1">
                              ₹{jobData.salaryMin.toLocaleString()} – ₹{jobData.salaryMax.toLocaleString()} / {jobData.salaryPeriod || "year"}
                            </p>
                          </div>
                        )}

                        {/* Responsibilities */}
                        {/* {Array.isArray(jobData?.responsibilities) && jobData.responsibilities.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-700">Responsibilities</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                              {jobData.responsibilities.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )} */}

                        {/* Skills */}
                        {Array.isArray(jobData?.skills) && jobData.skills.length > 0 && (
                          <div className="w-full my-4">
                            <h4 className="text-md font-semibold text-gray-800 mb-2">Job Skills</h4>
                            <div className="flex flex-row gap-2 flex-wrap">
                              {jobData.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-0.5 rounded-lg text-white text-sm font-medium bg-emerald-400"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications */}
                        {/* {Array.isArray(jobData?.certifications) && jobData.certifications.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-700">Certifications</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                              {jobData.certifications.map((cert, idx) => (
                                <li key={idx}>{cert}</li>
                              ))}
                            </ul>
                          </div>
                        )} */}

                        {/* Languages */}
                        {/* {Array.isArray(jobData?.languages) && jobData.languages.length > 0 && (
                          <div>
                            <h3 className="text-md font-semibold text-gray-700">Languages</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                              {jobData.languages.map((lang, idx) => (
                                <li key={idx}>
                                  {lang.language} – {lang.proficiency}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )} */}
                      </div>
                    </CardContent>



                  </Card>

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


                <div className="grid grid-cols-2 ">
                  {/* Questions */}
                  <div className="p-4 border-r-4 border-b-4 text-center">
                    <div className="text-2xl lg:text-3xl font-medium text-gray-700">{result.totalQuestions}</div>
                    <div className="text-sm text-gray-500 mt-1">Question Answer</div>
                  </div>

                  {/* Duration */}
                  <div className="p-4 border-b-4  text-center">
                    <div className="text-2xl lg:text-3xl font-medium text-gray-700">{result.interview?.duration} Mins</div>
                    <div className="text-sm text-gray-500 mt-1">Duration</div>
                  </div>

                  {/* Avg Score (or Avg Res-time if you want) */}
                  <div className="p-4 border-r-4 text-center">
                    <div className="text-2xl lg:text-3xl font-medium text-gray-700">
                      {result.averageScore?.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Avg Score</div>
                  </div>

                  {/* Completion */}
                  <div className="p-4 text-center">
                    <div className="text-2xl font-semibold text-gray-900">
                      {((result.evaluatedCount / result.totalQuestions) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Completion Rate</div>
                  </div>
                </div>

              </CardContent>

            </Card>

            <Card className={isPass ? "bg-green-50 border border-green-100 shadow-sm" : "bg-red-50 border border-red-100 shadow-sm"}>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <Info className={isPass ? "text-green-600" : "text-red-600"} size={18} />
                  <CardTitle className="text-sm font-medium text-gray-800">Candidate Outcome</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="py-6 text-center space-y-4">
                {/* Pass/Fail */}
                <div className={`text-4xl font-bold flex items-center justify-center gap-2 ${isPass ? "text-green-600" : "text-red-600"}`}>
                  {isPass ? <CheckCircle2 /> : <XCircle />}
                  <span>{result.passStatus || "Unknown"}</span>
                </div>

                {/* Summary Result */}
                {result.summaryResult && (
                  <p className="text-gray-700 text-base flex items-center justify-center gap-2">
                    <Smile className="text-yellow-500" />
                    <span className="font-medium">{result.summaryResult}</span>
                  </p>
                )}

                {/* Knowledge Level */}
                {result.knowledgeLevel && (
                  <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                    <BarChart2 className="text-blue-500" />
                    <span className="font-medium text-gray-700">Knowledge Level:</span>
                    <span>{result.knowledgeLevel}</span>
                  </p>
                )}

                {/* Recommendations */}
                <div className={`rounded-md border px-4 py-3 text-sm ${isPass ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"}`}>
                  {result.recommendations ? (
                    <p>{result.recommendations}</p>
                  ) : (
                    <>
                      <p className="font-medium">No specific recommendations available at this time.</p>
                      <p className="text-gray-600 mt-1">Please consult with the assessment team for detailed feedback.</p>
                    </>
                  )}
                </div>
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
                  {candidateData?.applicationStatus && (
                    <Button
                      variant="outline"
                      onClick={() => handleSendEmail(result.interviewId)}
                      disabled={emailLoading}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {emailLoading ? "Sending..." : "Contact"}
                    </Button>
                  )}


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

"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EvaluationTabs } from "./result-evaluation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import { Info, CheckCircle2, XCircle, Smile, BarChart2 } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchResultByInterviewId } from "@/lib/slices/interview_result/interview-result-slice";
import { useSearchParams } from "next/navigation";

import { ResultDetailHeader } from "./result-details-header";
import { ApplicationStatus } from "@/interface/types/applicationTypes";
import { sendInterviewResultEmail } from "@/lib/slices/interview/sendInterviewResultSlice";
import { toast } from "react-toastify";
import { getInterviewById } from "@/lib/slices/interviews/fetch-interview-slice";
import { PiGraph } from "react-icons/pi";

const CandidateResultPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview_id") || "";
  const [interviewInfo, setInterviewInfo] = useState<any>(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { result, loading, error } = useSelector(
    (state: RootState) => state.interviewResult
  );
  const {
    loading: emailLoading,
    success,
    error: emailError,
  } = useSelector((state: RootState) => state.finalMail);

  const isPass = result?.passStatus?.toLowerCase() === "pass";

  // Show toast on success
  useEffect(() => {
    if (success) {
      toast.success("Email sent successfully!");
    }
  }, [success]);

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchResultByInterviewId(interviewId));
    }
  }, [interviewId, dispatch]);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!result) return;
      setLoadingLocal(true);
      try {
        const res = await dispatch(getInterviewById(interviewId));
        setInterviewInfo(res?.payload || null);
      } catch (err) {
        console.error("Error fetching interview info:", err);
      } finally {
        setLoadingLocal(false);
      }
    };
    fetchInterview();
  }, [result, dispatch]);

  const handleSendEmail = (interviewId: string) => {
    if (!interviewId) return;
    dispatch(sendInterviewResultEmail(interviewId));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Recommended":
        return "secondary";
      case "Highly Recommended":
        return "default";
      case "Under Review":
        return "outline";
      default:
        return "secondary";
    }
  };
  const statusColors: Record<ApplicationStatus, string> = {
    APPLIED: "text-blue-400",
    SCREENING: "text-purple-400",
    INTERVIEW: "text-yellow-400",
    OFFER: "text-green-400",
    HIRED: "text-emerald-400",
    REJECTED: "text-red-400",
  };
  if (loading || loadingLocal)
    return <p className="p-4">Loading evaluation...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!result) return <p className="p-4">No interview result data available</p>;

  console.log("result data", result);
  return (
    <MainLayout>
      <main className="flex-1 overflow-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="container mx-auto space-y-4 ">
          {/* Page Header with Breadcrumbs */}
          <div className="flex items-center justify-between ">
            <div>
              <Button
                variant="ghost"
                className=" p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Results
              </Button>
            </div>
          </div>
          <div className="flex space-x-3">
            <ResultDetailHeader
              interview={interviewInfo}
              applicationId={result?.applicationId}
            />
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <PiGraph className="w-5 h-5 text-sky-600" />
              Score Chart
            </h3>
          </div>

          {/* Interview Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  Performance Summary
                </CardTitle>
                <ChartPie className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Factual Accuracy</span>
                    <span className="font-medium">
                      {result.averageFactualAccuracy.toFixed(2)} / 5
                    </span>
                  </div>
                  <Progress
                    value={(result.averageFactualAccuracy / 5) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Completeness</span>
                    <span className="font-medium">
                      {result.averageCompleteness.toFixed(2)} / 5
                    </span>
                  </div>
                  <Progress
                    value={(result.averageCompleteness / 5) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Relevance</span>
                    <span className="font-medium">
                      {result.averageRelevance.toFixed(2)} / 5
                    </span>
                  </div>
                  <Progress
                    value={(result.averageRelevance / 5) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Coherence</span>
                    <span className="font-medium">
                      {result.averageCoherence.toFixed(2)} / 5
                    </span>
                  </div>
                  <Progress
                    value={(result.averageCoherence / 5) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  Interview Metrics
                </CardTitle>
                <Stopwatch className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 ">
                  {/* Questions */}
                  <div className="p-4 border-r-4 border-b-4 text-center">
                    <div className="text-2xl lg:text-3xl font-medium text-gray-700">
                      {result.totalQuestions}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Question Answer
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="p-4 border-b-4  text-center">
                    <div className="text-2xl lg:text-3xl font-medium text-gray-700">
                      {result.interview?.duration} Mins
                    </div>
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
                      {(
                        (result.evaluatedCount / result.totalQuestions) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Completion Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={
                isPass
                  ? "bg-green-50 border border-green-100 shadow-sm"
                  : "bg-red-50 border border-red-100 shadow-sm"
              }
            >
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <Info
                    className={isPass ? "text-green-600" : "text-red-600"}
                    size={18}
                  />
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Candidate Outcome
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="py-6 text-center space-y-4">
                {/* Pass/Fail */}
                <div
                  className={`text-4xl font-bold flex items-center justify-center gap-2 ${
                    isPass ? "text-green-600" : "text-red-600"
                  }`}
                >
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
                    <span className="font-medium text-gray-700">
                      Knowledge Level:
                    </span>
                    <span>{result.knowledgeLevel}</span>
                  </p>
                )}

                {/* Recommendations */}
                <div
                  className={`rounded-md border px-4 py-3 text-sm ${
                    isPass
                      ? "bg-green-100 border-green-300 text-green-700"
                      : "bg-red-100 border-red-300 text-red-700"
                  }`}
                >
                  {result.recommendations ? (
                    <p>{result.recommendations}</p>
                  ) : (
                    <>
                      <p className="font-medium">
                        No specific recommendations available at this time.
                      </p>
                      <p className="text-gray-600 mt-1">
                        Please consult with the assessment team for detailed
                        feedback.
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Navigation */}
          {result?.evaluations && (
            <EvaluationTabs evaluations={result.evaluations} />
          )}

          {/* Action Panel */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Candidate Actions</h3>
                  <p className="text-muted-foreground mt-1">
                    Take the next steps with this candidate
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                  {interviewInfo && (
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
  );
};

export default CandidateResultPage;

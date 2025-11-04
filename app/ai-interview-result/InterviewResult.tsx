"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { evaluateInterview } from "@/lib/slices/interview_chat/interview-chat-slice";
import { completeInterview } from "@/lib/slices/join_interview/interview-join-slice";
import { useRouter, useSearchParams } from "next/navigation";
import { Hourglass } from "react-loader-spinner";
import PreventBackForward from "@/components/BlockBackForward";
import { fetchResultByInterviewId } from "@/lib/slices/interview_result/interview-result-slice";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

const EvaluationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router=useRouter();

  const interviewId = searchParams.get("interview_id") ?? "";
  const token = searchParams.get("token") ?? "";
  // Evaluate and complete interview
  const { chatHistory, loading: chatHistoryLoading } = useSelector(
    (state: RootState) => state.interviewChat
  );
  const { result, loading, error } = useSelector(
    (state: RootState) => state.interviewResult
  );
  const { interview } = useSelector((state: RootState) => state.joinInterview);
  const { user } = useSelector((state: RootState) => state.auth);

  // Exit fullscreen after finish
  const exitFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  // Prevent double execution in Strict Mode
  const hasEvaluated = React.useRef(false);

  // ✅ Evaluate → Complete → Fetch result
  useEffect(() => {
    if (!interviewId || !token) return;
    if (!interview?.id) return; // wait for interview loaded
    if (!chatHistory || chatHistory.length === 0) return; // wait for answers

    if (hasEvaluated.current) return;
    hasEvaluated.current = true;

    const run = async () => {
      try {
        console.log("✅ Starting evaluation...");

        await dispatch(evaluateInterview({ interviewId, token }) as any);
        //await dispatch(completeInterview({ interviewId, token }) as any);

        // ✅ now fetch result
        if (user?.role === "GUEST") {
          await dispatch(fetchResultByInterviewId(interviewId));
        }

        exitFullscreen();
      } catch (err) {
        console.log("❌ Evaluation error:", err);
      }
    };

    run();
  }, [interviewId, token, interview?.id, chatHistory, user]);

  // UI loaders
  if (chatHistoryLoading)
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="text-center items-center space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Processing your interview result...
          </h2>
          <Hourglass visible height={140} width={140} />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-red-600 font-medium">
        Error: {error}
      </div>
    );

  function setShowTipsModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen  bg-gray-100">
      <PreventBackForward />
      <header className="fixed flex w-full rounded-lg bg-cyan-50 border-b border-gray-200  top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo/company-logo.png"
                alt="Company Logo"
                className="w-28"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTipsModal(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Quick Tips
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>
        {/* ✅ Non Guest UI */}
        {user?.role !== "GUEST" && (
          <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center space-y-3 max-w-3xl px-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                🎉 Interview Completed!
              </h1>

              <p className="text-gray-600 text-lg">
                Thank you for completing your AI-based interview.
              </p>

              <p className="text-gray-600">
                Our system is currently reviewing your responses. Once the
                evaluation is complete, your detailed results will be shared
                with you via email.
              </p>

              <p className="text-blue-600 font-medium">
                Please check your inbox shortly.
              </p>

              <div className="mt-4 text-sm text-gray-500">
                If you have any questions, feel free to contact our support
                team.
              </div>
            </div>
          </div>
        )}

        {/* ✅ Guest UI - Result Page */}
        {user?.role === "GUEST" && result && (
          <>
          <div className="max-w-4xl mx-auto space-y-6">
            {/* ✅ Summary Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Interview Result
                </h2>
                <p className="text-sm text-gray-500">
                  Interview ID: {result.interviewId}
                </p>

                <div className="text-lg font-semibold">
                  Final Status:{" "}
                  <span
                    className={
                      result.passStatus === "pass"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {result.passStatus.toUpperCase()}
                  </span>
                </div>

                <p className="font-medium text-gray-700">
                  {result.summaryResult}
                </p>

                {/* ✅ Score Bar */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Overall Score: {result.averageScore.toFixed(1)}/5
                  </p>
                  <Progress value={result.averageScore * 20} />
                </div>

                {/* ✅ Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center pt-4">
                  {[
                    ["Factual Accuracy", result.averageFactualAccuracy],
                    ["Completeness", result.averageCompleteness],
                    ["Relevance", result.averageRelevance],
                    ["Coherence", result.averageCoherence],
                    ["Questions", result.evaluatedCount],
                  ].map(([label, value], i) => (
                    <div key={i} className="border p-3 rounded-lg bg-gray-50">
                      <p className="text-xl font-bold text-sky-600">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ✅ Detailed Breakdown */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Detailed Evaluation</h3>

                <Accordion type="single" collapsible>
                  {result.evaluations.map((item: any, index: number) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="font-medium text-left">
                        Q{index + 1}. {item.questionText}
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="font-semibold">Answer:</span>{" "}
                            {item.answerText}
                          </p>

                          <div className="text-sm grid grid-cols-2 md:grid-cols-4 gap-2">
                            <p>
                              <b>Accuracy:</b> {item.evaluation.factualAccuracy}
                            </p>
                            <p>
                              <b>Completeness:</b>{" "}
                              {item.evaluation.completeness}
                            </p>
                            <p>
                              <b>Relevance:</b> {item.evaluation.relevance}
                            </p>
                            <p>
                              <b>Coherence:</b> {item.evaluation.coherence}
                            </p>
                          </div>

                          <p className="text-sm">
                            <b>Score:</b> {item.evaluation.score}/5
                          </p>
                          <p className="text-xs text-gray-600 italic">
                            {item.evaluation.finalEvaluation}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
                {/* ✅ Try Again Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/")}
              className="text-sky-600 font-semibold underline hover:text-sky-800 transition"
            >
              Try Again
            </button>
          </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EvaluationPage;

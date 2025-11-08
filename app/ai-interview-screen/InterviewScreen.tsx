"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { ShowTimer } from "@/components/interview/ShowTimer";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Checklist from "@/components/interview/Checklist";
import InterviewChatPage from "@/components/interview/AiChat";
import VideoInterfacePage from "@/components/interview/videoInterface";
import "react-toastify/dist/ReactToastify.css";


import { Lightbulb } from "lucide-react";
import { startInterview } from "@/lib/slices/join_interview/interview-join-slice";
import PreventBackForward from "@/components/BlockBackForward";

const InterviewScreenPage = () => {
  const dispatch = useDispatch<AppDispatch>();
 
  const searchParams = useSearchParams();

  const interviewId = searchParams.get("interview_id") || "";
  const token = searchParams.get("token") || "";

  // -----------------------------
  // Hooks: state, refs, selectors
  // -----------------------------

  const fetched = useRef(false);
 
  
  const [faceDetectionResults, setFaceDetectionResults] = useState({
    faceVerified: false,
    multiplePeopleDetected: false,
  });
  const [permissions, setPermissions] = useState({
    camera: true,
    microphone: true,
    devToolsOpen: false,
    fullscreen: false,
    tabActive: true,
  });

  const {
    interview,
    loading: interviewLoading,
    error: interviewError,
    confirmationMessage,
    status,
  } = useSelector((state: RootState) => state.joinInterview);

  // -----------------------------
  // Callbacks
  // -----------------------------
  const checkFullscreenStatus = useCallback(() => {
    setPermissions((prev) => ({ ...prev, fullscreen: !!document.fullscreenElement }));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    setPermissions((prev) => ({ ...prev, tabActive: document.visibilityState === "visible" }));
  }, []);

  const detectDevToolsOpen = useCallback(() => {
    const threshold = 100;
    const devToolsOpen = window.outerWidth - window.innerWidth > threshold;
    setPermissions((prev) => ({ ...prev, devToolsOpen }));
  }, []);
 
  // -----------------------------
  // Effects
  // -----------------------------
  // Fetch interview details once
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    if (interviewId && token) {
      console.log("✅ Dispatching startInterview");
      dispatch(startInterview({ interviewId, token }));
    }
  }, [dispatch, interviewId, token]);

  // Permissions listeners
  useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreenStatus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", detectDevToolsOpen);
    checkFullscreenStatus();
    handleVisibilityChange();
    detectDevToolsOpen();
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreenStatus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", detectDevToolsOpen);
    };
  }, [checkFullscreenStatus, handleVisibilityChange, detectDevToolsOpen]);



  // -----------------------------
  // Memoized values
  // -----------------------------
  const isDataReady = useMemo(() => {
    return !interviewLoading && interview && Object.keys(interview).length > 0;
  }, [interviewLoading, interview]);

  const candidateData = useMemo(() => {
    if (!interview) return null;
    return {
      candidateId: interview.candidateId,
      name: interview.candidateName,
      email: interview.candidateEmail,
      education: interview.candidateEducation,
      experience: interview.candidateExperience,
      skills: interview.candidateSkills,
      linkedIn: interview.candidateLinkedIn,
      github: interview.candidateGitHub,
      location: interview.candidateLocation,
    };
  }, [interview]);

  const jobData = useMemo(() => {
    if (!interview) return null;
    return {
      jobId: interview.jobId,
      title: interview.jobTitle,
      description: interview.jobDescription,
      skills: interview.jobSkills,
      education: interview.jobEducation,
      responsibilities: interview.jobResponsibility,
      certificates: interview.jobCertificates,
      department: interview.jobDepartment,
      publishedAt: interview.jobPublished,
    };
  }, [interview]);

  function setShowTipsModal(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  // -----------------------------
  // Early returns (after all hooks)
  // -----------------------------
  if (status === "COMPLETED") return <p className="p-6 text-blue-600">Exam Ending...</p>;
  if (interviewLoading) return <p className="p-6">Loading interview...</p>;
  if (interviewError) return <p className="p-6 text-red-500">Error: {interviewError}</p>;
  if (!interview) return <p className="p-6">No interview found.</p>;
  if (!isDataReady)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading interview data...</p>
      </div>
    );

  // -----------------------------
  // Render JSX
  // 
  return (
    <div className="">
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
      <main className="container mx-auto py-4 px-4 space-y-4  pt-20 rounded-lg">
        <section className="flex items-center justify-end gap-6">
          <div className="flex justify-center items-center">
   <div className="flex justify-between items-center px-6 py-4 bg-sky-300 rounded-lg shadow-xl text-white text-sm sm:text-base font-medium">
              <div className="flex flex-col  items-center">
                <p>Status</p>
                <p>
                  <span className="font-bold text-yellow-300">
                    {interview.status}
                  </span>
                </p>
              </div>
            </div> 
          </div>
         
            <div>
              <ShowTimer duration={interview.duration}/>
            </div>
        </section>
        <section >
              <div >
             <VideoInterfacePage
                permissions={permissions}
                setPermissions={setPermissions}
                faceDetectionResults={faceDetectionResults}
                setFaceDetectionResults={setFaceDetectionResults}
                examStatus={status}
              />
            </div>
          <div>
            <InterviewChatPage
              interviewId={interview.id}
              candidate={candidateData}
              token={token}
              candidateId={interview.candidateId}
              applicationId={interview.applicationId}
              job={jobData}
            />
          </div>
          <div className="max-md:hidden">
            <Checklist permissions={permissions} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewScreenPage;

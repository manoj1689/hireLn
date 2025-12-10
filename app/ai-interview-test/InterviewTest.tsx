"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, Brain, Play, Shield, Lightbulb, Info } from "lucide-react";
import InstructionPage from "@/components/interview/BrowserInstructions";
import Checklist from "@/components/interview/Checklist";
import { FiCamera } from "react-icons/fi";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import dayjs from "dayjs";
import VideoInterfacePage from "@/components/interview/videoInterface";
import InterviewCard from "./interviewDetails";
import {
  cancelInterview,
  confirmInterview,
  startInterview,
} from "@/lib/slices/join_interview/interview-join-slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreventBackForward from "@/components/BlockBackForward";
import { DNA } from "react-loader-spinner";
import { PiBuildingOffice } from "react-icons/pi";
const tips = [
  {
    icon: Lightbulb,
    title: "Be Confident",
    description: "Confidence in your answers shows clarity and preparation.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Mic,
    title: "Speak Clearly",
    description: "Use a moderate pace and pronounce words clearly.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: FiCamera,
    title: "Maintain Eye Contact",
    description: "Look into the camera for better engagement.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

export default function InterviewConfirmation() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interview_id") || "";
  const token = searchParams.get("token") || "";

  const [consentChecked, setConsentChecked] = useState(false);
  const [showReadyModal, setShowReadyModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
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
  const [joining, setJoining] = useState(false);

  const { interview, loading, error, confirmationMessage, status } =
    useSelector((state: RootState) => state.joinInterview);

  // ✅ Prevent duplicate fetching due to React Strict Mode
  const fetched = useRef(false);

  // ---- 1️⃣ Fetch interview details ----
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    if (interviewId && token) {
      dispatch(confirmInterview({ interviewId, token }));
    }
  }, [dispatch, interviewId, token]);

  const handleStartInterview = async () => {
    const allOk =
      permissions.camera &&
      permissions.microphone &&
      !permissions.devToolsOpen &&
      permissions.fullscreen;

    if (allOk && status === "CONFIRMED" && interview.status !== "IN_PROGRESS") {
      setJoining(true);
      try {
        router.push(
          `/ai-interview-screen?interview_id=${interview?.id}&token=${token}`
        );
      } catch (err) {
        setJoining(false);
        console.error("Failed to start interview:", err);
      }
    } else {
      setShowReadyModal(true);
    }
  };
  const handleCancelInterview = () => {
    if (interview?.id) {
      dispatch(
        cancelInterview({
          interviewId: interview.id,
          token,
        })
      );
    }
    router.push("/");
  };
  const checkFullscreenStatus = useCallback(() => {
    setPermissions((prev) => ({
      ...prev,
      fullscreen: !!document.fullscreenElement,
    }));
  }, []);

  const handleVisibilityChange = useCallback(() => {
    setPermissions((prev) => ({
      ...prev,
      tabActive: document.visibilityState === "visible",
    }));
  }, []);

  const detectDevToolsOpen = useCallback(() => {
    const threshold = 100;
    const devToolsOpen = window.outerWidth - window.innerWidth > threshold;
    setPermissions((prev) => ({ ...prev, devToolsOpen }));
  }, []);

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
  }, [checkFullscreenStatus, detectDevToolsOpen, handleVisibilityChange]);

  const scheduledTime =
    interview?.scheduledAt && !isNaN(new Date(interview.scheduledAt).getTime())
      ? new Date(interview.scheduledAt).toLocaleString("en-IN", {
          timeZone: interview?.timezone || "Asia/Kolkata",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not Scheduled";

  if (!interview || loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading interview...</div>
    );
  }
  return (
    <div className="">
      {/* <PreventBackForward /> */}

      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Interview Tips
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <Card key={index} className={`${tip.bg} border`}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <tip.icon className={`w-6 h-6 ${tip.color}`} />
                  <h3 className="font-semibold">{tip.title}</h3>
                  <p className="text-sm">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {joining ? (
        <div className="flex items-center justify-center h-screen ">
          <div className="flex flex-col w-full gap-8">
            <div className="flex w-full justify-center">
              <DNA
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
            <div className="flex justify-center text-lg lg:text-2xl font-semibold text-stone-600">
              Joining Interview ....
            </div>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <header className="flex  w-full  rounded-lg bg-cyan-50 border-b border-gray-200 fixed top-0 z-50">
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
          <main className="container mx-auto py-4 px-4 space-y-4  mt-24 rounded-lg">
            <div className="flex w-full">
              <div className="bg-gradient-to-r from-sky-400 to-pink-400 w-full p-4 rounded-lg shadow-lg flex items-center justify-between">
                {/* Left Section - Icon and Headings */}
                <div className="flex items-start space-x-3">
                  <Info className="text-white w-8 h-8 mt-1" />
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-white">
                      Interview Briefing
                    </span>
                    <span className="text-lg text-blue-100 font-light">
                      Please read all guidelines carefully before starting
                    </span>
                  </div>
                </div>

                {/* Right Section - Status */}
                <div className="flex flex-col items-end">
                  <span className="text-sm text-white font-semibold uppercase tracking-wide">
                    Status
                  </span>
                  <span className="text-xl font-bold text-yellow-300">
                    {interview.status}
                  </span>
                </div>
              </div>
            </div>

            <VideoInterfacePage
              permissions={permissions}
              setPermissions={setPermissions}
              faceDetectionResults={faceDetectionResults}
              setFaceDetectionResults={setFaceDetectionResults}
              examStatus={false}
              interviewId={interviewId}
              token={token}
            />
            <section className="flex flex-col max-w-4xl mx-auto  gap-4 h-auto   ">
              <div className="flex flex-col    space-y-4 justify-between items-center   px-4 ">
                <div>
                  <InterviewCard />
                </div>
                <div className="w-full  space-y-4">
                  <InstructionPage />
                  <div className="max-md:hidden">
                    <Checklist permissions={permissions} />
                  </div>
                </div>
                <Card className="w-full px-4 ">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" /> Privacy &
                      Consent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3 ">
                      <Checkbox
                        id="consent"
                        checked={consentChecked}
                        onCheckedChange={setConsentChecked}
                        className="mt-1"
                      />
                      <label
                        htmlFor="consent"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        I understand and agree to the recording of this
                        interview session for evaluation purposes.
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <div className="flex flex-col md:flex-row w-full justify-center mt-6 gap-4">
              {/* Confirm Button */}
              <button
                className="flex items-center px-10 py-3 rounded-xl text-white font-medium 
               bg-gradient-to-r from-sky-300 to-sky-400 
               hover:from-sky-500 hover:to-sky-600 
               shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleStartInterview}
                disabled={!consentChecked}
              >
                <Play className="w-5 h-5 mr-2" /> Join Interview
              </button>

              {/* Cancel Button */}
              <button
                className="px-10 py-3 rounded-xl font-medium 
               bg-white text-red-600 border border-red-300 
               hover:bg-red-50 hover:border-red-400 
               shadow-sm hover:shadow-md transition-all duration-300"
                onClick={handleCancelInterview}
              >
                Cancel Interview
              </button>
            </div>
          </main>
          <Dialog open={showReadyModal} onOpenChange={setShowReadyModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600">
                  Permissions Required
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  You're missing some required permissions to start the
                  interview:
                </p>
                <ul className="list-disc list-inside text-red-600">
                  {!permissions.camera && <li>Camera access is required</li>}
                  {!permissions.microphone && (
                    <li>Microphone access is required</li>
                  )}
                  {permissions.devToolsOpen && <li>Close developer tools</li>}
                  {!permissions.fullscreen && (
                    <li>Please enable fullscreen mode</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={() => setShowReadyModal(false)}>OK</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

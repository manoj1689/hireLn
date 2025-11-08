"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/lib/store";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { fetchCandidateById } from "@/lib/slices/candidate/candidate-slice";
import { fetchApplications } from "@/lib/slices/applicant/getapplications-slice";
import { postApplication } from "@/lib/slices/applicant/application-slice";
import { scheduleInterview } from "@/lib/slices/interview/scheduleInterviewSlice";
import { logout } from "@/lib/slices/auth-slice";
import { Loader2, Briefcase, User, Clock } from "lucide-react";
import { FaSignOutAlt } from "react-icons/fa";

const GuestInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get("job_id");
  const candidateId = searchParams.get("candidate_id");

  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");

  const applications = useSelector(
    (state: RootState) => state.getApplication.data
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const alreadyApplied = applications?.some(
    (app: any) => app.jobId === jobId && app.candidateId === candidateId
  );

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      if (candidateId) {
        const candRes = await dispatch(fetchCandidateById(candidateId));
        setCandidateData(candRes.payload);
        await dispatch(fetchApplications({ candidate_id: candidateId }));
      }
      setLoading(false);
    };
    load();
  }, [jobId, candidateId, dispatch]);

  const handleApplyAndStart = async () => {
    if (!candidateData) return;

    const appRes: any = await dispatch(
      postApplication({
        jobId: jobId || "",
        candidateId: candidateData.id,
        coverLetter:
          coverLetter ||
          `Hello,

I am excited to apply and participate in this interview for this role.
Looking forward to demonstrating my skills.

Thank you,
${candidateData?.name}`,
        appliedAt: new Date().toISOString(),
        isGuest: true,
        userId: user?.id || "",
      })
    ).unwrap();

    const applicationId = appRes?.id;

    const interviewRes: any = await dispatch(
      scheduleInterview({
        candidateId,
        applicationId,
        type: "VIDEO",
        scheduledDate: currentDate,
        scheduledTime: currentTime,
        duration: 30,
        timezone: "Asia/Kolkata",
        location: "Online",
        notes: "Guest interview",
        sendCalendarInvite: false,
        sendEmailNotification: false,
        interviewers: [
          {
            name: "Smart Grader AI",
            email: "bot@smartgrader.com",
            role: "AI Interviewer",
          },
        ],
        isGuest: true,
      })
    ).unwrap();

    const interviewId = interviewRes?.id;
    const joinToken = interviewRes?.joinToken;

    router.push(
      `/ai-interview-round?interview_id=${interviewId}&token=${joinToken}`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60 text-sky-600">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }
  const handleLogout = () => {
    dispatch(logout())
    router.push("/")
  }
  return (
    <div>
      {/* Header */}
      <header className="w-full container mx-auto flex justify-between items-center p-4">
        <div className="lg:w-1/4 px-4">
          <img
            src="/images/logo/company-logo.png"
            alt="Company Logo"
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:scale-105 transition-all" onClick={handleLogout}>
            <FaSignOutAlt size={25} className="text-gray-500" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main>
        <div className="max-w-5xl mx-auto p-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-sky-400 text-transparent bg-clip-text">
            Welcome to Your Interview!
          </h2>

          <p className="text-lg lg:text-xl text-gray-600 mb-8">
            Hi <span className="font-semibold">{candidateData?.name}</span>,
            you're about to begin your interview conducted by Smart Grader AI 🤖
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card - React Calendar */}
            <div className="rounded-2xl bg-white shadow-lg p-6 border border-sky-100">
              <h3 className="text-xl font-semibold text-sky-700 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-500" /> Interview Date & Time
              </h3>

              <div className="flex flex-col items-center">
                <Calendar
                  calendarType="gregory"
                  value={new Date()}
                  className="rounded-xl  border-sky-100 py-4 shadow-sm"
                  tileClassName={({ date }) =>
                    date.toDateString() === new Date().toDateString()
                      ? "bg-sky-500 text-white rounded-full"
                      : ""
                  }
                />

                {/* Today Section */}
                <div className="mt-6 bg-sky-50 rounded-xl p-4 text-center w-full">
                  <div className="text-2xl font-bold text-gray-800">
                    {currentDate}
                  </div>
                  <div className="text-gray-500 text-md">📅 Today</div>

                  <div className="mt-4">
                    <div className="text-xl font-bold text-gray-800">
                      {currentTime}
                    </div>
                    <div className="text-md text-gray-500">⏰ Current Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="rounded-2xl bg-white shadow-lg p-6 border border-sky-100">
              <h3 className="text-xl font-semibold text-sky-700 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-500" /> Interview
                Application
              </h3>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">
                    Candidate: <strong>{candidateData?.name}</strong>
                  </span>
                </div>
              </div>

              <label className="block text-left text-gray-700 font-medium mb-2">
                Cover Letter (Optional)
              </label>

              <textarea
                className="w-full h-48 border border-sky-100 rounded-xl p-3 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300"
                defaultValue={`Hello,

                              I am excited to apply for this role.
                              Looking forward to this interview opportunity!

                              Thank you,
                              ${candidateData?.name}`}
                onChange={(e) => setCoverLetter(e.target.value)}
              ></textarea>

              <p className="text-xs text-gray-400 mt-1 text-left">
                Modify before starting the interview
              </p>
            </div>
          </div>

          {/* Start Button */}
          <button
            disabled={alreadyApplied}
            onClick={handleApplyAndStart}
            className={`mt-8 w-full py-3 rounded-xl font-medium transition-all ${
              alreadyApplied
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-200"
            }`}
          >
            {alreadyApplied ? "✅ Already Applied" : "🚀 Start Interview"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default GuestInfo;

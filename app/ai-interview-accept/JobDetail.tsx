"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import { fetchJobById } from "@/lib/slices/job/jobsList-slice";
import {
  acceptApplication,
  getApplication,
} from "@/lib/slices/applicant/application-slice";
import { AppDispatch } from "@/lib/store";
import {
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiXCircle,
  FiAward,
  FiStar,
} from "react-icons/fi";
// React Icons
import { FiMapPin } from "react-icons/fi";
import { FaMoneyBillWave, FaGraduationCap, FaBuilding } from "react-icons/fa";

export default function JobDetailsPage() {
  const [jobData, setJobData] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const applicationId = searchParams.get("application_id") || "";
  const jobId = searchParams.get("job_id") || "";
  const token = searchParams.get("token") || "";

  // Fetch job data
  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById({ jobId, token })).then((data) => setJobData(data.payload));
    }
  }, [jobId, dispatch]);

  // Fetch application data
  const fetchApplication = () => {
    if (applicationId) {
      dispatch(getApplication({ applicationId, token })).then((res: any) =>
        setApplicationData(res.payload)
      );
    }
  };
  console.log("jobData",jobData)
  useEffect(() => {
    fetchApplication();
  }, [applicationId, dispatch, token]);

  const handleAccept = () => {
    if (!applicationId) return;
    dispatch(acceptApplication({ applicationId, token })).then(() =>
      fetchApplication()
    ); // Refresh status after accepting
  };

  if (!jobData || !applicationData) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  const status = applicationData.status;

  // Handle non-invited statuses
  if (status !== "INVITED") {
    let statusContent = {
      message: "",
      icon: null,
      color: "",
    };

    switch (status) {
      case "APPLIED":
        statusContent = {
          message: "Thank you for applying! We’ve received your application.",
          icon: <FiCheckCircle className="text-blue-600 w-6 h-6" />,
          color: "bg-blue-50 text-blue-700",
        };

        break;
      case "SCREENING":
        statusContent = {
          message: "Your application is under screening.",
          icon: <FiClock className="text-yellow-500 w-6 h-6" />,
          color: "bg-yellow-50 text-yellow-700",
        };
        break;
      case "INTERVIEW":
        statusContent = {
          message: "You are scheduled for an interview.",
          icon: <FiUserCheck className="text-purple-600 w-6 h-6" />,
          color: "bg-purple-50 text-purple-700",
        };
        break;
      case "OFFER":
        statusContent = {
          message: "You have received an offer!",
          icon: <FiAward className="text-green-600 w-6 h-6" />,
          color: "bg-green-50 text-green-700",
        };
        break;
      case "HIRED":
        statusContent = {
          message: "Congratulations! You are hired.",
          icon: <FiStar className="text-green-800 w-6 h-6" />,
          color: "bg-green-100 text-green-800",
        };
        break;
      case "REJECTED":
        statusContent = {
          message: "We are sorry, your application was rejected.",
          icon: <FiXCircle className="text-red-600 w-6 h-6" />,
          color: "bg-red-50 text-red-700",
        };
        break;
      default:
        statusContent = {
          message: "Status unknown",
          icon: <FiXCircle className="text-gray-500 w-6 h-6" />,
          color: "bg-gray-50 text-gray-700",
        };
        break;
    }

    return (
      <div
        className={`container mx-auto p-6 mt-10 flex flex-col items-center justify-center rounded-2xl shadow-md ${statusContent.color} max-w-2xl`}
      >
        <div className="flex items-center gap-4">
          {statusContent.icon}
          <p className="text-lg font-semibold">{statusContent.message}</p>
        </div>
      </div>
    );
  }
  // If INVITED, show the full UI (your existing code)
  return (
    <div className="container mx-auto p-6 mt-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex-1 space-y-4">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-pink-400 to-sky-400 text-white rounded-2xl shadow-lg p-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {jobData.title}
              </h1>
              <p className="mt-2 text-sm flex flex-col lg:flex-row gap-2 lg:gap-4 opacity-90">
                <span className="flex items-center gap-1">
                  <FiMapPin /> {jobData.location}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock /> {jobData.experience}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl lg:text-2xl font-bold flex items-center gap-2 justify-end">
                <FaMoneyBillWave /> ₹{jobData.salaryMin} - ₹
                {jobData.salaryMax}
              </p>
              <p className="text-sm opacity-80">per {jobData.salaryPeriod}</p>
              <span className="bg-green-500 text-white text-xs px-3 py-1 mt-2 inline-block rounded-full">
                {jobData.employmentType === "FULL_TIME"
                  ? "Full Time"
                  : jobData.employmentType}
              </span>
            </div>
          </div>

          {/* Education */}
          <div className="bg-blue-50 text-blue-800 py-2 px-4 rounded-md font-semibold flex items-center gap-2 shadow-sm">
            <FaGraduationCap /> {jobData.education}
          </div>

          {/* Description + Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-700 mb-4 leading-relaxed">
              {jobData.description}
            </p>

            {/* Tabs */}
            <div className="border-b flex gap-6 mb-4">
              {["overview", "responsibilities", "requirements", "skills"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Job Overview</h3>
                <p className="text-gray-700">{jobData.description}</p>
              </div>
            )}

            {activeTab === "responsibilities" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Key Responsibilities
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {jobData.responsibilities.map((res: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FiCheckCircle className="text-blue-600 mt-1" /> {res}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {jobData.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <FiCheckCircle className="text-indigo-600 mt-1" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-md border">
                  <h5 className="text-red-600 font-semibold mb-2">
                    Technical Skills
                  </h5>
                  <ul className="list-disc list-inside text-sm">
                    {jobData.skills.map((skill: string, idx: number) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-md border">
                  <h5 className="text-green-600 font-semibold mb-2">
                    Soft Skills
                  </h5>
                  <ul className="list-disc list-inside text-sm">
                    {jobData.softSkills.map((skill: string, idx: number) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border">
                  <h5 className="text-blue-600 font-semibold mb-2">
                    Certifications
                  </h5>
                  <ul className="list-disc list-inside text-sm">
                    {jobData.certifications.map((cert: string, idx: number) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Languages */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <ul className="list-disc list-inside text-sm">
                {jobData.languages.map(
                  (
                    lang: { language: string; proficiency: string },
                    idx: number
                  ) => (
                    <li key={idx}>
                      {lang.language} ({lang.proficiency})
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
          {/* Job Details Card */}
          <div className="bg-gradient-to-r from-pink-400 to-sky-400 text-white rounded-2xl p-5 shadow-lg">
            <h4 className="font-semibold mb-3">Job Details</h4>
            <p>
              <strong>Department:</strong> {jobData.department}
            </p>
            <p>
              <strong>Employment Type:</strong> {jobData.employmentType}
            </p>
            <p>
              <strong>Remote:</strong> {jobData.isRemote ? "Yes" : "No"}
            </p>
            <p>
              <strong>Hybrid:</strong> {jobData.isHybrid ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  jobData.status === "ACTIVE"
                    ? "text-green-200"
                    : "text-red-200"
                }`}
              >
                {jobData.status}
              </span>
            </p>
          </div>

          {/* Apply Box */}
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h4 className="text-xl font-semibold mb-2">Excited to Join Us?</h4>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Take the next step in your career and apply for the{" "}
              <span className="font-medium text-blue-600">{jobData.title}</span>{" "}
              role. Be part of a team that’s shaping the future of technology.
            </p>
            <button
              onClick={handleAccept}
              className="bg-gradient-to-r from-pink-500 to-sky-500 hover:scale-105 transition-transform duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-md"
            >
              Apply Now
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Your application is secure & confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

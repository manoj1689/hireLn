"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { updateApplication } from "@/lib/slices/applicant/application-slice";
import { ApplicationStatus } from "@/interface/types/applicationTypes";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Briefcase,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Download,
  Users,
  Globe,
} from "lucide-react";

interface Interviewer {
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  interviewType: string;
  status: InterviewStatus;
  scheduledAt: string;
  duration: number;
  timezone: string;
  interviewers: Interviewer[];
  notes: string;
  invitationSent: boolean;
}

interface ResultDetailHeaderProps {
  interview: Interview;
  onExport?: () => void;
}

type InterviewStatus =
  | "NOT SCHEDULED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

const interviewStatusStyles: Record<InterviewStatus, string> = {
  "NOT SCHEDULED": "bg-gray-100 text-gray-700 border border-gray-300",
  SCHEDULED: "bg-blue-50 text-blue-700 border border-blue-200",
  CONFIRMED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  IN_PROGRESS: "bg-yellow-50 text-yellow-800 border border-yellow-200",
  COMPLETED: "bg-green-50 text-green-700 border border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
  NO_SHOW: "bg-orange-50 text-orange-700 border border-orange-200",
  RESCHEDULED: "bg-purple-50 text-purple-700 border border-purple-200",
};

const nextStatusOptions: ApplicationStatus[] = [
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
];

export function ResultDetailHeader({
  interview,
  onExport,
}: ResultDetailHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">(
    ""
  );

  if (!interview) return null;

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    dispatch(
      updateApplication({
        applicationId: interview.applicationId,
        updateData: { status: newStatus, notes: "", matchScore: 0 },
      })
    );
    setSelectedStatus("");
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="relative bg-gradient-to-r from-sky-400 to-pink-400 p-6 rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-5 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Candidate Interview Summary
            </h1>
            <p className="text-sky-100 text-sm mt-1">
              Review and insights from the completed AI-powered interview.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <span
              className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                interviewStatusStyles[interview.status]
              }`}
            >
              {interview.status}
            </span>

            {interview.status === "COMPLETED" && (
              <select
                value={selectedStatus}
                onChange={(e) => {
                  const value = e.target.value as ApplicationStatus;
                  setSelectedStatus(value);
                  handleStatusChange(value);
                }}
                className="border border-white/30 text-sm bg-white/10 backdrop-blur-md text-white rounded-full px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Update Status</option>
                {nextStatusOptions.map((status) => (
                  <option key={status} value={status} className="text-gray-800">
                    {status}
                  </option>
                ))}
              </select>
            )}

            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full shadow hover:bg-white/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* INTERVIEW DETAILS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-600" />
          Interview Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-gray-800">
          <InfoRow
            icon={<User className="text-sky-600" />}
            label="Candidate"
            value={interview.candidateName}
          />
          <InfoRow
            icon={<Mail className="text-sky-600" />}
            label="Email"
            value={interview.candidateEmail}
          />
          <InfoRow
            icon={<Briefcase className="text-sky-600" />}
            label="Job Title"
            value={interview.jobTitle}
          />
          <InfoRow
            icon={<Video className="text-sky-600" />}
            label="Interview Type"
            value={interview.interviewType}
          />
          <InfoRow
            icon={<Calendar className="text-sky-600" />}
            label="Scheduled Date"
            value={new Date(interview.scheduledAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
              timeZone: interview.timezone,
            })}
          />
          <InfoRow
            icon={<Clock className="text-sky-600" />}
            label="Duration"
            value={`${interview.duration} mins`}
          />
          <InfoRow
            icon={<Globe className="text-sky-600" />}
            label="Timezone"
            value={interview.timezone}
          />
          <InfoRow
            icon={
              interview.invitationSent ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <XCircle className="text-red-600" />
              )
            }
            label="Invitation Sent"
            value={interview.invitationSent ? "Yes" : "No"}
            valueClass={
              interview.invitationSent ? "text-green-700" : "text-red-700"
            }
          />
        </div>

        {/* Notes */}
        {interview.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-sky-600" /> Notes
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {interview.notes}
            </p>
          </div>
        )}
      </div>

      {/* INTERVIEWERS */}
      {interview.interviewers?.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            Interviewers
          </h3>
          <ul className="mt-2 space-y-1 text-gray-700 text-sm">
            {interview.interviewers.map((i, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-medium">{i.name}</span>
                <span className="text-gray-500">({i.email})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ✅ Subcomponent for Info Item */
function InfoRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="w-12 h-12 flex items-center justify-center text-sky-600">
        {icon }
      </div>
      <div className="flex flex-col">
        <span className="text-md uppercase text-sky-500 font-normal ">
          {label}
        </span>
        <span
          className={`text-sm font-light ${valueClass || "text-neutral-600"}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CandidateProps {
  name: string;
  location: string;
  education: string;
  experience: string;
  appliedAt: string;
  aiMatch: number;
  applicationStatus: "NEW" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "HIRED" | "REJECTED";
  interviewStatus:
    | "NOT SCHEDULED"
    | "SCHEDULED"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW"
    | "RESCHEDULED";
  phone: string;
  skills: string[];
  avatarUrl?: string;
}

export const CandidateCard = ({
  name,
  location,
  experience,
  appliedAt,
  aiMatch,
  education,
  applicationStatus,
  interviewStatus,
  phone,
  skills,
  avatarUrl,
}: CandidateProps) => {
  const applicationStatusStyles: Record<CandidateProps["applicationStatus"], string> = {
    NEW: "bg-gray-100 text-gray-700",
    APPLIED: "bg-blue-100 text-blue-700",
    SCREENING: "bg-yellow-100 text-yellow-800",
    INTERVIEW: "bg-purple-100 text-purple-700",
    OFFER: "bg-green-100 text-green-700",
    HIRED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  const interviewStatusStyles: Record<CandidateProps["interviewStatus"], string> = {
    "NOT SCHEDULED": "bg-gray-200 text-gray-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    CONFIRMED: "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
    RESCHEDULED: "bg-purple-100 text-purple-700",
  };

  return (
    <Card className="flex flex-col p-4 mb-4 shadow-lg bg-white rounded-md">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex flex-col gap-2">
          {/* Avatar and Name */}
          <div className="flex gap-2">
            <img
              src={avatarUrl || "/default-avatar.png"}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
        </div>

        {/* Skills and Phone */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            <strong>Skills:</strong> {skills.join(", ")}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Phone:</strong> {phone}
          </p>
        </div>

        {/* Application Status */}
        <div className="flex items-start justify-end">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${applicationStatusStyles[applicationStatus]}`}>
            {applicationStatus}
          </span>
        </div>
      </div>

      {/* Education */}
      <div className="py-2 text-sm text-[#19b3a3]">{education}</div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        {/* Match and Experience */}
        <div className="flex w-full md:w-5/6 items-center justify-between">
          <div className="text-center">
            <p className="text-sm font-medium text-green-600">
              {aiMatch}% <span className="text-gray-500">AI match</span>
            </p>
            <div className="w-full h-1 bg-gray-200 rounded mt-1 overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${aiMatch}%` }} />
            </div>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm text-gray-600">{experience} experience</p>
          </div>
        </div>

        {/* Interview Status Badge */}
        <div className="w-full md:w-1/6 flex items-center justify-end">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${interviewStatusStyles[interviewStatus]}`}>
            {interviewStatus}
          </span>
        </div>
      </div>
    </Card>
  );
};

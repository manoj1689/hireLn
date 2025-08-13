// icons.ts or inside your component file

import {
  Briefcase,
  UserPlus,
  ClipboardCheck,
  CalendarCheck,
  MessageCircle,
  Settings,
  Building2,
  Brain,
  FileText,
} from "lucide-react"
import { JSX } from "react"

const iconWrapper = (icon: JSX.Element, bg: string ) => (
  <div className={`p-2 rounded-xl ${bg} `}>{icon}</div>
)

export const activityTypeIconMap: Record<string, JSX.Element> = {
  // Job-related (blue)
  JOB_CREATED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_PUBLISHED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_UPDATED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_CLOSED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_PAUSED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_REACTIVATED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),
  JOB_DELETED: iconWrapper(<Briefcase size={20} />, "bg-blue-100 text-blue-400"),

  // Application-related (green)
  APPLICATION_RECEIVED: iconWrapper(<ClipboardCheck size={20} />, "bg-green-100 text-green-400"),
  APPLICATION_REVIEWED: iconWrapper(<ClipboardCheck size={20} />, "bg-green-100 text-green-400"),
  APPLICATION_SHORTLISTED: iconWrapper(<ClipboardCheck size={20} />, "bg-green-100 text-green-400"),
  APPLICATION_REJECTED: iconWrapper(<ClipboardCheck size={20} />, "bg-green-100 text-green-400"),
  APPLICATION_STATUS_CHANGED: iconWrapper(<ClipboardCheck size={20} />, "bg-green-100 text-green-400"),

  // Interview-related (purple)
  INTERVIEW_SCHEDULED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_COMPLETED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_CANCELLED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_RESCHEDULED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_STARTED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_FEEDBACK_SUBMITTED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_DELETED: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),
  INTERVIEW_RESULT_SENT: iconWrapper(<CalendarCheck size={20} />, "bg-purple-100 text-purple-400"),

  // Candidate-related (orange)
  CANDIDATE_ADDED: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),
  CANDIDATE_UPDATED: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),
  CANDIDATE_DELETED: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),
  CANDIDATE_HIRED: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),
  CANDIDATE_REJECTED: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),
  CANDIDATE_MOVED_TO_NEXT_STAGE: iconWrapper(<UserPlus size={20} />, "bg-orange-100 text-orange-400"),

  // System (cyan)
  USER_LOGIN: iconWrapper(<MessageCircle size={20} />, "bg-cyan-200 text-cyan-700"),
  USER_LOGOUT: iconWrapper(<MessageCircle size={20} />, "bg-cyan-200 text-cyan-700"),
  USER_REGISTERED: iconWrapper(<UserPlus size={20} />, "bg-cyan-200 text-cyan-700"),
  SETTINGS_UPDATED: iconWrapper(<Settings size={20} />, "bg-cyan-200 text-cyan-700"),
  PROFILE_UPDATED: iconWrapper(<UserPlus size={20} />, "bg-cyan-200 text-cyan-700"),

  // Company (teal)
  COMPANY_CREATED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  COMPANY_UPDATED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  COMPANY_DELETED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  COMPANY_LOCATION_ADDED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  COMPANY_LOCATION_UPDATED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  COMPANY_LOCATION_DELETED: iconWrapper(<Building2 size={20} />, "bg-teal-100 text-teal-400"),
  TEAM_MEMBER_INVITED: iconWrapper(<UserPlus size={20} />, "bg-teal-100 text-teal-400"),
  TEAM_MEMBER_UPDATED: iconWrapper(<UserPlus size={20} />, "bg-teal-100 text-teal-400"),
  TEAM_MEMBER_DELETED: iconWrapper(<UserPlus size={20} />, "bg-teal-100 text-teal-400"),

  // AI (pink)
  AI_QUESTIONS_GENERATED: iconWrapper(<Brain size={20} />, "bg-pink-100 text-pink-400"),
  AI_EVALUATION_COMPLETED: iconWrapper(<Brain size={20} />, "bg-pink-100 text-pink-400"),
  AI_RESUME_ANALYZED: iconWrapper(<FileText size={20} />, "bg-pink-100 text-pink-400"),
}

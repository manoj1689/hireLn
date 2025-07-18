interface InterviewerInfo {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface InterviewScheduleRequest {
  candidateId: string;
  applicationId: string;
  type: string;  // ✅ not 'type'
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  timezone: string;
  meetingLink: string;
  location: string;
  notes: string;
  sendCalendarInvite: boolean;
  sendEmailNotification: boolean;
  interviewers: InterviewerInfo[];
}


export interface InterviewResponse {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  interviewType: string; // e.g. "PHONE", "VIDEO"
  status: string;        // e.g. "SCHEDULED", "COMPLETED"
  scheduledAt: string;   // ISO datetime string
  duration: number;
  timezone: string;
  interviewers: InterviewerInfo[];
  meetingLink?: string;
  location?: string;
  notes?: string;
  feedback?: any;
  calendarEventId?: string;
  invitationSent?: boolean;
  joinToken?: string;
  tokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

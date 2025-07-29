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
  interviewType: 'PHONE' | 'VIDEO' | 'IN_PERSON' | string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | string;
  scheduledAt: string; // ISO datetime string
  duration: number;
  timezone: string;
  interviewers: InterviewerInfo[]; // define separately
  meetingLink: string;
  location: string;
  notes: string;
  feedback: Record<string, any>;
  calendarEventId: string;
  invitationSent: boolean;
  joinToken: string;
  tokenExpiry: string;
  createdAt: string;
  updatedAt: string;

  // Candidate Info
  candidateEducation: string;
  candidateExperience: string;
  candidateSkills: string[];
  candidateResume: string;
  candidatePortfolio: string;
  candidateLinkedIn: string;
  candidateGitHub: string;
  candidateLocation: string;

  // Application Info
  coverLetter: string;

  // Job Info
  jobDepartment: string;
  jobDescription: string;
  jobType: string;
  jobResponsibility: string[];
  jobSkills: string[];
  jobEducation: string;
  jobCertificates: string[];
  jobPublished: string;
}

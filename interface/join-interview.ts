interface Interviewer {
  name: string
  role?: string
}

export interface InterviewJoinData {
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
  interviewers: Interviewer[]; // define separately
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
  startedAt:string;
  completedAt:string;

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

export interface InterviewJoinState {
  loading: boolean;
  error: string | null;
  interview: InterviewJoinData | null; // 👈 Allow null
  confirmationMessage: string | null;
  redirectUrl: string | null;
  status: string | null;
}

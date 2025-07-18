interface Interviewer {
  name: string
  role?: string
}

export interface InterviewJoinData {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  applicationId: string
  jobId: string
  jobTitle: string
  interviewType: string
  status: string
  scheduledAt: string
  duration: number
  timezone: string
  interviewers: Interviewer[]
  meetingLink?: string
  location?: string
  notes?: string
  feedback?: any
  invitationSent?: boolean
  joinToken?: string
  tokenExpiry?: string
  createdAt: string
  updatedAt: string
}


export interface InterviewJoinState {
  loading: boolean;
  error: string | null;
  interview: any; // or a proper Interview type
  confirmationMessage: string | null;
  redirectUrl: string | null;
  status: string | null;
}
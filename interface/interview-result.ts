// interface/interview-result.ts

export interface Evaluation {
  id: string
  questionText: string
  answerText: string
  finalEvaluation: string
  factualAccuracy: string
  completeness: string
  relevance: string
  coherence: string
  score: number
  evaluatedAt: string
}

export interface InterviewData {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  jobTitle: string
  scheduledAt: string
  duration: number
  status: string
  interviewType: string
  meetingLink?: string
  interviewers: {
    name: string
    email: string
    avatar: string
  }[]
}

export interface InterviewResultResponse {
  recommendations: string
  id: string
  applicationId:string
  interviewId: string
  candidateId: string
  jobId: string
  averageScore: number
  averageFactualAccuracy: number
  averageCompleteness: number
  averageRelevance: number
  averageCoherence: number
  evaluatedCount: number
  totalQuestions: number
  passStatus: string
  knowledgeLevel: string
  summaryResult: string
  interview: InterviewData
  evaluations: Evaluation[]
  createdAt: string
  updatedAt: string
}

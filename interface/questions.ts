export interface InterviewQuestion {
  id: string
  questionText: string
  expectedAnswerFormat: string
  interviewId: string
  createdAt: string
  updatedAt: string

  
}



export interface InterviewQuestionState {
  loading: boolean
  error: string | null
  questions: InterviewQuestion[]
}

export interface InterviewQuestionResponse {
  id: string
  questionText: string
  expectedAnswerFormat: string
  interviewId: string
  createdAt: string
  updatedAt: string
}

export interface InterviewAnswerResponse {
  id: string
  answerText: string
  questionId: string
  interviewId: string
  answeredAt: string
  createdAt: string
  updatedAt: string
}


export interface QuestionEvaluation {
  id: string;
  questionText: string;
  answerText: string;
  interviewId: string;
  expectedAnswerFormat: string;
  factualAccuracy: string;
  factualAccuracyExplanation: string;
  completeness: string;
  completenessExplanation: string;
  relevance: string;
  relevanceExplanation: string;
  coherence: string;
  coherenceExplanation: string;
  score: number;
  inputTokens: number;
  outputTokens: number;
  finalEvaluation: string;
  createdAt: string;
  updatedAt: string;
  answeredAt: string;
  evaluatedAt: string;
}

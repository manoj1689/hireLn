interface EvaluationData {
  questionId: string;
  questionText: string;
  answerText?: string;
  evaluation?: any;
  error?: string;
  score?: number;
}

export interface InterviewEvaluationState {
  loading: boolean;
  error: string | null;
  data: {
    success: boolean;
    interviewId: string;
    evaluatedCount: number;
    averageFactualAccuracy: number;
    averageCompleteness: number;
    averageRelevance: number;
    averageCoherence: number;
    averageScore: number;
    passStatus: string;
    summaryResult: string;
    evaluations: EvaluationData[];
  } | null;
}
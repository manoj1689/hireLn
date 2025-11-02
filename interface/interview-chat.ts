// -------------------------------
// Interfaces
// -------------------------------
export interface ChatHistoryItem {
  question: string;
  answer: string;
  score?: number;
  level?: number;
  timestamp?: string;
}

export interface StartInterviewPayload {
  interviewId: string;
  candidate: any;
  token?: string;
}

export interface ChatRequestPayload {
  interviewId: string;
  user_input: string;
  question: string;
  last_level: number;
  jd_text: any; // previously string, should be object/dict as per backend
  history: ChatHistoryItem[];
  last_score?: number;
  token?: string;
}

export interface SaveChatPayload {
  interviewId: string;
  candidateId: string;
  applicationId: string;
  history: ChatHistoryItem[];
  token?: string;
}

export interface EvaluatePayload {
  interviewId: string;
  token?: string;
}

export interface InterviewChatState {
  loading: boolean;
  error: string | null;
  chatHistory: ChatHistoryItem[];
  greeting:null
  currentQuestion: string | null;
  lastScore: number | null;  // ✅ added
  level: number;
  intent: string | null;     // ✅ added for AI intent tracking
  evaluation?: any | null;
}

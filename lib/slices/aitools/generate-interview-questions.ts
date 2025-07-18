// lib/slices/interview-question-Slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { log } from "console"

interface InterviewQuestion {
  question_text: string
  expected_answer_format: string
}

interface InterviewQuestionState {
  questions: InterviewQuestion[]
  job_title: string
  candidate_name: string
  interview_type: string
  input_tokens: number
  output_tokens: number
  loading: boolean
  error: string | null
}

const initialState: InterviewQuestionState = {
  questions: [],
  job_title: "",
  candidate_name: "",
  interview_type: "",
  input_tokens: 0,
  output_tokens: 0,
  loading: false,
  error: null,
}

// ✅ Corrected Async thunk to generate questions
export const generateInterviewQuestions = createAsyncThunk(
  "interviewQuestions/generate",
  async (
    {
      jobId,
      candidateId,
      interviewType,
      numberOfQuestions,
      token,
    }: {
      jobId: string
      candidateId: string
      interviewType: string
      numberOfQuestions: number
      token: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/ai-tools/generate_interview_questions_from_jobCandidate`,
        {
          job_id: jobId,
          candidate_id: candidateId,
          interview_type: interviewType,
          number_of_questions: numberOfQuestions,
        },
        {
          headers: {
            "X-Interview-Token": token,
          },
        }
      )
      console.log("Question List",response.data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to generate questions"
      )
    }
  }
)

const interviewQuestionSlice = createSlice({
  name: "interviewQuestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateInterviewQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.job_title = action.payload.job_title
        state.candidate_name = action.payload.candidate_name
        state.interview_type = action.payload.interview_type
        state.input_tokens = action.payload.input_tokens
        state.output_tokens = action.payload.output_tokens
      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default interviewQuestionSlice.reducer

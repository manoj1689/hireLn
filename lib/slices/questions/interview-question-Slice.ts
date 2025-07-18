import {
  InterviewQuestionResponse,
  InterviewQuestionState,
} from "@/interface/questions";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Initial State ---
const initialState: InterviewQuestionState = {
  loading: false,
  error: null,
  questions: [],
};

// --- ✅ Fetch Interview Questions ---
export const fetchInterviewQuestions = createAsyncThunk<
  InterviewQuestionResponse[],
  { interviewId: string; token: string },
  { rejectValue: string }
>(
  "interviewQuestions/fetch",
  async ({ interviewId, token }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/questions/interview-questions/${interviewId}`,
        {
          headers: {
            "X-Interview-Token": token,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.detail || "Failed to load interview questions"
      );
    }
  }
);

// --- ✅ Slice ---
const interviewQuestionSlice = createSlice({
  name: "interviewQuestions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchInterviewQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default interviewQuestionSlice.reducer;

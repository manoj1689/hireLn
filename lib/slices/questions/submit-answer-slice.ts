import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { InterviewAnswerResponse } from "@/interface/questions";

interface SubmitAnswerState {
  loading: boolean;
  error: string | null;
  lastResponse: InterviewAnswerResponse | null;
}

const initialState: SubmitAnswerState = {
  loading: false,
  error: null,
  lastResponse: null,
};

// --- ✅ Submit Interview Answer ---
export const submitInterviewAnswer = createAsyncThunk<
  InterviewAnswerResponse,
  {
    questionId: string;
    token: string;
    answerText: string;
    interviewId: string;
  },
  { rejectValue: string }
>(
  "submitAnswer/submitInterviewAnswer",
  async ({ questionId, token, answerText, interviewId }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/questions/questions/${questionId}/answer`,
        { answerText, questionId, interviewId },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Interview-Token": token,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.detail || "Failed to submit answer"
      );
    }
  }
);

// --- ✅ Slice ---
const submitAnswerSlice = createSlice({
  name: "submitAnswer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitInterviewAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitInterviewAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.lastResponse = action.payload;
        console.log("Answer submitted successfully:", action.payload);
      })
      .addCase(submitInterviewAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default submitAnswerSlice.reducer;

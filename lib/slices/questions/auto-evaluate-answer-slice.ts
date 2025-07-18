import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
import { QuestionEvaluation } from "@/interface/questions";

interface EvaluationState {
  loading: boolean;
  error: string | null;
  evaluations: QuestionEvaluation[];
}

const initialState: EvaluationState = {
  loading: false,
  error: null,
  evaluations: [],
};

// ✅ Thunk to call auto-evaluate API
export const autoEvaluateAnswer = createAsyncThunk<
  QuestionEvaluation,
  { answerId: string; token: string; knowledgeLevel?: string },
  { rejectValue: string }
>(
  "evaluation/autoEvaluateAnswer",
  async ({ answerId, token, knowledgeLevel = "intermediate" }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/questions/answers/${answerId}/auto-evaluate`,
        null,
        {
          headers: {
            "X-Interview-Token": token,
          },
          params: {
            knowledge_level: knowledgeLevel,
          },
        }
      );
      return response.data as QuestionEvaluation;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.detail || "Evaluation failed"
      );
    }
  }
);

export const questionAnswerEvaluationSlice = createSlice({
  name: "evaluation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(autoEvaluateAnswer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoEvaluateAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations.push(action.payload);
      })
      .addCase(autoEvaluateAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default questionAnswerEvaluationSlice.reducer;
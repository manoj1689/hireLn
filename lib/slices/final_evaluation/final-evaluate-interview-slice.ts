import { InterviewEvaluationState } from '@/interface/final-evaluation';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


const initialState: InterviewEvaluationState = {
  loading: false,
  error: null,
  data: null,
};

// Async thunk
export const fetchInterviewEvaluation = createAsyncThunk(
  'interviewEvaluation/fetch',
  async (
    {
      interviewId,
      token,
      knowledgeLevel = 'intermediate',
    }: { interviewId: string; token: string; knowledgeLevel?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/interviews/interview/${interviewId}/auto-evaluate?knowledge_level=${knowledgeLevel}`,
        {},
        {
          headers: {
            'X-Interview-Token': token,
            Accept: 'application/json',
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Something went wrong');
    }
  }
);

const interviewEvaluationSlice = createSlice({
  name: 'interviewEvaluation',
  initialState,
  reducers: {
    clearEvaluation: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviewEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInterviewEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

//export const { clearEvaluation } = interviewEvaluationSlice.actions;

export default interviewEvaluationSlice.reducer;

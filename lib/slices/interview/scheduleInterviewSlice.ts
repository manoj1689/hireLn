import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InterviewResponse,InterviewScheduleRequest } from '@/interface/interview';
import axiosApi from '@/services/api';



interface InterviewState {
  loading: boolean;
  error: string | null;
  data: InterviewResponse | null;
}

const initialState: InterviewState = {
  loading: false,
  error: null,
  data: null,
};

export const scheduleInterview = createAsyncThunk<InterviewResponse, InterviewScheduleRequest>(
  'interview/schedule',
  async (formData, { rejectWithValue }) => {
    try {
      console.log("sedule form data",formData)
      const response = await axiosApi.post<InterviewResponse>(
        '/api/interviews/schedule',
        formData
      );
      console.log("Interview scheduled:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to schedule interview');
    }
  }
);

const scheduleInterviewSlice = createSlice({
  name: 'scheduleInterview',
  initialState,
  reducers: {
    resetInterviewSchedule: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scheduleInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleInterview.fulfilled, (state, action: PayloadAction<InterviewResponse>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetInterviewSchedule } = scheduleInterviewSlice.actions;
export default scheduleInterviewSlice.reducer;

// lib/slices/interview/fetchInterviewSlice.ts

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { InterviewResponse } from '@/interface/interview';

interface InterviewState {
  interviews: InterviewResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  interviews: [],
  loading: false,
  error: null,
};

// Fetch all interviews with filters
export const fetchInterviews = createAsyncThunk<
  InterviewResponse[],
  {
    candidate_id?: string;
    application_id?: string;
    job_id?: string;
    status?: string;
    type?: string;
    from_date?: string;
    to_date?: string;
    skip?: number;
    limit?: number;
  }
>('interview/fetchInterviews', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });

    const response = await axiosApi.get<InterviewResponse[]>(
      `/api/interviews/?${query.toString()}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews');
  }
});

// ✅ Get interview by ID
export const getInterviewById = createAsyncThunk<
  InterviewResponse,
  string
>('interview/getInterviewById', async (interviewId, { rejectWithValue }) => {
  try {
    const response = await axiosApi.get<InterviewResponse>(`/api/interviews/${interviewId}`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch interview details');
  }
});

// ✅ Delete interview by ID
export const deleteInterview = createAsyncThunk<
  { interviewId: string },
  string
>('interview/deleteInterview', async (interviewId, { rejectWithValue }) => {
  try {
    await axiosApi.delete(`/api/interviews/${interviewId}`);
    return { interviewId };
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete interview');
  }
});

// Slice
const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.interviews = state.interviews.filter(
          (i) => i.id !== action.payload.interviewId
        );
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(getInterviewById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default interviewSlice.reducer;

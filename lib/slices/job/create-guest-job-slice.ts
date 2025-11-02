import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "@/services/api";
import { JobCreatePayload, JobResponse } from "@/interface/create-job";

interface JobState {
  job: JobResponse | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: JobState = {
  job: null,
  loading: false,
  error: null,
  message: null,
};

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (data: JobCreatePayload, { rejectWithValue }) => {
    try {
      const res = await axiosApi.post<JobResponse>("/api/jobs/create-job", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Job creation failed");
    }
  }
);

const jobCreateSlice = createSlice({
  name: "jobCreate",
  initialState,
  reducers: {
    resetJobState: (state) => {
      state.job = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
        state.message = "Job created successfully";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetJobState } = jobCreateSlice.actions;
export default jobCreateSlice.reducer;

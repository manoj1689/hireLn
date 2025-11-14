import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosApi from '@/services/api';
import { JobsState, JobListData, JobData } from '@/interface/jobsteps';

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  job: null,
};

// Fetch jobs
export const fetchJobs = createAsyncThunk<JobListData[], { skip: number; limit: number; status?: string; department?: string; search?: string }>(
  'jobs/fetchJobs',
  async (params, thunkAPI) => {
    try {
      const { skip, limit, status, department, search } = params;
      const queryParams: any = { skip, limit };
      if (status) queryParams.status = status;
      if (department) queryParams.department = department;
      if (search) queryParams.search = search;

      const response = await axiosApi.get('/api/jobs/', { params: queryParams });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch job by ID
export const fetchJobById = createAsyncThunk<JobData, string>(
  'jobs/fetchJobById',
  async (jobId, thunkAPI) => {
    try {
      const response = await axiosApi.get(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch invite job by ID (optional token)
export const fetchInviteJobById = createAsyncThunk<JobData, { jobId: string; token?: string }>(
  'jobs/fetchInviteJobById',
  async ({ jobId, token }, thunkAPI) => {
    try {
      const response = await axiosApi.get(`/api/jobs/invite/${jobId}`, {
        headers: { 'X-Interview-Token': token || '' },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update job
export const updateJob = createAsyncThunk<JobData, { jobId: string; updatedJob: JobData }>(
  'jobs/updateJob',
  async ({ jobId, updatedJob }, thunkAPI) => {
    try {
      const response = await axiosApi.put(`/api/jobs/${jobId}`, updatedJob);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk<{ jobId: string }, string>(
  'jobs/deleteJob',
  async (jobId, thunkAPI) => {
    try {
      await axiosApi.delete(`/api/jobs/${jobId}`);
      return { jobId }; // Return jobId explicitly
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete job');
    }
  }
);

// Slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch invite job by ID
      .addCase(fetchInviteJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInviteJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload;
      })
      .addCase(fetchInviteJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        state.jobs = state.jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job));
        state.job = updatedJob;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job.id !== action.payload.jobId);
        if (state.job?.id === action.payload.jobId) {
          state.job = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default jobSlice.reducer;
